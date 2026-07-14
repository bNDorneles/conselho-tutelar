# Issue 03 Supabase Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the Supabase integration foundation without committing real credentials or requiring a live Supabase project.

**Architecture:** Add a small `lib/supabase` boundary with environment validation, browser client creation, server client creation, and initial database types. Use Vitest to test configuration behavior before implementation.

**Tech Stack:** Next.js 16, TypeScript, Supabase JS, Supabase SSR, Vitest, npm.

## Global Constraints

- Work on `issue/03-supabase-config` from `develop`.
- Use recommended model `gpt-5.6-sol`.
- Do not commit real Supabase credentials.
- Do not add schema, migrations, auth screens, RLS, or service role keys in this issue.
- Build must pass without real Supabase environment values.
- Runtime Supabase client creation must fail with clear messages when configuration is missing or invalid.

---

## Task 1: Register Issue Context

**Files:**
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Consumes: workflow policy from `ai.context.md`.
- Produces: issue metadata entry for #3.

- [ ] **Step 1: Append issue metadata**

Add:

```markdown
## Issue #3 - Configurar Supabase no projeto

Tipo da issue: backend/integracao
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/03-supabase-config
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/decisao-arquitetura.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-supabase-config-design.md
- docs/superpowers/plans/2026-07-14-issue-03-supabase-config.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build
```

## Task 2: Add Dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: npm package manager.
- Produces: Supabase and Vitest packages available.

- [ ] **Step 1: Install runtime and test dependencies**

Run:

```powershell
npm.cmd install @supabase/supabase-js @supabase/ssr
npm.cmd install -D vitest
```

- [ ] **Step 2: Add test script**

Update `package.json`:

```json
"test": "vitest run"
```

## Task 3: Test Supabase Config Validation

**Files:**
- Create: `lib/supabase/config.test.ts`
- Create: `lib/supabase/config.ts`

**Interfaces:**
- Produces: `resolveSupabaseConfig(env?: SupabaseEnv): SupabaseConfig`

- [ ] **Step 1: Write failing tests**

Create tests that import `resolveSupabaseConfig` and cover valid env, missing URL, missing key, invalid URL, and invalid protocol.

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
npm.cmd run test -- lib/supabase/config.test.ts
```

Expected: tests fail because `config.ts` does not exist or function is not implemented.

- [ ] **Step 3: Implement config validation**

Create `lib/supabase/config.ts` with exported types and `resolveSupabaseConfig`.

- [ ] **Step 4: Run tests and verify pass**

Run:

```powershell
npm.cmd run test -- lib/supabase/config.test.ts
```

Expected: tests pass.

## Task 4: Add Supabase Helpers

**Files:**
- Create: `lib/supabase/browser.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/database.types.ts`

**Interfaces:**
- Consumes: `resolveSupabaseConfig`.
- Produces: `createBrowserSupabaseClient()` and `createServerSupabaseClient()`.

- [ ] **Step 1: Create initial database types**

Create an empty typed `Database` interface compatible with `supabase-js`.

- [ ] **Step 2: Create browser helper**

Use `createBrowserClient<Database>()` from `@supabase/ssr`.

- [ ] **Step 3: Create server helper**

Use `createServerClient<Database>()` from `@supabase/ssr` and `cookies()` from `next/headers`.

## Task 5: Document Environment Setup

**Files:**
- Create: `.env.local.example`
- Modify: `README.md`
- Modify: `ai.context.md`
- Modify: `docs/issue-execution-log.md`

**Interfaces:**
- Produces: clear setup instructions.

- [ ] **Step 1: Create `.env.local.example`**

Use empty placeholder values only.

- [ ] **Step 2: Update docs**

Document the Supabase variables, the no-real-secret rule, and verification commands.

## Task 6: Verify And Commit

**Files:**
- All modified files.

- [ ] **Step 1: Run verification**

Run:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: all pass.

- [ ] **Step 2: Commit and push**

Run:

```powershell
git add .
git commit -m "feat: configure supabase clients"
git push -u origin issue/03-supabase-config
```

- [ ] **Step 3: Merge into develop**

Run:

```powershell
git switch develop
git merge --no-ff issue/03-supabase-config -m "merge: issue 03 supabase config"
git push origin develop
```

## Self-Review

- Spec coverage: covers dependencies, env example, browser/server helpers, config validation, docs, verification.
- Placeholder scan: no unresolved markers.
- Type consistency: helper and config names are consistent across tasks.

