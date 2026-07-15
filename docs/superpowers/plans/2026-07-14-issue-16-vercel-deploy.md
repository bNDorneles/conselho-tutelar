# Issue 16 Vercel Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the project for Vercel deployment with clear environment and Supabase Auth documentation.

**Architecture:** Documentation-only deployment preparation. Keep secrets out of git, document Vercel project settings, Supabase Auth URL configuration, build commands, and post-deploy checks.

**Tech Stack:** Next.js, Vercel, Supabase Auth/RLS.

## Global Constraints

- Do not commit real environment values.
- Do not require `SUPABASE_SERVICE_ROLE_KEY` for the deployed app.
- Verify build before completion.

---

### Task 1: Deployment Docs

- [ ] Create `docs/deploy-vercel.md`.
- [ ] Include Vercel import steps.
- [ ] Include environment variable table.
- [ ] Include Supabase Auth URL checklist.
- [ ] Include post-deploy validation checklist.

### Task 2: README And Env Example

- [ ] Update `.env.local.example` with comments.
- [ ] Update `README.md` with a deploy section linking to the deploy doc.
- [ ] Update `docs/issue-execution-log.md`.

### Task 3: Verification

- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
