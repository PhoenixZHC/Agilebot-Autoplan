# TP WebView Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every first-party script loaded by the TP page is transpiled and TP notifications display their body text.

**Architecture:** Keep the current classic-script layout and generate one Babel output per source file. A Node built-in test validates the template/build contract and notification argument order; `AGENTS.md` documents the invariant for later changes.

**Tech Stack:** Babel, pnpm, Node.js `node:test`, Jinja2 templates

---

### Task 1: Add failing compatibility tests

**Files:**
- Create: `tests/frontend-compatibility.test.js`
- Modify: `package.json`

- [ ] Assert that first-party template scripts use `*-compiled.js`, all expected outputs are built, Babel targets a legacy engine, and TP notification methods receive `('', message)`.
- [ ] Add `pnpm test` using `node --test tests/*.test.js`.
- [ ] Run `pnpm test` and verify it fails against the current direct source references and one-argument notifications.

### Task 2: Build and load compatible scripts

**Files:**
- Modify: `package.json`
- Modify: `templates/index.html`
- Generate: `static/i18n-compiled.js`
- Generate: `static/api-i18n-keys-compiled.js`
- Generate: `static/language-switcher-compiled.js`
- Regenerate: `static/script-compiled.js`

- [ ] Add Babel commands for all four first-party source files and target IE 11 syntax compatibility.
- [ ] Replace direct source references in the template with generated counterparts, preserving dependency order.
- [ ] Run `pnpm build` and confirm every output is generated.
- [ ] Run `pnpm test` and confirm only the notification assertions remain failing.

### Task 3: Fix TP notification detail delivery

**Files:**
- Modify: `static/script.js`
- Regenerate: `static/script-compiled.js`

- [ ] Change extension callbacks to call `success('', message)`, `error('', message)`, and `info('', message)` while leaving browser alerts unchanged.
- [ ] Run `pnpm build` and `pnpm test`; expect all tests to pass.

### Task 4: Document and verify the invariant

**Files:**
- Create: `AGENTS.md`

- [ ] State that templates must load compiled first-party JavaScript, generated files must not be hand-edited, and frontend changes require `pnpm build` plus `pnpm test`.
- [ ] Run Node syntax checks on all loaded scripts, `pnpm test`, `pnpm build`, and `git diff --check`.
