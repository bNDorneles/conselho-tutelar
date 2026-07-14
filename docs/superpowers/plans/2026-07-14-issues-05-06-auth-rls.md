# Issues 05-06 Auth RLS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement administrative authentication first, then version Supabase RLS policies for sensitive tables.

**Architecture:** Issue #5 adds Next.js auth screens/actions/helpers around existing Supabase SSR clients. Issue #6 adds a dedicated SQL migration with RLS helper functions and policies, plus static tests that protect the intended security posture.

**Tech Stack:** Next.js Server Components, Server Actions, Supabase Auth, Supabase SSR, Postgres RLS, TypeScript, Vitest.

## Global Constraints

- Use `gpt-5.6-sol` for both issues.
- Use one branch per issue.
- Do not commit real credentials.
- Do not use service role keys.
- Keep build working without a live Supabase project.
- Validate with `npm run test`, `npm run lint`, and `npm run build`.

---

## Task 1: Issue #5 Auth Admin

**Files:**
- Create: `app/login/page.tsx`
- Create: `app/login/actions.ts`
- Create: `lib/auth/admin.ts`
- Create: `lib/auth/actions.ts`
- Create: `lib/supabase/proxy.ts`
- Create: `proxy.ts`
- Modify: `app/admin/page.tsx`
- Modify: `docs/issue-execution-log.md`
- Modify: `README.md`
- Modify: `ai.context.md`

**Interfaces:**
- Produces: `requireAdminProfile()`, `signInWithPasswordAction()`, `signOutAction()`, `updateSession()`.

- [ ] Create branch `issue/05-admin-auth` from `develop`.
- [ ] Register Issue #5 metadata in `docs/issue-execution-log.md`.
- [ ] Implement auth actions and login page.
- [ ] Protect `/admin` with server-side profile loading.
- [ ] Add proxy session refresh for `/admin`.
- [ ] Update docs.
- [ ] Verify test, lint and build.
- [ ] Commit, push and merge into `develop`.

## Task 2: Issue #6 RLS Policies

**Files:**
- Create: `supabase/migrations/20260714000200_enable_rls_policies.sql`
- Create/modify: `supabase/rls.test.ts`
- Modify: `docs/issue-execution-log.md`
- Modify: `README.md`
- Modify: `ai.context.md`

**Interfaces:**
- Produces: RLS migration and static security tests.

- [ ] Create branch `issue/06-rls-policies` from updated `develop`.
- [ ] Register Issue #6 metadata in `docs/issue-execution-log.md`.
- [ ] Write failing static tests for RLS/policies.
- [ ] Implement RLS migration.
- [ ] Update docs.
- [ ] Verify test, lint and build.
- [ ] Commit, push and merge into `develop`.

## Self-Review

- Spec coverage: covers auth page/actions/protection/proxy and RLS migration/policies/tests.
- Placeholder scan: no unresolved markers.
- Type consistency: branch names and helper names are stable.

