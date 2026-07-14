import { describe, expect, it } from "vitest";

import { resolveSupabaseConfig } from "./config";

describe("resolveSupabaseConfig", () => {
  it("accepts a valid Supabase URL and publishable key", () => {
    const config = resolveSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    });

    expect(config).toEqual({
      url: "https://project.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("rejects a missing Supabase URL", () => {
    expect(() =>
      resolveSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      })
    ).toThrow("Missing NEXT_PUBLIC_SUPABASE_URL");
  });

  it("rejects a missing Supabase publishable key", () => {
    expect(() =>
      resolveSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      })
    ).toThrow("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  });

  it("rejects an invalid Supabase URL", () => {
    expect(() =>
      resolveSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "not a url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      })
    ).toThrow("Invalid NEXT_PUBLIC_SUPABASE_URL");
  });

  it("rejects a Supabase URL with an unsupported protocol", () => {
    expect(() =>
      resolveSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "ftp://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      })
    ).toThrow("Invalid NEXT_PUBLIC_SUPABASE_URL");
  });
});

