# Issue 12 Chamados List Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build protected chamados list and detail screens with filters, status changes, and audit logs.

**Architecture:** Extend `lib/admin/chamados.ts` with pure helpers, Supabase queries, read audit, and status Server Action. Add server-rendered pages under `app/admin/chamados`.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS, shadcn/base-ui components.

## Global Constraints

- `/admin/chamados` and `/admin/chamados/[id]` require `requireAdminProfile()`.
- Detail reads insert `audit_logs.action = 'read'`.
- Status updates insert `audit_logs.action = 'status_change'`.
- Do not implement encaminhamentos or medidas protetivas in Issue 12.

---

### Task 1: Helpers And Tests

- [ ] Add tests in `lib/admin/chamados.test.ts` for chamado filters and status transitions.
- [ ] Run focused test and confirm RED.
- [ ] Implement helpers in `lib/admin/chamados.ts`.
- [ ] Run focused test and confirm GREEN.

### Task 2: Queries And Actions

- [ ] Add `getAdminChamados(filters)`.
- [ ] Add `getAdminChamadoDetail(id)`.
- [ ] Add `recordChamadoRead(profileId, chamadoId)`.
- [ ] Add `updateChamadoStatusAction(formData)`.

### Task 3: UI

- [ ] Create `app/admin/chamados/page.tsx`.
- [ ] Create `app/admin/chamados/[id]/page.tsx`.
- [ ] Link admin dashboard chamados card/list to `/admin/chamados`.

### Task 4: Docs And Verification

- [ ] Update README, `ai.context.md`, and issue log.
- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
