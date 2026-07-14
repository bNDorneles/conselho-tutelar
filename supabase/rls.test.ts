import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260714000200_enable_rls_policies.sql"
);

function readMigration() {
  return readFileSync(migrationPath, "utf8").toLowerCase();
}

describe("RLS policies migration", () => {
  it("enables RLS on every public application table", () => {
    const sql = readMigration();

    for (const tableName of [
      "profiles",
      "conselho_tutelar",
      "motivos_denuncia",
      "denuncias",
      "vitimas",
      "chamados",
      "medidas_protetivas",
      "encaminhamentos",
      "audit_logs",
    ]) {
      expect(sql).toContain(
        `alter table public.${tableName} enable row level security`
      );
    }
  });

  it("creates role helper functions for active profiles", () => {
    const sql = readMigration();

    expect(sql).toContain("create or replace function public.current_profile_role()");
    expect(sql).toContain("create or replace function public.is_active_conselheiro()");
    expect(sql).toContain("create or replace function public.is_active_admin()");
    expect(sql).toContain("(select auth.uid())");
  });

  it("allows anonymous inserts into denuncias without public reads", () => {
    const sql = readMigration();

    expect(sql).toContain("on public.denuncias for insert");
    expect(sql).toContain("to anon");
    expect(sql).not.toMatch(/on public\.denuncias for select\s+to anon/);
  });

  it("allows administrative reads for sensitive records", () => {
    const sql = readMigration();

    for (const tableName of [
      "denuncias",
      "vitimas",
      "chamados",
      "encaminhamentos",
      "audit_logs",
    ]) {
      expect(sql).toContain(`on public.${tableName} for select`);
      expect(sql).toContain("public.is_active_conselheiro()");
    }
  });

  it("limits catalog maintenance to admins", () => {
    const sql = readMigration();

    expect(sql).toContain("public.is_active_admin()");
    expect(sql).toContain("on public.motivos_denuncia for all");
    expect(sql).toContain("on public.medidas_protetivas for all");
    expect(sql).toContain("on public.conselho_tutelar for all");
  });
});

