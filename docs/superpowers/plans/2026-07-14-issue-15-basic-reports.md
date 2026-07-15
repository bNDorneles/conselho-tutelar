# Issue 15 Basic Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build protected basic reports with period filters and real Supabase data.

**Architecture:** Add `lib/admin/relatorios.ts` with filter parsing, aggregation helpers, and Supabase queries. Add `/admin/relatorios` as a server-rendered protected page with cards and CSS bars.

**Tech Stack:** Next.js App Router, TypeScript, Supabase SSR, Vitest, Tailwind CSS.

## Global Constraints

- `/admin/relatorios` requires an active administrative profile.
- Reports must use real data.
- Period filters must work.
- Do not add charting dependencies.

---

### Task 1: Helpers And Tests

- [ ] Create `lib/admin/relatorios.test.ts`.
- [ ] Add tests for period parsing, grouping counts, and max percentage.
- [ ] Run focused test and confirm RED.
- [ ] Create `lib/admin/relatorios.ts`.
- [ ] Run focused test and confirm GREEN.

### Task 2: Queries

- [ ] Add `getAdminReportsData(filters)`.
- [ ] Query denuncias, chamados, encaminhamentos with period filters.
- [ ] Aggregate rows in application code.

### Task 3: UI

- [ ] Create `app/admin/relatorios/page.tsx`.
- [ ] Add period filter form.
- [ ] Render cards and report sections.
- [ ] Link dashboard to reports.

### Task 4: Docs And Verification

- [ ] Update README, context, issue log.
- [ ] Run test, lint, build.
