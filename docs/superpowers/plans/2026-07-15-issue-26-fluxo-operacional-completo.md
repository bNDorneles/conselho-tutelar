# Issue 26 Fluxo Operacional Completo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar no painel a jornada real entre denuncia, chamado, medida protetiva, encaminhamento e finalizacao.

**Architecture:** Add a pure operational-flow helper under `lib/admin/operational-flow.ts`, then enrich admin denuncia/chamado queries with linked chamado state. The Kanban remains a client component, receiving precomputed groups and labels from server-safe data.

**Tech Stack:** Next.js App Router, TypeScript, Supabase, Vitest, existing UI components.

## Global Constraints

- Keep RLS unchanged; no public read access to denuncias, chamados, vitimas or encaminhamentos.
- Use TDD for helpers and behavior changes.
- Do not introduce new dependencies for this issue.
- Verification commands: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`.

---

### Task 1: Operational Flow Helper

**Files:**
- Create: `lib/admin/operational-flow.ts`
- Create: `lib/admin/operational-flow.test.ts`
- Modify: `lib/admin/denuncia-types.ts`

**Interfaces:**
- Produces: `operationalStageColumns`, `operationalStageLabels`, `getDenunciaOperationalStage(denuncia)`, `buildOperationalStageGroups(rows)`.
- Consumes: `AdminDenuncia`.

- [ ] **Step 1: Write failing tests**

Test `getDenunciaOperationalStage` for received, assigned, analysis, converted/open chamado, medida applied, encaminhamento registered, finalized chamado, and archived denuncia.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd run test -- lib/admin/operational-flow.test.ts`

- [ ] **Step 3: Implement helper**

Add deterministic stage ordering and grouping. Prefer derived state over stored state.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm.cmd run test -- lib/admin/operational-flow.test.ts`

### Task 2: Enrich Admin Denuncia Data

**Files:**
- Modify: `lib/admin/denuncias.ts`
- Modify: `lib/admin/denuncias.test.ts`
- Modify: `app/admin/denuncias/page.tsx`

**Interfaces:**
- Consumes: helper from Task 1.
- Produces: Kanban groups by operational stage instead of raw denuncia status.

- [ ] **Step 1: Add failing grouping test**

Assert converted denuncia with finalized chamado goes to the finalized operational column, not analysis.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd run test -- lib/admin/denuncias.test.ts lib/admin/operational-flow.test.ts`

- [ ] **Step 3: Update query and grouping**

Select linked chamado status, fechamento, measures and encaminhamentos as nested relation counts/data needed by the helper.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm.cmd run test -- lib/admin/denuncias.test.ts lib/admin/operational-flow.test.ts`

### Task 3: Update Kanban And Chamado Detail UI

**Files:**
- Modify: `components/admin/denuncias-kanban.tsx`
- Modify: `app/admin/chamados/[id]/page.tsx`
- Modify: `lib/admin/chamados.ts`
- Modify: `lib/admin/chamados.test.ts`

**Interfaces:**
- Consumes: operational stage labels and enriched data from Tasks 1 and 2.
- Produces: Kanban with full flow labels and chamado detail showing final linked denuncia state.

- [ ] **Step 1: Add failing chamado display/helper test**

Assert linked denuncia status display becomes `Convertida em chamado` for converted denuncia and `Atendimento finalizado` when chamado is finalizado.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd run test -- lib/admin/chamados.test.ts`

- [ ] **Step 3: Update UI**

Use operational stage labels in Kanban; show linked chamado signal on cards; in chamado detail, avoid showing `em_analise` as active when the chamado is finalized.

- [ ] **Step 4: Run checks**

Run: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`.
