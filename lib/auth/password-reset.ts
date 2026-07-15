export type PasswordResetEmailResult =
  | { ok: true; email: string }
  | { ok: false; error: "missing_email" };

export type PasswordUpdateResult =
  | { ok: true; password: string }
  | { ok: false; error: "weak_password" | "password_mismatch" };

export function validatePasswordResetEmail(
  email: string,
): PasswordResetEmailResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { ok: false, error: "missing_email" };
  }

  return { ok: true, email: normalizedEmail };
}

export function validatePasswordUpdate(
  password: string,
  confirmation: string,
): PasswordUpdateResult {
  if (password.trim().length < 8) {
    return { ok: false, error: "weak_password" };
  }

  if (password !== confirmation) {
    return { ok: false, error: "password_mismatch" };
  }

  return { ok: true, password };
}

export function buildPasswordResetRedirectUrl({
  appUrl,
  path,
}: {
  appUrl: string;
  path: string;
}) {
  const baseUrl = new URL(appUrl);

  return new URL(path, baseUrl).toString();
}

export function resolvePasswordResetAppUrl(origin?: string | null) {
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    vercelUrl ||
    origin ||
    "http://localhost:3000"
  );
}
