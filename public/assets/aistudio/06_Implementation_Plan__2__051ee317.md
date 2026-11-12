# 06 — Implementation Plan (single-pass build for Google AI Studio)

**Product:** Inspire Team · **Version:** 1.0 · **Date:** 12 Nov 2026
Related: `01_PRD.md` · `02_TRD.md` · `03_App_Flow.md` · `04_UI_UX_Design_Brief.md` · `05_Backend_Schema.md`

> **Instruction to the AI builder:** Read all six documents completely before writing code. Build the **entire** application in one run, following the internal order in §3. Do not ask questions; where a detail is missing, follow the documents, then make the most conservative choice and note it in `README.md`. The six documents are the single source of truth: use their exact route paths, table/column/enum/RPC names, bucket names and environment variable names.

---

## 1. What You Are Building

**Inspire Team** — a bilingual (English + Urdu RTL), light/dark, responsive React + TypeScript (Vite) web app with three experiences:
1. **Public portfolio site** (visitors, no login).
2. **Member portal** (private dashboard, assignments, project drafts, image-to-PDF tool).
3. **Admin portal** (members, assignments, review & publish, content, settings, audit).

Backend is **Supabase** (Postgres, Auth, Storage) plus **Cloudflare Pages Functions** for service-role tasks. The Supabase project does **not** exist yet and cannot be created from here. You write Supabase-ready code and Function files; the database is created later from `05_Backend_Schema.md`.

## 2. Hard Rules (never violate)

1. Never put secrets or the service-role key in client code or the repo. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are client-side.
2. Read env vars only in `src/lib/env.ts`. No hardcoded URLs/keys.
3. All data access through `src/services/*`; components never import the Supabase client.
4. Use **exact** names from `05_Backend_Schema.md`. Do not rename tables/columns/enums/RPCs.
5. All privileged actions use the RPCs/Functions listed in the docs. Never implement approval, publishing or role changes as plain client-side updates.
6. No `dangerouslySetInnerHTML`; markdown via `react-markdown` without raw HTML; external links only `http(s)` via `safeUrl()`.
7. Use logical CSS properties (RTL-safe). All user-visible strings go through i18n (`en.json`, `ur.json`).
8. Tailwind must be **compiled via Vite** (PostCSS), not a CDN script.
9. No external stock/placeholder image URLs. Use the `ImageSlot` component with a gradient placeholder.
10. **Demo Mode** (TRD §23) is for preview only and must be unreachable in production builds.
11. No fake authentication, no `localStorage` as a database (only theme/language preference keys `inspire_theme`, `inspire_lang`).
12. Do not create `bun.lock`/`bun.lockb`. Keep `package-lock.json`.

## 3. Internal Build Order (one run)

| Step | Work | Output / checkpoint |
|---|---|---|
| 1 | **Project setup**: Vite + React + TS strict, Tailwind via PostCSS, router, react-query, i18next, zod, react-hook-form, lucide-react, recharts, pdf-lib, dnd-kit, react-markdown. Config files: `package.json` (`build`, `dev`, `preview`; `engines.node >=20`), `.npmrc` (`legacy-peer-deps=true`), `.node-version` (`20`), `tsconfig`, `vite.config.ts`, `.gitignore`, `.env.example` (names only, no values). | `npm run build` passes on empty shell |
| 2 | **Design system**: tokens (`globals.css`), theme (light/dark/system, no-flash script), fonts, RTL handling, all `components/ui/*` from UI brief §6 incl. `ImageSlot`, `StatusBadge`, `FileDropzone`, `ConfirmDialog`, `DataTable`. | Component gallery route `/__ui` **dev only** (excluded in production) |
| 3 | **Core libs**: `env.ts`, `supabase.ts`, `errors.ts` (code mapping), `url.ts`, `magicBytes.ts`, `upload.ts`, `format.ts`, `i18n.ts`, types mirroring schema (`types/database.ts` hand-written to match `05`). | Type-safe foundations |
| 4 | **Services layer** (one file per domain) calling Supabase tables/RPCs exactly as named in `05`; plus `services/demo/*` with realistic sample data (EN + UR) behind the Demo Mode switch. | Every page can load in Demo Mode |
| 5 | **Layouts + routing**: `PublicLayout`, `AdminLayout`, `MemberLayout`, guards (`RequireAuth`, `RequireRole`, `RequireAAL2`, `RequirePasswordChanged`), lazy routes for **every** route in `03_App_Flow.md` §1, 404, error boundary, language/theme switchers, notification bell. | All routes reachable |
| 6 | **Auth screens**: admin/member login, forgot/reset password, forced change password, admin MFA enrol/verify (TOTP), idle timeout, `log_login_event`. | AUTH-001…010 UI |
| 7 | **Public site**: Home, About, Team, Member Profile, Projects (filters/search/pagination via `search_published_projects`), Project Details (gallery, lightbox, safe links, PDF view/download), Categories, Showcase (+detail), Contact (form → `/api/contact`, WhatsApp button), Search, Privacy, Terms; `<Seo>` component; JSON-LD. | PUBLIC-001…007 |
| 8 | **Member portal**: dashboard, profile + change request, assignments (list/detail/status RPC/comments), projects (list/create/edit with autosave, media upload, tags, collaborators, preview, submit checklist, withdraw, start/withdraw revision), submission history, revision requests, files, notifications, settings. | MEMBER-001…011 |
| 9 | **Image-to-PDF tool** (lazy-loaded): everything in PRD PDF-001…010 and TRD §13; attach-to-project integration. | PDF flow end-to-end |
| 10 | **Admin portal**: dashboard (`admin_dashboard_stats`), members (create via Function, edit, status, reset), assignments (+showcase), submissions, pending reviews, review detail (all actions incl. Publish Gate call), published/archived lists, file manager, categories, tags, content, profile requests, messages, notifications, analytics (+CSV/JSON export), activity logs, settings, security, backup & export. | ADMIN-001…016 |
| 11 | **Cloudflare Pages Functions** in `/functions` exactly per TRD §9.3 (create member, reset password, status, publish gate, contact, sitemap, SEO meta injection) with shared `_lib` (auth verify incl. aal2, CORS/Origin check, zod validation, error format). Workers-runtime compatible. | Files present, type-checked |
| 12 | **Hosting files**: `public/_redirects` (`/*  /index.html  200`), `public/_headers` (TRD §17), `public/robots.txt`, favicon. | Cloudflare-ready |
| 13 | **Polish**: loading/empty/error/success states on every page (03 §2), a11y pass (UI §12), responsive pass 360/768/1280, RTL pass, copy review (`ur.json` complete — no missing keys). | Definition of Done (UI §15) |
| 14 | **QA pass + README**: self-check against §6 checklist; write `README.md` (setup, env vars, scripts, folder map, what is manual, known limitations). | Report in final message |

## 4. Page & Component Inventory (must all exist)

**Public (14):** Home, About, Team, MemberProfile, Projects, ProjectDetail, Categories, Showcase, ShowcaseDetail, Contact, Search, Privacy, Terms, NotFound.
**Auth (6):** AdminLogin, MemberLogin, ForgotPassword, ResetPassword, ChangePassword, AdminMfa.
**Admin (25):** Dashboard, Members, MemberNew, MemberDetail, MemberEdit, Assignments, AssignmentNew, AssignmentDetail, Submissions, PendingReviews, ReviewDetail, PublishedProjects, ArchivedProjects, Files, Categories, Tags, Content, ProfileRequests, Messages, Notifications, Analytics, Activity, Settings, Security, Backup.
**Member (15):** Dashboard, Profile, Assignments, AssignmentDetail, Projects, ProjectNew, ProjectDetail, ProjectEdit, ProjectSubmit, Submissions, Revisions, Files, ImageToPdf, Notifications, Settings.

**Shared components:** see UI brief §6. **Services:** `auth, members, assignments, projects, reviews, files, publicSite, taxonomy, notifications, settings, content, audit, analytics, contact, exports`.

## 5. Dependencies Between Parts

`env/supabase → services → hooks/queries → pages`. Design system before pages. Auth guards before portals. Files service before project media and the PDF tool. Project RPC wrappers before review screens. Functions client wrappers (`services/adminApi.ts`) before member creation and publish UI.

## 6. Final Verification Checklist (the builder must self-verify in Pass 1 and Pass 2)

**Structure & naming**
- [ ] Every route in `03_App_Flow.md` §1 exists and is lazy-loaded where appropriate.
- [ ] Every table/column/enum/RPC/bucket name used in code appears in `05_Backend_Schema.md` (and vice-versa nothing invented).
- [ ] `.env.example` lists exactly the variables of TRD §21 (names only).

**Security**
- [ ] No service-role key or secret anywhere in `src/`, `public/`, `index.html`.
- [ ] No privileged write bypasses RPC/Function (publish, review decisions, status changes, member creation).
- [ ] Member UI never offers publish/approve/feature; admin-only routes guarded.
- [ ] No `dangerouslySetInnerHTML`; external URLs pass `safeUrl()`.
- [ ] Private files use signed URLs; public pages use only `public-media` paths from `published_projects`.
- [ ] Draft/submitted/rejected content is never rendered on public routes.

**Features**
- [ ] Invite-only: no signup UI. Forced password change. Admin MFA flow.
- [ ] Project lifecycle matches PRD §9 including revision keeping live version visible.
- [ ] Assignment status derivation and member transition rules match `05` §6.
- [ ] Image-to-PDF: reorder (drag + buttons), rotate, remove, A4/Letter/Auto, orientation, margin, fit, quality, filename, preview, download, attach, limits/warnings, cancel, originals not uploaded by default.
- [ ] Public contact: form + WhatsApp button (hidden when no number).
- [ ] Search/filter/sort/pagination on `/projects` only returns visible records.
- [ ] Notifications bell + history; Realtime with polling fallback.
- [ ] Audit log viewer; exports.
- [ ] i18n: EN + UR complete, RTL verified, language default read from settings.
- [ ] Light/Dark toggle without flash.

**Build & deploy readiness**
- [ ] `npm run build` succeeds with zero TypeScript errors; output in `dist`.
- [ ] `public/_redirects` and `public/_headers` present; `functions/` present.
- [ ] `package-lock.json` present; no `bun.lock*`; `.npmrc` has `legacy-peer-deps=true`.
- [ ] Production build without env vars shows the Configuration Error screen; Demo Mode code is not bundled.

## 7. Manual / Later Steps (not done by the AI builder)

| Stage | Who | What |
|---|---|---|
| Images | You + Claude | Image list → generate/resize → URLs → integration prompt (after Pass 2) |
| AI Gateway | — | Not required (no AI features in MVP) |
| GitHub | You | Export to GitHub from AI Studio |
| Supabase | ChatGPT (plugins) | Create project from `05`, RLS, RPCs, buckets, cron, Realtime, first admin; PR for any code fixes |
| Supabase dashboard | You | Disable signups, MFA on, JWT/password settings, optional custom SMTP |
| Cloudflare | You | Pages from GitHub, env vars (TRD §21), optional Turnstile, WAF rate rule, Web Analytics |
| QA | You + ChatGPT | Run security tests (PRD §11) and acceptance criteria (PRD §13) |

## 8. Known Limitations to Document in README

- Preview/Demo Mode uses sample data; real behaviour requires Supabase + Functions.
- Functions cannot be executed inside AI Studio.
- Malware scanning engine not included (Phase 2); content checks via magic bytes at Publish Gate.
- Email notifications and HEIC support are Phase 2.
- Supabase Free-plan limits (pausing, backups, storage, auth email rate) must be re-verified at deploy time.

## 9. Pass 2 Focus (when the same six files are re-submitted)

Compare code against the documents and **fix or complete**: missing routes/pages, name mismatches with `05`, absent states (loading/empty/error), missing `ur.json` keys, RTL issues, a11y gaps, Functions files, hosting files, env handling, build errors. Do **not** rewrite working parts or change naming; do not add features beyond the MVP. End with a short **Change Report** (what was fixed) and **Test Report** (what was verified).
