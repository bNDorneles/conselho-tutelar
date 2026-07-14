import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { resolveSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export async function createServerSupabaseClient() {
  const config = resolveSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Middleware/Actions can.
        }
      },
    },
  });
}

