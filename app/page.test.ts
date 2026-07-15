import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("public home copy", () => {
  const source = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8");
  const publicLayerSource =
    source +
    readFileSync(
      join(process.cwd(), "lib", "public", "conselho.ts"),
      "utf8",
    );

  it("does not expose implementation or MVP language to citizens", () => {
    expect(source).not.toContain("Supabase");
    expect(source).not.toContain("RLS");
    expect(source).not.toContain("implementados");
    expect(source).not.toContain("primeira interface");
    expect(source).not.toContain("modernizacao academica");
  });

  it("presents real public contact channels", () => {
    expect(publicLayerSource).toContain("WhatsApp");
    expect(publicLayerSource).toContain("Facebook");
    expect(publicLayerSource).toContain("Instagram");
    expect(publicLayerSource).toContain("Localizacao");
  });
});
