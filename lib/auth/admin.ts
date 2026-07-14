import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminProfile =
  Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims.sub) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", claims.claims.sub)
    .eq("ativo", true)
    .maybeSingle();

  if (profileError) {
    throw new Error("Nao foi possivel carregar o perfil administrativo.");
  }

  return profile;
}

export async function requireAdminProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

