import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  console.log("Checking requests...");
  const { data: requests, error: err1 } = await supabase.from('accreditation_requests').select('*');
  console.log("Requests:", requests, err1);

  console.log("Checking orgs...");
  const { data: orgs, error: err2 } = await supabase.from('organizations').select('id, name, status');
  console.log("Orgs:", orgs, err2);
}

check();
