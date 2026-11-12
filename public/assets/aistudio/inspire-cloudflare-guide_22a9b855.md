# Inspire Academy Team Hub
## Cloudflare Workers AI + Google AI Studio Implementation Guide

> Based on verified Cloudflare official support AI responses — November 2026

---

## SECTION 1 — CONFIRMED CLOUDFLARE CONFIGURATION

### 1.1 Deployment Architecture

Cloudflare officially recommends **Unified Workers + Static Assets** (not Pages + separate Worker).

> "If you are starting a new project, use Workers instead of Pages. Pages continues to work, but new features and optimizations are focused on Workers."

**Result:** One Worker serves both React static files AND `/api/*` AI routes. Same origin = zero CORS issues.

---

### 1.2 Free Plan AI Models (Confirmed)

| Use Case | Model | Notes |
|---|---|---|
| Project description generation | `@cf/zai-org/glm-4.7-flash` | 131K context, fast, multilingual |
| Auto-tagging (JSON mode) | `@cf/zai-org/glm-4.7-flash` | JSON mode supported |
| Image alt-text | `@cf/moondream/moondream3.1-9B-A2B` | Replaces deprecated llava |
| Content moderation | `@cf/meta/llama-guard-3-8b` | Purpose-built safety classifier |

**Free Plan Limits:**
- 10,000 Neurons/day (resets 00:00 UTC)
- 100,000 Worker requests/day
- Text Generation: 300 req/min | Image-to-Text: 720 req/min

**AVOID (paid only):** `@cf/moonshotai/kimi-k2.6`, `@cf/moonshotai/kimi-k2.7-code`, `@cf/zai-org/glm-5.2`

---

### 1.3 Confirmed Folder Structure

```
inspire-academy-team-hub/
├── wrangler.jsonc
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .dev.vars          ← Local secrets (GITIGNORED — never commit)
├── .gitignore
├── public/
│   └── favicon.svg
├── src/
│   ├── frontend/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── lib/
│   │       ├── api.ts        ← Cloudflare AI calls (same-origin /api/*)
│   │       ├── auth.ts       ← Firebase + Supabase sync
│   │       └── supabase.ts   ← Supabase client
│   └── worker/
│       └── index.ts          ← Routes /api/* to AI, else ASSETS
└── dist/              ← Vite build output (GITIGNORED)
```

---

### 1.4 Confirmed wrangler.jsonc

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "inspire-academy-team-hub",
  "main": "src/worker/index.ts",
  "compatibility_date": "2026-11-10",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "ai": {
    "binding": "AI"
  },
  "observability": {
    "enabled": true
  }
}
```

**Key points:**
- `not_found_handling: "single-page-application"` → React Router works correctly
- `run_worker_first: ["/api/*"]` → API hits Worker before static assets
- `ai.binding = "AI"` → Use `env.AI` in code, NO API keys needed
- Only ONE AI binding per Worker allowed

---

### 1.5 Worker Backend Code

**File:** `src/worker/index.ts`

```typescript
export interface Env {
  AI: Ai;
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    // AI ROUTE 1: Project Description Generation
    if (url.pathname === "/api/generate-description" && request.method === "POST") {
      const { prompt } = await request.json<{ prompt: string }>();
      const result = await env.AI.run("@cf/zai-org/glm-4.7-flash", {
        messages: [{
          role: "user",
          content: `Write a concise portfolio project description for: ${prompt}. Under 150 words.`
        }]
      });
      return Response.json(result);
    }

    // AI ROUTE 2: Auto-Tagging
    if (url.pathname === "/api/auto-tag" && request.method === "POST") {
      const { description } = await request.json<{ description: string }>();
      const result = await env.AI.run("@cf/zai-org/glm-4.7-flash", {
        messages: [{
          role: "user",
          content: `Return ONLY a JSON array of 3-7 technology tags for: ${description}`
        }]
      });
      return Response.json(result);
    }

    // AI ROUTE 3: Image Alt-Text
    if (url.pathname === "/api/alt-text" && request.method === "POST") {
      const body = await request.json<{ imageBase64: string; mediaType: string }>();
      const result = await env.AI.run("@cf/moondream/moondream3.1-9B-A2B", {
        image: body.imageBase64,
        prompt: "Describe this project screenshot briefly for accessibility. Under 50 words."
      });
      return Response.json(result);
    }

    // AI ROUTE 4: Content Moderation
    if (url.pathname === "/api/moderate" && request.method === "POST") {
      const { text } = await request.json<{ text: string }>();
      const result = await env.AI.run("@cf/meta/llama-guard-3-8b", {
        messages: [{ role: "user", content: text }]
      });
      return Response.json(result);
    }

    // Serve React static assets
    return env.ASSETS.fetch(request);
  }
};
```

---

### 1.6 React Frontend API Client

**File:** `src/frontend/lib/api.ts`

```typescript
// Same-origin calls — no base URL, no API keys, no CORS issues

export async function generateDescription(prompt: string) {
  const res = await fetch("/api/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  return res.json();
}

export async function autoTagProject(description: string) {
  const res = await fetch("/api/auto-tag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error(`Auto-tag failed: ${res.status}`);
  return res.json();
}

export async function generateAltText(imageBase64: string, mediaType: string) {
  const res = await fetch("/api/alt-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mediaType }),
  });
  if (!res.ok) throw new Error(`Alt-text failed: ${res.status}`);
  return res.json();
}

export async function moderateContent(text: string) {
  const res = await fetch("/api/moderate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Moderation failed: ${res.status}`);
  return res.json();
}
```

---

### 1.7 Environment Variables Strategy

| Variable | Type | Where to Set |
|---|---|---|
| `SUPABASE_URL` | Non-secret | `wrangler.jsonc` vars section |
| `FIREBASE_API_KEY` | Non-secret (public client config) | `wrangler.jsonc` vars section |
| `FIREBASE_AUTH_DOMAIN` | Non-secret | `wrangler.jsonc` vars section |
| `FIREBASE_PROJECT_ID` | Non-secret | `wrangler.jsonc` vars section |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRET** | Cloudflare Dashboard / CLI only |

**Set secret via CLI:**
```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

**Local development `.dev.vars` (gitignored):**
```
SUPABASE_SERVICE_ROLE_KEY=your-local-test-key
```

**`.gitignore` required entries:**
```
dist/
.dev.vars
.env
.env.local
node_modules/
```

---

### 1.8 Cloudflare Pages Dashboard Build Settings

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 22 (default) |
| Production branch | `main` |

### 1.9 Local Development Command

```bash
npx wrangler pages dev --ai AI
# Access at: http://localhost:8787
```

> ⚠️ Note: Local dev mein bhi real Cloudflare account use hota hai — Neurons consume hote hain. Fully offline nahi hai.

### 1.10 Deployment Flow

```
GitHub push (main branch)
       ↓
Cloudflare detects changes
       ↓
npm run build (Vite → ./dist)
       ↓
Worker bundle (src/worker/index.ts)
       ↓
Static assets + Worker deployed together
       ↓
https://inspire-academy-team-hub.pages.dev
(ya aapka custom domain)
```

---

## SECTION 2 — COMPLETE TECH STACK + PROJECT SPECS

### 2.1 Technology Stack

```
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
Routing:      React Router v6
Auth:         Firebase Authentication (email/password, invite-only)
Database:     Supabase (PostgreSQL) with Row Level Security
File Storage: Supabase Storage (private + public buckets)
AI Services:  Cloudflare Workers AI (Free Plan)
Deployment:   Cloudflare Workers + Static Assets
CI/CD:        GitHub → Cloudflare auto-deploy
```

### 2.2 Three User Roles

**SUPER ADMIN (1 account only)**
- Complete platform control
- Creates and manages all team member accounts
- Reviews and approves all project submissions
- Publishes/unpublishes projects
- Manages assignments
- Access to all admin dashboards and analytics

**TEAM MEMBER (invite-only — admin creates accounts)**
- Private personal dashboard
- Views assigned tasks and updates progress
- Submits projects for admin review
- Uses built-in image-to-PDF converter
- Views own submission status and admin feedback
- Has public portfolio page (admin-controlled)

**PUBLIC VISITOR (no account needed)**
- Views public homepage
- Browses team directory
- Views individual member portfolios
- Sees only approved/published projects
- Searches and filters projects

### 2.3 Core Business Rules (Non-Negotiable)

1. Admin approval required before ANY project becomes public
2. Members CANNOT publish their own projects
3. Members CANNOT see other members' private data
4. Assignments are PRIVATE by default
5. Draft/Submitted/Rejected projects never appear in public listings
6. All privileged operations enforced server-side via Supabase RLS
7. No self-registration — admin creates all accounts
8. Admin account CANNOT be created from frontend

### 2.4 Project Status State Machine

```
Draft → Submitted → Under Review → Published
                           ↓
                 Changes Requested → (member edits) → Submitted
                           ↓
                       Rejected
                           ↓
                       Archived
```

**Rule:** Only "Published" status appears on public pages.

---

## SECTION 3 — SUPABASE DATABASE SCHEMA

### Table: users
```sql
CREATE TABLE users (
  id            uuid PRIMARY KEY,  -- matches Firebase Auth UID
  email         text UNIQUE NOT NULL,
  full_name     text NOT NULL,
  role          text CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  status        text CHECK (status IN ('active', 'suspended', 'deactivated')) DEFAULT 'active',
  profile_slug  text UNIQUE,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### Table: member_profiles
```sql
CREATE TABLE member_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users(id) ON DELETE CASCADE,
  title           text,
  bio             text,
  skills          text[],
  technologies    text[],
  avatar_url      text,
  github_url      text,
  linkedin_url    text,
  website_url     text,
  is_published    boolean DEFAULT false,
  featured_order  integer,
  seo_title       text,
  seo_description text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

### Table: assignments
```sql
CREATE TABLE assignments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  description         text,
  instructions        text,
  assigned_to         uuid[],
  priority            text CHECK (priority IN ('low','medium','high','urgent')),
  status              text CHECK (status IN (
    'assigned','accepted','in_progress','blocked',
    'submitted','revision_requested','completed','cancelled'
  )),
  due_date            date,
  progress_percent    integer DEFAULT 0,
  private_notes       text,
  is_public_showcase  boolean DEFAULT false,
  created_by          uuid REFERENCES users(id),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
```

### Table: categories
```sql
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now()
);
```

### Table: projects
```sql
CREATE TABLE projects (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  slug                text UNIQUE NOT NULL,
  short_description   text,
  full_description    text,
  category_id         uuid REFERENCES categories(id),
  technologies        text[],
  tags                text[],
  cover_image_url     text,
  gallery_image_urls  text[],
  pdf_url             text,
  website_url         text,
  live_preview_url    text,
  github_url          text,
  android_url         text,
  status              text CHECK (status IN (
    'draft','submitted','under_review',
    'changes_requested','published','rejected','archived'
  )) DEFAULT 'draft',
  member_id           uuid REFERENCES users(id),
  assignment_id       uuid REFERENCES assignments(id),
  is_featured         boolean DEFAULT false,
  seo_title           text,
  seo_description     text,
  admin_feedback      text,
  published_at        timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
```

### Table: notifications
```sql
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id),
  title       text NOT NULL,
  body        text,
  type        text,
  is_read     boolean DEFAULT false,
  related_id  uuid,
  created_at  timestamptz DEFAULT now()
);
```

### Table: audit_logs
```sql
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid REFERENCES users(id),
  actor_role  text,
  action      text NOT NULL,
  target_type text,
  target_id   uuid,
  outcome     text,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);
```

### Table: site_settings
```sql
CREATE TABLE site_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text UNIQUE NOT NULL,
  value       text,
  updated_by  uuid REFERENCES users(id),
  updated_at  timestamptz DEFAULT now()
);
```

### Supabase RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE POLICY "Admin sees all users"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Members see own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Projects table
CREATE POLICY "Public sees published projects only"
  ON projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "Members see own projects"
  ON projects FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Admin sees all projects"
  ON projects FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Members insert own draft projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = member_id AND status = 'draft');

CREATE POLICY "Members update own draft or changes-requested"
  ON projects FOR UPDATE
  USING (auth.uid() = member_id AND status IN ('draft', 'changes_requested'));

-- Assignments table
CREATE POLICY "Assignments private by default"
  ON assignments FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.uid() = ANY(assigned_to)
    OR is_public_showcase = true
  );

-- Audit logs (read-only, admin only, never editable)
CREATE POLICY "Only admin reads audit logs"
  ON audit_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Audit logs immutable"
  ON audit_logs FOR UPDATE
  USING (false);
```

---

## SECTION 4 — ROUTES INVENTORY

### Public Routes
```
/                          → Homepage
/team                      → Team directory
/team/:slug                → Individual member portfolio
/projects                  → All published projects
/projects/:slug            → Project detail page
/projects/category/:slug   → Category filtered projects
/about                     → About Inspire Academy
/contact                   → Contact page
/privacy                   → Privacy policy
/terms                     → Terms and conditions
```

### Admin Routes (protected — admin only)
```
/admin/login               → Admin login
/admin                     → Admin dashboard
/admin/members             → Team members list
/admin/members/new         → Create new member
/admin/members/:id         → Member detail + edit
/admin/assignments         → Assignments list
/admin/assignments/new     → Create assignment
/admin/assignments/:id     → Assignment detail
/admin/projects            → All projects
/admin/projects/pending    → Pending review queue ⭐
/admin/projects/:id/review → Review project (approve/reject/changes)
/admin/projects/published  → Published projects
/admin/files               → File manager
/admin/categories          → Categories management
/admin/notifications       → Notifications center
/admin/analytics           → Analytics dashboard
/admin/logs                → Audit logs
/admin/settings            → Site settings
```

### Member Dashboard Routes (protected — member only)
```
/dashboard                 → Member dashboard
/dashboard/profile         → My profile (edit bio, skills, links)
/dashboard/assignments     → My assignments
/dashboard/assignments/:id → Assignment detail + progress update
/dashboard/projects        → My projects list
/dashboard/projects/new    → Create new project
/dashboard/projects/:id    → Edit project draft
/dashboard/pdf-converter   → Image to PDF tool ⭐
/dashboard/notifications   → My notifications
/dashboard/settings        → Account settings
```

---

## SECTION 5 — IMPLEMENTATION PHASES

### Phase 1 — Project Foundation
**Goal:** Working structure, all services connected, auth working

**Build:**
- Vite + React + TypeScript initialized
- Tailwind CSS + shadcn/ui configured
- React Router v6 with ALL routes defined (empty page components)
- Firebase Authentication initialized
- Supabase client configured (`src/frontend/lib/supabase.ts`)
- `wrangler.jsonc` created as specified
- Worker `index.ts` with all 4 AI endpoints
- ALL Supabase tables created as SQL migration files
- ALL RLS policies applied
- GitHub repo created + Cloudflare connected
- `.gitignore` with `dist/` and `.dev.vars`

**Acceptance Criteria:**
- `npm run build` succeeds without errors
- `npx wrangler pages dev --ai AI` runs at localhost:8787
- Firebase Auth connects (no login UI yet)
- Supabase connection test passes
- All routes return 200 (empty pages ok)

---

### Phase 2 — Admin Dashboard + Member Management
**Goal:** Admin can log in, see dashboard, manage team members

**Build:**
- Admin login page (Firebase Auth)
- Role-based route protection (redirect non-admins)
- Admin dashboard with stats cards
- Team members list page with status badges
- Create member form (admin only — no self-registration)
- Edit member page
- Suspend/activate/deactivate member
- Member detail view

**Acceptance Criteria:**
- Admin logs in with email/password
- Non-admin redirected away from /admin/*
- Admin can create a member account
- Admin can suspend a member
- Member cannot access /admin/* routes

---

### Phase 3 — Member Dashboard + Profile
**Goal:** Team members log in, manage their profile

**Build:**
- Member login page
- Member dashboard (personal stats only)
- My Profile page (edit bio, title, skills, social links)
- Account settings page
- Notification bell + dropdown
- Mobile-responsive member layout

**Acceptance Criteria:**
- Member logs in and sees ONLY own data
- Member cannot access /admin/* routes
- Profile updates save to Supabase
- Supabase RLS verified: member A cannot see member B's data

---

### Phase 4 — Assignment Management
**Goal:** Admin creates assignments, members view and update them

**Build:**
- Admin: Create assignment form (title, description, assigned_to, priority, due_date)
- Admin: Assignment list with status filters
- Admin: Assignment detail view
- Member: My Assignments list
- Member: Assignment detail + progress slider (0-100%)
- Member: Mark as blocked (with reason text)
- Status workflow: Assigned → In Progress → Submitted
- Admin gets notification on status changes

**Acceptance Criteria:**
- Admin creates assignment, assigned member sees it in dashboard
- Member updates progress % (saves to Supabase)
- Member marks as blocked → admin gets in-app notification
- Assignment stays private (never on public pages)
- `is_public_showcase = false` by default (admin must explicitly enable)

---

### Phase 5 — Project Submission + Approval Workflow
**Goal:** Complete project lifecycle from draft to published

**Build:**
- Member: Create project draft form (all fields from schema)
- Member: Upload cover image + gallery images (Supabase Storage)
- Member: Upload PDF (Supabase Storage)
- Member: Add links (GitHub, live preview, Android)
- Member: Preview project before submit
- Member: Submit for review button (changes status to 'submitted')
- Admin: Pending review queue at /admin/projects/pending
- Admin: Project review screen (approve / reject / request changes)
- Admin: Publish approved project (changes status to 'published')
- Revision workflow: member can edit after 'changes_requested'

**AI Integration in this phase:**
- "✨ Generate Description" button → calls `/api/generate-description`
- "🏷️ Auto-Tag" button → calls `/api/auto-tag`
- Content moderation check on submit → calls `/api/moderate`

**Acceptance Criteria:**
- Member submits project → appears in admin's pending queue
- Admin approves → project status becomes 'published'
- Admin requests changes → member sees feedback, can edit and resubmit
- Rejected project NEVER appears in public listings
- Member CANNOT directly change status to 'published' (RLS enforces this)
- AI description generation works (calls Cloudflare Workers AI)

---

### Phase 6 — Public Portfolio Pages
**Goal:** Public-facing website for visitors

**Build:**
- Homepage (hero section, featured projects, team preview)
- Team directory page (/team)
- Individual member portfolio page (/team/:slug)
- All projects page (/projects) with search + filter
- Project detail page (/projects/:slug)
- Category pages (/projects/category/:slug)
- About page (/about)
- Contact page (/contact)
- SEO meta tags on all public pages
- Open Graph tags for social sharing
- Mobile responsive on all public pages

**Acceptance Criteria:**
- ONLY published projects appear on public pages
- ONLY published member profiles appear in team directory
- Private data NEVER shown to visitors (RLS enforced)
- Search returns only published results
- All pages mobile responsive

---

### Phase 7 — Image to PDF Converter
**Goal:** Client-side image to PDF tool in member dashboard

**Build (all client-side using jsPDF or pdf-lib):**
- Drag and drop image upload interface
- Image preview grid (JPG, PNG, WEBP supported)
- Reorder images (drag to rearrange)
- Remove individual images
- Rotate images (90° increments)
- Page size selector: A4 / Letter / Auto Fit
- Portrait / Landscape toggle
- Compression quality slider
- Custom PDF filename input
- "Generate PDF" button (client-side processing)
- PDF preview before download
- "Download PDF" button
- "Attach to Project" button (uploads to Supabase Storage)

**Acceptance Criteria:**
- 10 images convert to single PDF under 30 seconds
- PDF downloads correctly to user's device
- Generated PDF can be attached to a project submission
- Original images NOT uploaded to server unless explicitly chosen
- Warning shown if PDF exceeds 10MB
- Large file warning appears before generation if images are very large

---

### Phase 8 — File Management + AI Alt-Text
**Goal:** Secure file handling, AI accessibility, admin file manager

**Build:**
- AI alt-text auto-generation on image upload (calls `/api/alt-text`)
- Admin file manager page at /admin/files
- File metadata stored in Supabase (not binary data)
- Supabase Storage: 2 buckets
  - `private-submissions` (not publicly accessible)
  - `public-assets` (accessible after project published)
- Storage usage display in admin dashboard
- File type validation (MIME type, NOT just extension)
- File size limits enforced

**Acceptance Criteria:**
- Uploaded image gets AI-generated alt text automatically
- Private files NOT accessible via public URL
- Published project files served from public bucket
- Admin can view all files with metadata
- Invalid file types rejected with clear error message

---

### Phase 9 — Security Hardening + QA

**Security Checklist:**
- [ ] All Supabase RLS policies tested individually
- [ ] IDOR test: member A cannot access member B's project by changing ID in URL
- [ ] Admin-only endpoints tested for unauthorized access attempts
- [ ] Member CANNOT call publish API directly (RLS blocks it)
- [ ] Visitor CANNOT access private Supabase Storage paths
- [ ] Firebase token verification working in Worker
- [ ] Rate limiting on /api/* routes
- [ ] Input sanitization on all forms (XSS prevention)
- [ ] File MIME type validation (not just extension check)
- [ ] File size limits enforced server-side
- [ ] Audit log entries for: login, project submit, approve, reject, publish
- [ ] 404 page working correctly
- [ ] Error boundaries in React components
- [ ] Loading states on all async operations
- [ ] Empty states on all list views
- [ ] Mobile responsive test: all pages on mobile

---

### Phase 10 — Production Deployment

**Step-by-step:**
1. All secrets set in Cloudflare Dashboard (NOT in wrangler.jsonc)
2. Custom domain connected to Cloudflare Pages
3. HTTPS verified (Cloudflare handles automatically)
4. Firebase Auth: add custom domain to authorized domains list
5. Supabase: add custom domain to allowed origins
6. Create admin account in production
7. Test complete workflow: submit → approve → publish
8. XML sitemap at `/sitemap.xml`
9. `robots.txt` configured:
   ```
   User-agent: *
   Disallow: /admin/
   Disallow: /dashboard/
   Allow: /
   ```
10. Cloudflare Analytics enabled
11. Supabase database backups configured
12. All 4 AI endpoints tested in production environment

**Go-Live Checklist:**
- [ ] Admin can log in
- [ ] Admin can create a team member account
- [ ] Member can log in with invite credentials
- [ ] Member can submit a project
- [ ] Admin can approve and publish the project
- [ ] Public visitor can see published project
- [ ] AI description generation works (Cloudflare Workers AI)
- [ ] PDF converter works (generates downloadable PDF)
- [ ] All pages mobile responsive
- [ ] No console errors in production
- [ ] Private data verified as inaccessible to public

---

## SECTION 6 — GOOGLE AI STUDIO MASTER BUILD PROMPT

**Copy this entire prompt and paste it into Google AI Studio:**

---

```
You are a senior full-stack developer. Build the "Inspire Academy Team Hub"
web application exactly according to the specifications below.
Do not skip any requirement. Do not use fake authentication or mock databases.
Do not use localStorage as a primary database.

PROJECT: Inspire Academy Team Hub
An academy team management + public portfolio platform for Inspire Academy.

TECH STACK (use exactly these — no substitutions):
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS + shadcn/ui component library
- Routing: React Router v6
- Auth: Firebase Authentication (email/password only, invite-only model)
- Database: Supabase (PostgreSQL with Row Level Security enabled)
- File Storage: Supabase Storage (two buckets: private-submissions, public-assets)
- AI: Cloudflare Workers AI (via /api/* routes, free plan models only)
- Deployment: Cloudflare Workers + Static Assets (unified approach — NOT Pages + separate Worker)
- Config: wrangler.jsonc (not wrangler.toml)

FOLDER STRUCTURE (create exactly this):
inspire-academy-team-hub/
├── wrangler.jsonc
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore  (must include: dist/, .dev.vars, .env*, node_modules/)
├── public/
│   └── favicon.svg
├── src/
│   ├── frontend/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── MemberLayout.tsx
│   │   │   │   └── PublicLayout.tsx
│   │   │   └── ui/  (shadcn components)
│   │   └── lib/
│   │       ├── api.ts        (Cloudflare AI calls)
│   │       ├── auth.ts       (Firebase + Supabase sync)
│   │       └── supabase.ts   (Supabase client)
│   └── worker/
│       └── index.ts          (AI routes + ASSETS fallback)

wrangler.jsonc CONTENT:
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "inspire-academy-team-hub",
  "main": "src/worker/index.ts",
  "compatibility_date": "2026-11-10",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "ai": { "binding": "AI" },
  "observability": { "enabled": true }
}

CLOUDFLARE WORKERS AI — FREE PLAN MODELS ONLY:
- Text generation: @cf/zai-org/glm-4.7-flash
- Image alt-text: @cf/moondream/moondream3.1-9B-A2B
- Moderation: @cf/meta/llama-guard-3-8b
DO NOT use: @cf/moonshotai/kimi-k2.6, @cf/moonshotai/kimi-k2.7-code, @cf/zai-org/glm-5.2 (paid only)

AI ENDPOINTS (implement in src/worker/index.ts):
POST /api/generate-description  → @cf/zai-org/glm-4.7-flash (project description)
POST /api/auto-tag              → @cf/zai-org/glm-4.7-flash (return JSON array of tags)
POST /api/alt-text              → @cf/moondream/moondream3.1-9B-A2B (image accessibility)
POST /api/moderate              → @cf/meta/llama-guard-3-8b (content safety)

THREE USER ROLES:
1. SUPER ADMIN (1 account): Full platform control, creates members, approves/publishes projects
2. TEAM MEMBER (invite-only, admin creates): Submits projects, cannot publish
3. PUBLIC VISITOR (no account): Sees only published content

CRITICAL BUSINESS RULES (must be enforced via Supabase RLS, not just frontend):
- Members CANNOT publish their own projects (RLS must block status change to 'published')
- Admin must approve EVERY project before it appears publicly
- Assignments are PRIVATE by default (is_public_showcase = false)
- Draft/Submitted/Rejected/Archived projects NEVER appear in public listings
- No self-registration (admin creates all member accounts)
- Never put secrets in frontend code or wrangler.jsonc
- Use env.AI binding for Workers AI — no API keys anywhere in code

PROJECT STATUS STATE MACHINE:
Draft → Submitted → Under Review → Published
                          ↓
                Changes Requested → Submitted (after member edits)
                          ↓
                      Rejected → Archived

DATABASE: Create these tables in Supabase with RLS enabled on all:
[See Section 3 of this document for complete SQL]

START WITH PHASE 1:
Create the complete project foundation with all files and folder structure.
Include:
1. All files as specified in folder structure above
2. package.json with all required dependencies
3. wrangler.jsonc exactly as shown above
4. src/frontend/lib/supabase.ts (Supabase client setup)
5. src/frontend/lib/auth.ts (Firebase initialization + Supabase JWT sync)
6. src/frontend/lib/api.ts (all 4 Cloudflare AI function calls)
7. src/worker/index.ts (all 4 AI endpoints + ASSETS fallback)
8. React Router App.tsx with ALL routes defined (empty page components for now)
9. AdminLayout, MemberLayout, PublicLayout components
10. SQL migration files for all 8 database tables
11. SQL file with all RLS policies
12. .gitignore with correct entries

After Phase 1 is complete, confirmed working, and you have shown me all files,
tell me "PHASE 1 COMPLETE" and wait for my Phase 2 instructions.
```

---

## SECTION 7 — QUICK REFERENCE

### Key Commands

```bash
# Install all dependencies
npm install

# Local development with Cloudflare Workers AI
npx wrangler pages dev --ai AI
# Access at: http://localhost:8787

# Production build
npm run build

# Manual deploy to Cloudflare (usually auto via GitHub)
npx wrangler deploy

# Set a production secret
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# View production logs
npx wrangler tail
```

### External Service Setup Checklist

```
FIREBASE:
□ Firebase Project created at console.firebase.google.com
□ Authentication → Sign-in method → Email/Password: ENABLED
□ Authentication → Settings → Authorized domains: add your Cloudflare Pages domain
□ Firebase config values copied (apiKey, authDomain, projectId, appId)

SUPABASE:
□ Supabase project created at supabase.com
□ SQL Editor: all 8 tables created
□ SQL Editor: all RLS policies applied
□ Authentication → Settings: Row Level Security toggle ON
□ Settings → API: anon key and service_role key copied
□ Settings → API → JWT Settings: configure to accept Firebase tokens

CLOUDFLARE:
□ Cloudflare account created (cloudflare.com)
□ Workers & Pages → Overview → "Create application"
□ Pages tab → "Connect to Git" → select GitHub repo
□ Build settings: Framework=Vite, Build command=npm run build, Output=dist
□ Settings → Functions → KV, R2, D1, Workers AI → AI binding: name it "AI"
□ Settings → Environment variables → Add secret: SUPABASE_SERVICE_ROLE_KEY
□ Custom domain connected (optional for production)

GITHUB:
□ Repository created
□ .gitignore confirmed: dist/ and .dev.vars included
□ Main branch set as production branch
□ Connected to Cloudflare Pages
```

### Assumptions Log

```
ASSUMPTION 1: Single admin account — no sub-admins in MVP
ASSUMPTION 2: English + Urdu bilingual UI (RTL support in Phase 2)
ASSUMPTION 3: Email notifications in Phase 2 (in-app only for MVP)
ASSUMPTION 4: Image-to-PDF is client-side (jsPDF or pdf-lib library)
ASSUMPTION 5: Supabase free tier sufficient for MVP team size
ASSUMPTION 6: Firebase Spark (free) plan sufficient for MVP auth
ASSUMPTION 7: Cloudflare Workers free plan (10K Neurons/day) sufficient for internal team
ASSUMPTION 8: React Router v6 for client-side routing
ASSUMPTION 9: shadcn/ui for consistent component library
```

---

*Document prepared: November 2026*
*Source: Cloudflare official support AI responses (verified)*
*Platform: Inspire Academy Team Hub*
