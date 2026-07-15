import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("DenunciasKanban client boundary", () => {
  it("does not import the server-only denuncias module", () => {
    const source = readFileSync(
      resolve(process.cwd(), "components/admin/denuncias-kanban.tsx"),
      "utf8",
    );

    expect(source).not.toContain("@/lib/admin/denuncias");
  });
});
