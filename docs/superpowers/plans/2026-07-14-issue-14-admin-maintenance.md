# Issue 14 Admin Maintenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin-only maintenance page for support data.

**Architecture:** Create `lib/admin/cadastros.ts` with admin guard, validation, queries, and Server Actions. Render `/admin/cadastros` as a protected server page with compact forms and lists.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS.

## Global Constraints

- Only active admins can access `/admin/cadastros`.
- Do not create Supabase Auth users from this page.
- Log sensitive changes in `audit_logs`.

---

### Task 1: Helpers And Tests

- [ ] Create tests for text validation and institution payload.
- [ ] Implement helpers in `lib/admin/cadastros.ts`.

### Task 2: Queries And Actions

- [ ] Add admin guard.
- [ ] Add queries for motivos, medidas, profiles, conselho.
- [ ] Add create/toggle/update actions.

### Task 3: UI

- [ ] Create `/admin/cadastros`.
- [ ] Link dashboard to cadastros.

### Task 4: Docs And Verification

- [ ] Update docs.
- [ ] Run test, lint, build.
