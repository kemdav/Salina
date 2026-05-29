import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { idNumber: string } }
) {
  const { idNumber } = params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase
    .from('digital_ids')
    .select(`
      is_active,
      expires_at,
      organization_memberships (
        role,
        user_id,
        organization_roles ( name )
      ),
      organizations (
        name
      )
    `)
    .eq('id_number', idNumber)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isExpired = new Date(data.expires_at) < new Date();
  if (isExpired || !data.is_active) {
    return NextResponse.json({ error: 'ID expired or inactive' }, { status: 410 });
  }
  
  const memberships = Array.isArray(data.organization_memberships) ? data.organization_memberships[0] : data.organization_memberships;
  const orgs = Array.isArray(data.organizations) ? data.organizations[0] : data.organizations;

  if (!memberships || !orgs) {
    return NextResponse.json({ error: 'Incomplete data' }, { status: 500 });
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(memberships.user_id);
  
  const name = userData?.user?.user_metadata?.display_name || 
               userData?.user?.user_metadata?.full_name || 
               userData?.user?.email?.split('@')[0] || 
               'Unknown User';

  const orgRoles = Array.isArray(memberships.organization_roles) ? memberships.organization_roles[0] : memberships.organization_roles;
  const roleName = orgRoles?.name || memberships.role;

  return NextResponse.json({
    name,
    role: roleName,
    organization: orgs.name,
    validity: 'Valid'
  });
}
