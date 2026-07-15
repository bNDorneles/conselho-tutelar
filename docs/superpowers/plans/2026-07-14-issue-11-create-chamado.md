# Issue 11 Create Chamado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a protected action that creates a chamado from a denuncia, optionally creates a vitima, updates denuncia status, and records audit logs.

**Architecture:** Place pure payload helpers and the Server Action in `lib/admin/chamados.ts`. Reuse the denuncia detail page to render the create button only when the denuncia can still be converted.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS.

## Global Constraints

- Do not build the chamados list/detail UI in Issue 11.
- Do not create chamados for denuncias already `convertida_em_chamado`.
- Create audit logs for chamado creation and denuncia status change.

---

### Task 1: Pure Helpers

- [ ] Create `lib/admin/chamados.test.ts` for victim detection, victim payload, chamado payload, and conversion eligibility.
- [ ] Run `npm.cmd run test -- lib/admin/chamados.test.ts` and confirm RED.
- [ ] Create `lib/admin/chamados.ts` helpers.
- [ ] Run focused test and confirm GREEN.

### Task 2: Server Action

- [ ] Add `createChamadoFromDenunciaAction(formData)` in `lib/admin/chamados.ts`.
- [ ] Fetch authenticated profile and denuncia.
- [ ] Optionally insert vitima.
- [ ] Insert chamado with `status = 'aberto'`.
- [ ] Update denuncia to `convertida_em_chamado`.
- [ ] Insert audit logs.

### Task 3: Detail UI

- [ ] Modify `app/admin/denuncias/[id]/page.tsx`.
- [ ] Render create chamado form when denuncia is not converted.
- [ ] Render converted state when denuncia is already `convertida_em_chamado`.

### Task 4: Docs And Verification

- [ ] Update README, ai.context.md, and issue log.
- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
