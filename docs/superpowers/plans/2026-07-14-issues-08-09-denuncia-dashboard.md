# Issues 08-09 Denuncia Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add anonymous complaint submission and replace the admin placeholder with an initial real-data dashboard.

**Architecture:** Issue #8 creates public validation and insertion through a Server Action. Issue #9 adds server-side dashboard queries protected by the existing admin auth flow and RLS policies.

**Tech Stack:** Next.js Server Actions, Supabase SSR, Zod, TypeScript, Vitest, shadcn/ui.

## Global Constraints

- Issue #8 branch: `issue/08-anonymous-complaint-form`.
- Issue #9 branch: `issue/09-admin-dashboard`.
- Use `gpt-5.5` for both issues.
- Do not expose complaint details publicly after submission.
- Do not add issue #10 detail/listing behavior.
- Verify with `npm run test`, `npm run lint`, and `npm run build`.

---

## Task 1: Issue #8

**Files:**
- Create: `lib/denuncias/validation.ts`
- Create: `lib/denuncias/actions.ts`
- Create: `app/denuncia/page.tsx`
- Modify: `app/page.tsx`
- Modify: docs/logs.

**Interfaces:**
- Produces: `denunciaSchema`, `submitDenunciaAction`.

## Task 2: Issue #9

**Files:**
- Create: `lib/admin/dashboard.ts`
- Modify: `app/admin/page.tsx`
- Modify: docs/logs.

**Interfaces:**
- Produces: `getAdminDashboardData()`.

## Self-Review

- Spec coverage: covers form, validation, insert, dashboard cards and lists.
- Placeholder scan: no unresolved markers.
- Type consistency: stable function and branch names.

