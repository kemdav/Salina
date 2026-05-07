"use server";

import { z } from "zod";

import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { getTenantAppUrl } from "@/lib/root-domain";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getCurrentViewer,
  resolveCurrentTenant,
} from "@/lib/supabase/server";

const createTemporaryApplicantSchema = z.object({
  applicantEmail: z.string().trim().email("Enter a valid email address."),
  applicantName: z.string().trim().min(1, "Applicant name is required."),
});

const confirmTemporaryApplicantSchema = z.object({
  temporaryApplicantId: z.string().uuid("Select a valid temporary applicant."),
});

export type TemporaryApplicantActionState = {
  error?: string;
  inviteToken?: string;
  inviteUrl?: string;
  notice?: string;
  fields: {
    applicantEmail: string;
    applicantName: string;
  };
};

type TemporaryApplicantRecord = {
  applicant_email: string;
  applicant_name: string;
  applicant_user_id: string | null;
  id: string;
  invite_token: string;
  status: string;
  tenant_id: string;
};

function getCurrentAppMetadata(user: {
  app_metadata?: unknown;
}) {
  return user.app_metadata && typeof user.app_metadata === "object"
    ? (user.app_metadata as Record<string, unknown>)
    : {};
}

function getCurrentUserMetadata(user: {
  user_metadata?: unknown;
}) {
  return user.user_metadata && typeof user.user_metadata === "object"
    ? (user.user_metadata as Record<string, unknown>)
    : {};
}

async function getAuthorizedTenantContext() {
  const viewer = await getCurrentViewer();
  const tenantContext = await resolveCurrentTenant();

  if (!viewer || !tenantContext.tenant) {
    return { tenantContext, viewer };
  }

  if (!canManageTemporaryApplicants(viewer)) {
    return { tenantContext, viewer };
  }

  return { tenantContext, viewer };
}

async function buildInviteUrl(tenantSlug: string, inviteToken: string) {
  return `${await getTenantAppUrl(tenantSlug)}/sign-up?invite=${inviteToken}`;
}

async function updateTemporaryApplicantMetadata({
  adminClient,
  applicantUserId,
  tenantId,
  tenantSlug,
  temporaryApplicantId,
  isTemporaryApplicant,
}: {
  adminClient: NonNullable<ReturnType<typeof createSupabaseAdminClient>>;
  applicantUserId: string;
  tenantId: string;
  tenantSlug: string;
  temporaryApplicantId: string;
  isTemporaryApplicant: boolean;
}) {
  const { data: userResult, error: userError } = await adminClient.auth.admin.getUserById(
    applicantUserId,
  );

  if (userError || !userResult.user) {
    throw userError ?? new Error("Unable to load the applicant account.");
  }

  const currentAppMetadata = getCurrentAppMetadata(userResult.user);
  const currentUserMetadata = getCurrentUserMetadata(userResult.user);

  const { error: metadataError } = await adminClient.auth.admin.updateUserById(
    applicantUserId,
    {
      app_metadata: {
        ...currentAppMetadata,
        tenant_id: tenantId,
        tenant_slug: tenantSlug,
        temporary_applicant: isTemporaryApplicant,
        temporary_applicant_id: temporaryApplicantId,
      },
      user_metadata: {
        ...currentUserMetadata,
        tenant_id: tenantId,
        tenant_slug: tenantSlug,
        temporary_applicant: isTemporaryApplicant,
        temporary_applicant_id: temporaryApplicantId,
      },
    },
  );

  if (metadataError) {
    throw metadataError;
  }
}

export async function createTemporaryApplicantAction(
  _previousState: TemporaryApplicantActionState,
  formData: FormData,
): Promise<TemporaryApplicantActionState> {
  const values = createTemporaryApplicantSchema.safeParse({
    applicantEmail: String(formData.get("applicantEmail") ?? "").trim(),
    applicantName: String(formData.get("applicantName") ?? "").trim(),
  });

  if (!values.success) {
    const fieldErrors = values.error.flatten().fieldErrors;

    return {
      error: undefined,
      fields: {
        applicantEmail: String(formData.get("applicantEmail") ?? "").trim(),
        applicantName: String(formData.get("applicantName") ?? "").trim(),
      },
      inviteToken: undefined,
      inviteUrl: undefined,
      notice: fieldErrors.applicantEmail?.[0] ?? fieldErrors.applicantName?.[0] ?? "Enter applicant details.",
    };
  }

  const adminClient = createSupabaseAdminClient("temporary-applicants-create");
  const { tenantContext, viewer } = await getAuthorizedTenantContext();

  if (!adminClient) {
    return {
      error: "Temporary applicant creation is unavailable right now.",
      fields: {
        applicantEmail: values.data.applicantEmail,
        applicantName: values.data.applicantName,
      },
    };
  }

  if (!viewer || !tenantContext.tenant) {
    return {
      error: "You must be signed in to create a temporary applicant.",
      fields: {
        applicantEmail: values.data.applicantEmail,
        applicantName: values.data.applicantName,
      },
    };
  }

  if (!canManageTemporaryApplicants(viewer)) {
    return {
      error: "You do not have permission to create temporary applicants.",
      fields: {
        applicantEmail: values.data.applicantEmail,
        applicantName: values.data.applicantName,
      },
    };
  }

  const { data: applicant, error } = await adminClient
    .from("temporary_applicants")
    .insert({
      applicant_email: values.data.applicantEmail,
      applicant_name: values.data.applicantName,
      invited_by: viewer.id,
      tenant_id: tenantContext.tenant.id,
    })
    .select("id, invite_token")
    .single<{ id: string; invite_token: string }>();

  if (error || !applicant) {
    return {
      error: error?.message ?? "Unable to create the temporary applicant.",
      fields: {
        applicantEmail: values.data.applicantEmail,
        applicantName: values.data.applicantName,
      },
    };
  }

  return {
    error: undefined,
    fields: {
      applicantEmail: values.data.applicantEmail,
      applicantName: values.data.applicantName,
    },
    inviteToken: applicant.invite_token,
    inviteUrl: await buildInviteUrl(tenantContext.tenant.slug, applicant.invite_token),
    notice: `Temporary applicant created for ${values.data.applicantName}.`,
  };
}

export async function confirmTemporaryApplicantAction(
  _previousState: TemporaryApplicantActionState,
  formData: FormData,
): Promise<TemporaryApplicantActionState> {
  const values = confirmTemporaryApplicantSchema.safeParse({
    temporaryApplicantId: String(formData.get("temporaryApplicantId") ?? "").trim(),
  });

  if (!values.success) {
    return {
      error: values.error.issues[0]?.message ?? "Select a temporary applicant.",
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  const adminClient = createSupabaseAdminClient("temporary-applicants-confirm");
  const { tenantContext, viewer } = await getAuthorizedTenantContext();

  if (!adminClient) {
    return {
      error: "Temporary applicant confirmation is unavailable right now.",
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  if (!viewer || !tenantContext.tenant) {
    return {
      error: "You must be signed in to confirm a temporary applicant.",
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  if (!canManageTemporaryApplicants(viewer)) {
    return {
      error: "You do not have permission to confirm temporary applicants.",
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  const { data: applicant, error } = await adminClient
    .from("temporary_applicants")
    .select("id, tenant_id, applicant_email, applicant_name, applicant_user_id, invite_token, status")
    .eq("id", values.data.temporaryApplicantId)
    .eq("tenant_id", tenantContext.tenant.id)
    .maybeSingle<TemporaryApplicantRecord>();

  if (error) {
    return {
      error: error.message,
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  if (!applicant) {
    return {
      error: "Temporary applicant not found.",
      fields: {
        applicantEmail: "",
        applicantName: "",
      },
    };
  }

  if (!applicant.applicant_user_id) {
    return {
      error: "That applicant has not created an account yet.",
      fields: {
        applicantEmail: applicant.applicant_email,
        applicantName: applicant.applicant_name,
      },
    };
  }

  const { data: existingMembership } = await adminClient
    .from("organization_memberships")
    .select("id")
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("user_id", applicant.applicant_user_id)
    .maybeSingle<{ id: string }>();

  if (existingMembership) {
    return {
      error: "This applicant is already an official member.",
      fields: {
        applicantEmail: applicant.applicant_email,
        applicantName: applicant.applicant_name,
      },
    };
  }

  const { data: membership, error: membershipError } = await adminClient
    .from("organization_memberships")
    .insert({
      role: "member",
      tenant_id: tenantContext.tenant.id,
      user_id: applicant.applicant_user_id,
    })
    .select("id")
    .single<{ id: string }>();

  if (membershipError || !membership) {
    return {
      error: membershipError?.message ?? "Unable to convert the temporary applicant.",
      fields: {
        applicantEmail: applicant.applicant_email,
        applicantName: applicant.applicant_name,
      },
    };
  }

  await updateTemporaryApplicantMetadata({
    adminClient,
    applicantUserId: applicant.applicant_user_id,
    tenantId: tenantContext.tenant.id,
    tenantSlug: tenantContext.tenant.slug,
    temporaryApplicantId: applicant.id,
    isTemporaryApplicant: false,
  });

  const { error: updateError } = await adminClient
    .from("temporary_applicants")
    .update({
      approved_at: new Date().toISOString(),
      approved_by: viewer.id,
      converted_at: new Date().toISOString(),
      converted_membership_id: membership.id,
      status: "converted",
    })
    .eq("id", applicant.id);

  if (updateError) {
    return {
      error: updateError.message,
      fields: {
        applicantEmail: applicant.applicant_email,
        applicantName: applicant.applicant_name,
      },
    };
  }

  return {
    error: undefined,
    fields: {
      applicantEmail: applicant.applicant_email,
      applicantName: applicant.applicant_name,
    },
    notice: `${applicant.applicant_name} was converted into an official member.`,
  };
}

