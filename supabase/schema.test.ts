import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260714000100_create_initial_schema.sql"
);
const seedPath = join(process.cwd(), "supabase", "seed.sql");

function readSql(path: string) {
  return readFileSync(path, "utf8").toLowerCase();
}

describe("initial Supabase schema migration", () => {
  it("declares the expected enums", () => {
    const sql = readSql(migrationPath);

    for (const enumName of [
      "profile_role",
      "denuncia_status",
      "chamado_status",
      "audit_action",
    ]) {
      expect(sql).toContain(`create type public.${enumName}`);
    }
  });

  it("creates every table required by the MVP flow", () => {
    const sql = readSql(migrationPath);

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
      expect(sql).toContain(`create table public.${tableName}`);
    }
  });

  it("includes foreign keys for denuncia, chamado and encaminhamento flow", () => {
    const sql = readSql(migrationPath);

    expect(sql).toContain("references public.motivos_denuncia(id)");
    expect(sql).toContain("references public.denuncias(id)");
    expect(sql).toContain("references public.vitimas(id)");
    expect(sql).toContain("references public.chamados(id)");
    expect(sql).toContain("references public.medidas_protetivas(id)");
  });

  it("creates indexes for common triage and reporting filters", () => {
    const sql = readSql(migrationPath);

    for (const indexName of [
      "idx_denuncias_status",
      "idx_denuncias_motivo_id",
      "idx_chamados_status",
      "idx_chamados_conselheiro_id",
      "idx_encaminhamentos_chamado_id",
      "idx_audit_logs_entity",
    ]) {
      expect(sql).toContain(`create index ${indexName}`);
    }
  });

  it("keeps RLS policies out of issue 4", () => {
    const sql = readSql(migrationPath);

    expect(sql).not.toContain("create policy");
    expect(sql).not.toContain("enable row level security");
  });
});

describe("initial Supabase seed", () => {
  it("seeds only safe catalog and institution data", () => {
    const sql = readSql(seedPath);

    expect(sql).toContain("insert into public.motivos_denuncia");
    expect(sql).toContain("insert into public.medidas_protetivas");
    expect(sql).toContain("insert into public.conselho_tutelar");
    expect(sql).not.toContain("insert into public.denuncias");
    expect(sql).not.toContain("insert into public.vitimas");
    expect(sql).not.toContain("insert into public.chamados");
  });
});

