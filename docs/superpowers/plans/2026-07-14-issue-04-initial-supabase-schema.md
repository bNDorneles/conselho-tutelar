# Issue 04 Initial Supabase Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the initial Supabase/Postgres schema for complaints, cases, referrals, auxiliary catalogs, profiles, institution data, and audit logs.

**Architecture:** Keep schema in SQL migrations under `supabase/migrations`, seed safe catalog data in `supabase/seed.sql`, and mirror the schema in `lib/supabase/database.types.ts`. Add a static Vitest test that verifies the migration contains the required tables, enums, indexes, constraints, and seed references.

**Tech Stack:** Supabase/Postgres SQL, Next.js, TypeScript, Vitest, npm.

## Global Constraints

- Work on `issue/04-initial-supabase-schema` from `develop`.
- Use recommended model `gpt-5.6-sol`.
- Do not add RLS policies in this issue; RLS is Issue #6.
- Do not add auth screens or user management in this issue; auth is Issue #5.
- Do not commit real sensitive data.
- Keep build working without a live Supabase project.

---

## Task 1: Register Issue Context

**Files:**
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: issue metadata entry for #4.

- [ ] Add Issue #4 metadata with type `database/security`, model `gpt-5.6-sol`, branch base `develop`, branch `issue/04-initial-supabase-schema`, read docs, and expected commands `npm run test`, `npm run lint`, `npm run build`.

## Task 2: Write Static Schema Test

**Files:**
- Create: `supabase/schema.test.ts`

**Interfaces:**
- Consumes: `supabase/migrations/20260714000100_create_initial_schema.sql` and `supabase/seed.sql`.
- Produces: failing test before SQL exists.

- [ ] Add Vitest test that reads the migration and seed files and asserts required enums, tables, indexes, foreign keys, and safe seed values.
- [ ] Run `npm.cmd run test -- supabase/schema.test.ts` and verify it fails because files are missing.

## Task 3: Create Migration And Seed

**Files:**
- Create: `supabase/migrations/20260714000100_create_initial_schema.sql`
- Create: `supabase/seed.sql`

**Interfaces:**
- Produces: schema SQL.

- [ ] Create enums, tables, constraints, indexes, `updated_at` trigger function, and triggers.
- [ ] Create seed with generic motivos, medidas and institutional data.
- [ ] Run `npm.cmd run test -- supabase/schema.test.ts` and verify it passes.

## Task 4: Update Types And Docs

**Files:**
- Modify: `lib/supabase/database.types.ts`
- Modify: `README.md`
- Modify: `ai.context.md`
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: TypeScript representation and docs.

- [ ] Expand `Database` tables, enums and relationships for the initial schema.
- [ ] Update docs with Supabase migration/seed commands and current state.
- [ ] Record verification result.

## Task 5: Final Verification And Integration

**Files:**
- All modified files.

- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] If Supabase CLI is available, run a local SQL validation command; if unavailable, document that it was not run.
- [ ] Commit with `feat: add initial supabase schema`.
- [ ] Push `issue/04-initial-supabase-schema`.
- [ ] Merge into `develop` with merge commit.

## Self-Review

- Spec coverage: covers schema, seed, types, docs, and verification.
- Placeholder scan: no unresolved markers.
- Type consistency: table and enum names match issue context.

