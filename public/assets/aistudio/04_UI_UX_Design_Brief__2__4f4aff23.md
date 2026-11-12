# 04 — UI/UX Design Brief

**Product:** Inspire Team · **Version:** 1.0 · **Date:** 12 Nov 2026
Related: `03_App_Flow.md` (pages/states) · `02_TRD.md` §18 (i18n/RTL/theme) · `01_PRD.md` (NFR-002 accessibility)

---

## 1. Design Direction

A **modern, premium digital-agency** look: confident, calm, trustworthy. Generous whitespace, soft depth, crisp typography, subtle motion. Not a generic admin template. Public site feels like a creative studio; admin/member portals feel like a clean SaaS workspace with the same brand DNA.

Keywords: *polished, technical, warm, credible.* Avoid: neon gradients everywhere, heavy skeuomorphism, stock-photo clichés.

## 2. Brand Tokens (configurable; defaults 🟡 assumed)

Implement as CSS variables in `globals.css`; Tailwind maps to them. Admin can override primary/secondary/accent from `site_settings.branding` (applied at runtime to `:root`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F8FAFC` | `#0B1020` | page background |
| `--surface` | `#FFFFFF` | `#121A2E` | cards |
| `--surface-2` | `#F1F5F9` | `#18223B` | subtle panels, table header |
| `--border` | `#E2E8F0` | `#26314D` | borders |
| `--text` | `#0F172A` | `#E8ECF6` | primary text |
| `--text-muted` | `#475569` | `#9AA7C2` | secondary text |
| `--primary` | `#4338CA` | `#818CF8` | brand, links, primary buttons |
| `--primary-contrast` | `#FFFFFF` | `#0B1020` | text on primary |
| `--secondary` | `#0F766E` | `#2DD4BF` | secondary actions, success-ish accents |
| `--accent` | `#14B8A6` | `#5EEAD4` | highlights, charts (not for small text on light bg) |
| `--success` | `#15803D` | `#4ADE80` | |
| `--warning` | `#B45309` | `#FBBF24` | |
| `--danger` | `#B91C1C` | `#F87171` | |
| `--info` | `#1D4ED8` | `#60A5FA` | |
| `--focus-ring` | `#4338CA` | `#A5B4FC` | 2 px focus outline + 2 px offset |

Contrast target: body text ≥ 4.5:1, large text/UI components ≥ 3:1 in both themes. Never convey status by colour alone (always icon/text).

Gradients: one signature gradient `primary → secondary` at 8–12 % opacity for hero backgrounds; never behind body text.

## 3. Typography

| Role | Latin | Urdu |
|---|---|---|
| Headings | Plus Jakarta Sans 600/700 | Noto Naskh Arabic 600/700 (optional Noto Nastaliq Urdu for hero display only) |
| Body/UI | Inter 400/500/600 | Noto Naskh Arabic 400/500 |
| Code/mono | JetBrains Mono (URLs, IDs) | — |

Scale (rem): 12 · 14 · 16 (body) · 18 · 20 · 24 · 30 · 36 · 48 (hero, desktop). Line-height 1.5 body, 1.2 headings; Urdu line-height +0.15 (Naskh needs more). Always provide fallback stacks (`system-ui, sans-serif`). Max line length 70 ch.

## 4. Spacing, Shape, Elevation

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Page gutters 16 (mobile) / 24 (tablet) / 32 (desktop); content max-width 1200 (public), 1440 (admin).
- Radius: 8 (inputs/buttons), 12 (cards), 16 (modals/hero panels), 999 (badges/avatars).
- Shadows: `sm` (cards at rest), `md` (hover/dropdown), `lg` (modals). In dark mode use borders + subtle glow instead of heavy shadows.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

## 5. Layouts

**Public layout:** sticky header (logo, nav: Home, About, Team, Projects, Contact; language + theme toggles; search icon; "Contact" CTA), footer (brand blurb, quick links, social, contact, copyright). Mobile: hamburger drawer.

**Admin layout:** left sidebar (collapsible; grouped: Overview · People · Work · Content · System), top bar (global search, notifications bell, language, theme, user menu), content area with page title + breadcrumbs + primary action at top-end. Mobile: sidebar becomes slide-over drawer; tables become stacked cards with key fields.

**Member layout:** simpler sidebar (Dashboard, Assignments, Projects, Image→PDF, Files, Notifications, Profile, Settings) with the same top bar.

## 6. Component Library (build once, reuse everywhere)

| Component | Spec |
|---|---|
| Button | Variants primary / secondary / outline / ghost / danger; sizes sm/md/lg; loading + disabled states; min touch target 44 px |
| Input / Textarea / Select / Combobox / Checkbox / Radio / Switch | Label above, helper text, error text with icon, `aria-describedby`, `aria-invalid` |
| TagInput | Chips, suggestions from approved tags, "suggest new" |
| Badge / StatusBadge | Project status (draft grey, submitted blue, under review indigo, changes requested amber, published green, rejected red, archived slate), assignment status, priority; icon + text |
| Card | Surface, border, radius 12, hover lift on interactive cards |
| ProjectCard | 16:10 cover (`ImageSlot`), category chip, title (2 lines clamp), member avatar + name, tag chips (max 3), featured ribbon |
| MemberCard | Avatar, name, title, top 3 skills, "View portfolio" |
| DataTable | Sticky header, sortable, row hover, selection (where needed), pagination, empty/loading/error rows; ≤ md converts to card list |
| Modal / Drawer / ConfirmDialog | Focus trap, ESC closes, return focus, title + description, destructive variant |
| Toast | Top-end, 4 s, icon + message + optional action, `role=status` |
| Tabs, Accordion, Tooltip, Dropdown, Breadcrumbs, Pagination | Keyboard accessible |
| Skeleton | Matches component shapes, pulse (respects reduced-motion) |
| EmptyState / ErrorState | Illustration slot (`ImageSlot`), title, body, action |
| FileDropzone | Drag-over highlight, click/keyboard to choose, rejected-file list, progress rows |
| ImageSlot | Wrapper `<img>` with aspect ratio, `loading=lazy`, alt text, `object-fit`, and **designed gradient placeholder** when no image URL is provided (no external stock URLs) |
| Stepper / ChecklistItem | Submit checklist, PDF tool steps |
| StatCard / ChartCard | KPI number, delta, sparkline; chart with accessible table fallback |
| NotificationBell | Badge count, popover list, "View all" |
| LanguageSwitcher / ThemeToggle | Segmented controls with labels (not icon-only) |
| ReorderList | Drag handle + ▲▼ buttons (keyboard) with `aria-live` announcements |
| Lightbox | Gallery viewer, arrows/ESC, focus trap, captions |
| RichTextArea | Plain textarea with markdown hint + preview tab (no HTML) |

## 7. Key Screen Designs

**Homepage:** Hero (large headline, supporting line, two CTAs "Explore Projects" / "Contact Us", gradient + abstract shapes, optional hero image slot) → stat strip (members, projects, categories) → Featured projects (3×2 grid) → Categories (icon cards) → Meet Our Team (avatar cards, "View all") → Showcase teaser → CTA band → footer.

**Member Profile:** cover band with gradient; large avatar overlapping; name/title; social icon buttons; skills chips; tabs "Projects / About / Showcases"; project grid with category filter chips.

**Project Detail:** breadcrumb; title + chips; gallery (main image + thumbnails, lightbox); two-column desktop (content left, sticky info card right: member, date, role, links buttons, PDF); stacks on mobile; related projects row.

**Admin Dashboard:** 4-column KPI row (collapses to 2/1), chart row, two-column lists. Overdue and awaiting-review tiles use warning colour + icon.

**Review Screen:** two-pane — left: tabbed content (rendered like public page, media grid, version list, feedback timeline); right: sticky action panel with primary "Approve & Publish" and secondary actions; status badge and version selector at top. Internal notes area visually distinct (lock icon, "Admin only").

**Image-to-PDF Tool:** three-column desktop (1 Files grid · 2 Settings · 3 Output preview); stacked wizard-like sections on mobile with sticky "Generate PDF" bar. Thumbnails 120 px with overlay controls; clear size estimate after generation (actual size, not promised savings).

**Member Dashboard:** greeting, "Next due" hero card, status chips row, assignments list, projects list, feedback callout when changes requested.

## 8. Responsive Rules

- Mobile first. All admin/member pages must remain fully operable at 360 px: tables → cards, filters in a drawer, action buttons full-width in sticky bottom bar where primary (e.g., Generate PDF, Submit).
- No horizontal page scroll; wide tables scroll inside their container only.
- Images: `srcset`/responsive sizes, aspect-ratio boxes to avoid layout shift.
- Touch targets ≥ 44×44 px; hover-only interactions must have tap/keyboard equivalents.

## 9. RTL (Urdu) Rules

- `dir="rtl"` on `<html>`; **use logical properties only** (`ms/me/ps/pe`, `start/end`, `text-start`); never `left/right` utilities for layout.
- Mirror: sidebars, breadcrumbs separators, arrows/chevrons, progress direction, drawer slide direction, pagination order. Do **not** mirror: logos, phone numbers, code, charts' time axis (keep left→right), media controls.
- Urdu typeface sizes +1 step for readability; verify clipped ascenders/descenders.
- Numbers: Western digits by default (configurable later); dates via `Intl.DateTimeFormat(locale)`.
- Mixed-direction text (English tech terms inside Urdu) wrapped with `<bdi>` or `dir="auto"` for tags, URLs, usernames.
- Every component must be checked in both directions (Definition of Done).

## 10. Dark / Light Mode

Tokens swap via `.dark` class; images keep natural colours; shadows replaced by borders; charts use token colours; focus rings visible in both; theme chosen by toggle (`light/dark/system`), persisted, no flash on load (inline script sets class before paint).

## 11. Motion & Feedback

Durations 150–250 ms ease-out; page/section fade-up on first view (translate 8 px); card hover lift 2 px; skeleton pulse; progress bars for uploads/PDF. Respect `prefers-reduced-motion` (disable transforms/animations, keep opacity fades ≤ 100 ms).

## 12. Accessibility (WCAG 2.2 AA target)

- Semantic landmarks (`header, nav, main, aside, footer`), one `h1` per page, logical heading order, skip-to-content link.
- Visible focus on every interactive element; no keyboard traps except intentional modal traps with ESC.
- Forms: associated labels, required markers with text, errors linked via `aria-describedby`, error summary on submit failure.
- Status messages via `aria-live` (toasts, upload/PDF progress, reorder announcements).
- Data tables: `<th scope>`, captions; charts have text summaries/tables.
- Images: meaningful `alt` (admin/member-provided for project images; decorative `alt=""`).
- Drag & drop always has a keyboard alternative.
- Target size minimum 24 px (aim 44 px); not relying on colour alone; text resizable to 200 %.
- Language attributes set; Urdu content `lang="ur"`.

## 13. Imagery & Icon Direction

- **Functional UI icons:** `lucide-react` (stroke 1.75, 20 px default) — consistent, themeable.
- **Brand/decorative imagery** (hero visual, empty-state illustrations, category/service icons, OG image, logo) will be supplied later through the project's Images workflow. Until then the build must use `ImageSlot` placeholders (soft gradient + subtle pattern) — **no hotlinked stock photos, no random placeholder URLs**.
- Illustration style when generated: flat-vector, indigo/teal palette, soft shapes, friendly-professional, transparent PNG for icons.
- Avatars: circular, fallback to initials on `--surface-2`.
- Project covers: 16:10, cropped with `object-fit: cover`; keep key subject centred.

## 14. Content & Microcopy

Tone: clear, respectful, concise. Buttons are verbs ("Submit for review", "Approve & publish"). Errors explain the fix ("File is larger than 10 MB. Try the Small quality preset."). Every destructive confirm states the consequence. All strings in `en.json` and `ur.json` (Urdu strings must be natural, not literal; flag any uncertain strings for owner review).

## 15. Design Definition of Done (per page)

1. Matches tokens; both themes verified. 2. Works EN + UR (RTL). 3. 360 / 768 / 1280 px verified. 4. Loading, empty, error, success states present. 5. Keyboard-only walkthrough passes. 6. Focus and contrast checked. 7. No hard-coded colours, strings or `left/right` positioning.
