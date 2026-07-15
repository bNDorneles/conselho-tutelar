# Issues 17-20 Produto Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar as Issues 17 a 20 para transformar a area publica e administrativa em uma entrega mais real do Conselho Tutelar.

**Architecture:** Cada issue deve sair de `develop` em branch propria e voltar para `develop` antes da proxima. Mudancas de dados ficam em migrations/seeds e helpers tipados; mudancas de UI seguem os componentes existentes e evitam refactors fora do escopo.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, RLS, Zod, Tailwind CSS, shadcn/ui, Vitest.

## Global Constraints

- Branch base: `develop`.
- Branches: `issue/17-public-home-real-product`, `issue/18-rich-denuncia-form`, `issue/19-catalogos-tcc-antigo`, `issue/20-admin-sidebar-layout`.
- Nao commitar credenciais.
- Nao expor leitura publica de denuncias, vitimas, chamados, encaminhamentos ou auditoria.
- Area publica nao deve mencionar Supabase, RLS, MVP ou implementacao interna.
- Usar ASCII em arquivos novos e editados.

---

### Task 1: Issue 17 Home Publica Institucional

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/supabase/database.types.ts`
- Create or modify: `lib/public/conselho.ts`
- Create or modify: `lib/public/conselho.test.ts`
- Modify: `supabase/migrations/20260714000100_create_initial_schema.sql`
- Create: `supabase/migrations/20260715000100_expand_conselho_public_contacts.sql`
- Modify: `supabase/seed.sql`
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: `getPublicConselhoInfo()` returning institutional contact data with safe defaults.
- Consumes: existing Supabase server client from `lib/supabase/server.ts`.

- [ ] Write failing tests for contact fallback and public copy expectations.
- [ ] Add migration columns: `whatsapp`, `facebook_url`, `instagram_url`, `mapa_url`.
- [ ] Update database types for `conselho_tutelar`.
- [ ] Implement `getPublicConselhoInfo()`.
- [ ] Replace technical home copy with citizen-facing content.
- [ ] Run `npm test`, `npm run lint`, `npm run build`.
- [ ] Commit and merge branch back into `develop`.

### Task 2: Issue 18 Formulario De Denuncia Mais Completo

**Files:**
- Modify: `lib/denuncias/validation.ts`
- Modify: `lib/denuncias/validation.test.ts`
- Modify: `lib/denuncias/actions.ts`
- Modify: `app/denuncia/page.tsx`
- Modify: `lib/supabase/database.types.ts`
- Create: `supabase/migrations/20260715000200_expand_denuncia_public_fields.sql`
- Modify: `supabase/rls.test.ts`
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: expanded `denunciaSchema`.
- Produces: insert payload containing victim family/school/gender fields.

- [ ] Write failing validation tests for new optional fields and invalid age/gender.
- [ ] Add migration columns for father, mother, school and gender.
- [ ] Update Supabase types.
- [ ] Update Server Action insert payload.
- [ ] Update public form layout and field labels.
- [ ] Run `npm test`, `npm run lint`, `npm run build`.
- [ ] Commit and merge branch back into `develop`.

### Task 3: Issue 19 Catalogos Do TCC Antigo

**Files:**
- Modify: `supabase/seed.sql`
- Create: `supabase/migrations/20260715000300_normalize_catalogs_from_legacy_tcc.sql`
- Modify: `supabase/schema.test.ts`
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: idempotent catalog data for `motivos_denuncia` and `medidas_protetivas`.
- Consumes: existing admin cadastro screens and denuncia/chamado selects.

- [ ] Write failing static tests for required legacy reasons and protective measures.
- [ ] Add idempotent upserts for normalized motives and measures.
- [ ] Remove duplicated/broken legacy names in the seed source.
- [ ] Run `npm test`, `npm run lint`, `npm run build`.
- [ ] Commit and merge branch back into `develop`.

### Task 4: Issue 20 Admin Sidebar Layout

**Files:**
- Create: `app/admin/layout.tsx`
- Create or modify: `components/admin/admin-sidebar.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/denuncias/page.tsx`
- Modify: `app/admin/chamados/page.tsx`
- Modify: `app/admin/cadastros/page.tsx`
- Modify: `app/admin/relatorios/page.tsx`
- Modify: `lib/auth/actions.ts` if a logout action needs reuse.
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: shared admin shell for every `/admin` page.
- Consumes: existing protected admin pages and logout action.

- [ ] Create sidebar component with nav links and active state.
- [ ] Add shared `/admin` layout.
- [ ] Remove duplicated top-level navigation blocks from admin pages where the sidebar replaces them.
- [ ] Ensure logout and public-area links are visible.
- [ ] Run `npm test`, `npm run lint`, `npm run build`.
- [ ] Commit and merge branch back into `develop`.

## Self-Review

- Spec coverage: Issues 17, 18, 19 and 20 are covered by one task each.
- Placeholder scan: no unresolved placeholders are intended for implementation.
- Type consistency: helpers and schema changes are named explicitly and use existing project conventions.
