export const AUTH_PASSWORD_MIN_LENGTH = 12;

export const AUTH_PASSWORD_REQUIREMENTS_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).+$/;

export const AUTH_PASSWORD_HELP_TEXT =
  "Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.";

type MetadataRecord = Record<string, unknown>;

function toMetadataRecord(value: unknown): MetadataRecord {
  return value && typeof value === "object" ? (value as MetadataRecord) : {};
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function isStrongPassword(value: string) {
  return (
    value.length >= AUTH_PASSWORD_MIN_LENGTH &&
    AUTH_PASSWORD_REQUIREMENTS_PATTERN.test(value)
  );
}

export function getAuthSessionClaims(user: {
  app_metadata?: unknown;
}) {
  const appMetadata = toMetadataRecord(user.app_metadata);
  const roles = getStringArray(appMetadata.roles);

  return {
    isPlatformAdmin:
      roles.includes("system_admin") || appMetadata.role === "system_admin",
    isTemporaryApplicant: appMetadata.temporary_applicant === true,
    tenantId:
      typeof appMetadata.tenant_id === "string"
        ? appMetadata.tenant_id
        : null,
  };
}
