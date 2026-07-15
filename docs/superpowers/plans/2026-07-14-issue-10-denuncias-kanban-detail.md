# Issue 10 Denuncias Kanban Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build protected administrative denuncia triage with Kanban-style status columns, filters, detail view, and audit logs.

**Architecture:** Keep Supabase access in `lib/admin/denuncias.ts`, with pure helpers for status transitions and query parsing tested by Vitest. Pages under `app/admin/denuncias` remain server-rendered and protected by `requireAdminProfile()`, with Server Actions for status updates and audit writes.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS, shadcn/base-ui components.

## Global Constraints

- Route `/admin/denuncias` must require `requireAdminProfile()`.
- Route `/admin/denuncias/[id]` must require `requireAdminProfile()`.
- Opening detail must insert `audit_logs.action = 'read'`.
- Status moves must insert `audit_logs.action = 'status_change'`.
- Do not create chamados in Issue 10.
- Do not implement full drag and drop in Issue 10.

---

### Task 1: Denuncia Admin Domain Helpers

**Files:**
- Create: `lib/admin/denuncias.test.ts`
- Create: `lib/admin/denuncias.ts`

**Interfaces:**
- Produces: `denunciaStatusLabels`, `denunciaStatusColumns`, `canTransitionDenunciaStatus(from, to)`, `parseDenunciaFilters(input)`, `buildDenunciaStatusGroups(rows)`.

- [ ] **Step 1: Write failing tests**

Create `lib/admin/denuncias.test.ts` covering allowed transitions, blocked conversion to chamado, filter parsing, and grouping.

- [ ] **Step 2: Run focused test**

Run: `npm.cmd run test -- lib/admin/denuncias.test.ts`
Expected: fail because `./denuncias` does not exist.

- [ ] **Step 3: Implement helpers**

Create `lib/admin/denuncias.ts` with pure helpers and exported types.

- [ ] **Step 4: Run focused test**

Run: `npm.cmd run test -- lib/admin/denuncias.test.ts`
Expected: pass.

### Task 2: Supabase Queries And Actions

**Files:**
- Modify: `lib/admin/denuncias.ts`

**Interfaces:**
- Produces: `getAdminDenuncias(filters)`, `getAdminDenunciaDetail(id)`, `updateDenunciaStatusAction(formData)`, `recordDenunciaRead(profileId, denunciaId)`.

- [ ] **Step 1: Add Supabase query functions**

Fetch denuncias with optional filters and join `motivos_denuncia(nome)`.

- [ ] **Step 2: Add status update Server Action**

Validate transition, update status, insert audit log, and redirect back to `/admin/denuncias`.

- [ ] **Step 3: Add read audit helper**

Insert `read` log from detail page after successful denuncia fetch.

### Task 3: Kanban List Page

**Files:**
- Create: `app/admin/denuncias/page.tsx`
- Modify: `app/admin/page.tsx`

**Interfaces:**
- Consumes: `getAdminDenuncias`, `buildDenunciaStatusGroups`, `updateDenunciaStatusAction`.

- [ ] **Step 1: Create protected page**

Render filters, four columns, cards, detail links, and status action forms.

- [ ] **Step 2: Link dashboard to Kanban**

Add link from admin dashboard denuncia sections to `/admin/denuncias`.

### Task 4: Detail Page

**Files:**
- Create: `app/admin/denuncias/[id]/page.tsx`

**Interfaces:**
- Consumes: `getAdminDenunciaDetail`, `recordDenunciaRead`, `formatDashboardDate`.

- [ ] **Step 1: Create protected detail page**

Fetch denuncia, record read audit, render complete fields and back link.

### Task 5: Docs And Verification

**Files:**
- Modify: `README.md`
- Modify: `ai.context.md`
- Modify: `docs/issue-execution-log.md`

- [ ] **Step 1: Update docs**

Record Issue 10 route, scope, and verification commands.

- [ ] **Step 2: Run verification**

Run:
- `npm.cmd run test`
- `npm.cmd run lint`
- `npm.cmd run build`

- [ ] **Step 3: Smoke check**

Check `/admin/denuncias` redirects without session.
