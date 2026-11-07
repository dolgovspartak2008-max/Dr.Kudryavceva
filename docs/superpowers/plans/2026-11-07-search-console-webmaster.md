# Search Console and Yandex Webmaster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the production site in Google Search Console and Yandex Webmaster and submit its sitemap to both services.

**Architecture:** Store both services' issued HTML verification files at the static site root, publish them through the existing Vercel deployment from `main`, then complete ownership checks and submit the existing sitemap in each service. No DNS or application-code changes are required.

**Tech Stack:** Static HTML, GitHub, Vercel, Google Search Console, Yandex Webmaster

## Global Constraints

- Work directly on `main`.
- Keep ownership-verification files in the repository permanently.
- Do not change DNS, analytics, site content, or unrelated files.
- Preserve the existing `robots.txt` and `sitemap.xml` behavior.

---

### Task 1: Add Google verification file

**Files:**
- Create: `googleadfe7d73e5d91e86.html`

**Interfaces:**
- Consumes: Google Search Console's issued filename.
- Produces: `https://dr-kudryavceva.online/googleadfe7d73e5d91e86.html` containing the exact verification line.

- [ ] **Step 1: Confirm the production URL currently fails verification**

Open `https://dr-kudryavceva.online/googleadfe7d73e5d91e86.html` and verify it shows the site's 404 page.

- [ ] **Step 2: Create the exact verification file**

```text
google-site-verification: googleadfe7d73e5d91e86.html
```

- [ ] **Step 3: Verify the local file**

Run: `Get-Content -Raw googleadfe7d73e5d91e86.html`

Expected: the exact verification line above.

### Task 2: Add Yandex verification file

**Files:**
- Create: the exact root HTML filename returned by Yandex Webmaster during Step 1.

**Interfaces:**
- Consumes: Yandex Webmaster's issued filename and verification text.
- Produces: a root URL on `dr-kudryavceva.online` containing the exact Yandex verification response.

- [ ] **Step 1: Add the production site in Yandex Webmaster**

Use `https://dr-kudryavceva.online/` and select HTML-file verification.

- [ ] **Step 2: Create the issued verification file unchanged**

Use the exact filename and content displayed by Yandex Webmaster.

- [ ] **Step 3: Verify both local verification files**

Run: `Get-ChildItem google*.html,yandex*.html | Select-Object Name,Length`

Expected: one Google verification file and one Yandex verification file, both non-empty.

### Task 3: Publish verification files

**Files:**
- Commit: both root verification files and this implementation plan.

**Interfaces:**
- Consumes: the verified local files from Tasks 1 and 2.
- Produces: a GitHub `main` revision that triggers Vercel production deployment.

- [ ] **Step 1: Commit the verification files**

```powershell
git add googleadfe7d73e5d91e86.html yandex_*.html docs/superpowers/plans/2026-11-07-search-console-webmaster.md
git commit -m "chore: verify search webmaster ownership"
```

- [ ] **Step 2: Push `main`**

Run: `git push origin main`

Expected: GitHub accepts the new revision and Vercel starts the production deployment.

- [ ] **Step 3: Verify production files**

Open both public verification URLs and confirm they display the exact issued verification text.

### Task 4: Complete ownership and sitemap submission

**Files:**
- No repository changes.

**Interfaces:**
- Consumes: the deployed verification URLs and existing `https://dr-kudryavceva.online/sitemap.xml`.
- Produces: verified properties and accepted sitemap submissions in both webmaster services.

- [ ] **Step 1: Complete Google ownership verification**

Click `ПОДТВЕРДИТЬ` in the open Google Search Console ownership dialog and verify the success state.

- [ ] **Step 2: Submit the sitemap in Google Search Console**

Submit `sitemap.xml` in the property's sitemap section and verify it appears in the submitted list.

- [ ] **Step 3: Complete Yandex ownership verification**

Run the Yandex Webmaster ownership check and verify the site becomes accessible in the account.

- [ ] **Step 4: Submit the sitemap in Yandex Webmaster**

Submit `https://dr-kudryavceva.online/sitemap.xml` and verify it appears in the sitemap-files list.

- [ ] **Step 5: Recheck crawl discovery**

Confirm `robots.txt` still references the production sitemap and `sitemap.xml` still lists all public production URLs.
