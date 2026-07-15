# Issue 13 Encaminhamentos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add encaminhamento creation and history to chamado detail.

**Architecture:** Create `lib/admin/encaminhamentos.ts` for validation, Supabase queries, and Server Action. Extend `app/admin/chamados/[id]/page.tsx` to render history and form.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS.

## Global Constraints

- Only authenticated active counselors/admins can create encaminhamentos through existing RLS.
- Creating encaminhamento must insert an audit log.
- Do not implement edit/delete of encaminhamentos in Issue 13.

---

### Task 1: Helpers And Tests

- [ ] Add `lib/admin/encaminhamentos.test.ts`.
- [ ] Run focused test and confirm RED.
- [ ] Add `lib/admin/encaminhamentos.ts` helpers and action.
- [ ] Run focused test and confirm GREEN.

### Task 2: UI

- [ ] Extend chamado detail with encaminhamento form.
- [ ] Display encaminhamento history.

### Task 3: Docs And Verification

- [ ] Update README, context, issue log.
- [ ] Run test, lint, build.
