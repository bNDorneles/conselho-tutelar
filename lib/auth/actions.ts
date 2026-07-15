"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  buildPasswordResetRedirectUrl,
  resolvePasswordResetAppUrl,
  validatePasswordResetEmail,
  validatePasswordUpdate,
} from "./password-reset";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function signInWithPasswordAction(formData: FormData) {
  const email = getStringValue(formData, "email");
  const password = getStringValue(formData, "password");

  if (!email || !password) {
    redirect("/login?error=missing_credentials");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();

  redirect("/login");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getStringValue(formData, "email");
  const validation = validatePasswordResetEmail(email);

  if (!validation.ok) {
    redirect(`/login/recuperar-senha?error=${validation.error}`);
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const redirectTo = buildPasswordResetRedirectUrl({
    appUrl: resolvePasswordResetAppUrl(origin),
    path: "/login/redefinir-senha",
  });
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    validation.email,
    {
      redirectTo,
    },
  );

  if (error) {
    redirect("/login/recuperar-senha?error=reset_failed");
  }

  redirect("/login/recuperar-senha?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  const code = getStringValue(formData, "code");
  const password = getStringValue(formData, "password");
  const confirmation = getStringValue(formData, "password_confirmation");
  const validation = validatePasswordUpdate(password, confirmation);

  if (!validation.ok) {
    const params = new URLSearchParams({ error: validation.error });

    if (code) {
      params.set("code", code);
    }

    redirect(`/login/redefinir-senha?${params.toString()}`);
  }

  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);

    if (codeError) {
      redirect("/login/redefinir-senha?error=invalid_link");
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: validation.password,
  });

  if (error) {
    redirect("/login/redefinir-senha?error=update_failed");
  }

  redirect("/login?message=password_updated");
}

