import { createBrowserClient } from "@supabase/ssr";

import { resolveSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export function createBrowserSupabaseClient() {
  const config = resolveSupabaseConfig();

  return createBrowserClient<Database>(config.url, config.publishableKey);
}

