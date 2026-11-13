import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminGuard } from './components/layout/AdminGuard';
import { MemberLayout } from './components/layout/MemberLayout';

// Public Pages
import { HomePage } from './features/public/HomePage';
import { ProjectsPage } from './features/public/ProjectsPage';
import { ProjectDetailPage } from './features/public/ProjectDetailPage';
import { TeamPage } from './features/public/TeamPage';
import { MemberProfilePage } from './features/public/MemberProfilePage';
import { CategoriesPage } from './features/public/CategoriesPage';
import { AboutPage } from './features/public/AboutPage';
import { ContactPage } from './features/public/ContactPage';

// Auth Pages (Member only has explicit route; Admin login is embedded inside /admin via AdminGuard)
import { MemberLoginPage } from './features/auth/MemberLoginPage';

// Admin Pages
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AdminWebsiteEditor } from './features/admin/AdminWebsiteEditor';
import { AdminBranding } from './features/admin/AdminBranding';
import { AdminSEO } from './features/admin/AdminSEO';
import { AdminSettings } from './features/admin/AdminSettings';
import { AdminLogsPage } from './features/admin/AdminLogsPage';
import { AdminMembersPage } from './features/admin/AdminMembersPage';
import { AdminPortfolioProjectsPage } from './features/admin/AdminPortfolioProjectsPage';
import { AdminAssignmentsPage } from './features/admin/AdminAssignmentsPage';

// Member Pages
import { MemberDashboard } from './features/member/MemberDashboard';
import { CreateProjectPage } from './features/member/CreateProjectPage';
import { ImageToPdfTool } from './features/pdf-tool/ImageToPdfTool';
import { SeoManager } from './components/SeoManager';

function NotFoundPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-6xl font-black text-indigo-600">404</div>
        <h2 className="text-xl font-bold text-[var(--text)]">
          {config.custom_404_heading || 'Page Not Found'}
        </h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {config.custom_404_message ||
            'The page you are looking for does not exist or has been relocated.'}
        </p>
        <a
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow"
        >
          {config.custom_404_button_text || 'Return to Homepage'}
        </a>
      </div>
    </PublicLayout>
  );
}

function PrivacyPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-extrabold text-[var(--text)]">Privacy Policy</h1>
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <p className="whitespace-pre-line">{config.privacy_content}</p>
        </div>
      </div>
    </PublicLayout>
  );
}

function TermsPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-extrabold text-[var(--text)]">Terms of Academy Governance</h1>
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <p className="whitespace-pre-line">{config.terms_content}</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <SeoManager />
            {/* Public Showcase Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <PublicLayout>
                  <ProjectsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <PublicLayout>
                  <ProjectDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/team"
              element={
                <PublicLayout>
                  <TeamPage />
                </PublicLayout>
              }
            />
            <Route
              path="/team/:slug"
              element={
                <PublicLayout>
                  <MemberProfilePage />
                </PublicLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <PublicLayout>
                  <CategoriesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Member Auth */}
            <Route
              path="/member/login"
              element={
                <PublicLayout>
                  <MemberLoginPage />
                </PublicLayout>
              }
            />

            {/* Hidden Admin URL Access (No public links. Directly rendered via AdminGuard) */}
            <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/website"
              element={
                <AdminGuard>
                  <AdminWebsiteEditor />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/content"
              element={<Navigate to="/admin/website" replace />}
            />
            <Route
              path="/admin/branding"
              element={
                <AdminGuard>
                  <AdminBranding />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/seo"
              element={
                <AdminGuard>
                  <AdminSEO />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminGuard>
                  <AdminSettings />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <AdminGuard>
                  <AdminLogsPage />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/activity"
              element={<Navigate to="/admin/logs" replace />}
            />
            <Route
              path="/admin/members"
              element={
                <AdminGuard>
                  <AdminMembersPage />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/projects"
              element={<AdminGuard><AdminPortfolioProjectsPage /></AdminGuard>}
            />
            <Route
              path="/admin/assignments"
              element={
                <AdminGuard>
                  <AdminAssignmentsPage />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/projects/published"
              element={
                <AdminGuard>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Live Published Work</h1>
                    <ProjectsPage />
                  </div>
                </AdminGuard>
              }
            />
            <Route
              path="/admin/files"
              element={
                <AdminGuard>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Storage File Manager</h1>
                    <p className="text-xs text-slate-400">Storage quota and file audit log (PRD FILE-001).</p>
                    <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900 text-center text-xs text-slate-400">
                      Private Bucket: 14 MB used / 1024 MB quota · Public Media: 38 MB
                    </div>
                  </div>
                </AdminGuard>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminGuard>
                  <CategoriesPage />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/tags"
              element={
                <AdminGuard>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Taxonomy & Technology Tags</h1>
                    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900">
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Tailwind CSS', 'Kotlin', 'Jetpack Compose', 'Figma', 'Node.js', 'PostgreSQL'].map((t) => (
                          <span key={t} className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-800/80 text-xs font-semibold text-slate-300">
                            {t} (Approved)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AdminGuard>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <AdminGuard>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
                    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 text-xs space-y-2">
                      <div className="p-3 rounded-xl bg-slate-800 text-slate-200 font-medium">
                        New submission received from Hamza Farooq for "Nova AI Support"
                      </div>
                    </div>
                  </div>
                </AdminGuard>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminGuard>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Academy Analytics & Reports</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="text-xs text-slate-400">Approval Velocity</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">1.2 Days Avg</div>
                      </div>
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="text-xs text-slate-400">Assignment On-Time %</div>
                        <div className="text-2xl font-bold text-indigo-400 mt-1">94.8%</div>
                      </div>
                      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="text-xs text-slate-400">Storage Utilized</div>
                        <div className="text-2xl font-bold text-teal-400 mt-1">52 MB / 1024 MB</div>
                      </div>
                    </div>
                  </div>
                </AdminGuard>
              }
            />

            {/* Member Portal Routes */}
            <Route
              path="/member"
              element={
                <MemberLayout>
                  <MemberDashboard />
                </MemberLayout>
              }
            />
            <Route
              path="/member/assignments"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text)]">My Assigned Deliverables</h1>
                    <MemberDashboard />
                  </div>
                </MemberLayout>
              }
            />
            <Route
              path="/member/projects"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-[var(--text)]">My Projects</h1>
                    </div>
                    <MemberDashboard />
                  </div>
                </MemberLayout>
              }
            />
            <Route
              path="/member/projects/new"
              element={
                <MemberLayout>
                  <CreateProjectPage />
                </MemberLayout>
              }
            />
            <Route
              path="/member/projects/:id"
              element={
                <MemberLayout>
                  <CreateProjectPage />
                </MemberLayout>
              }
            />
            <Route
              path="/member/projects/:id/edit"
              element={
                <MemberLayout>
                  <CreateProjectPage />
                </MemberLayout>
              }
            />
            <Route
              path="/member/tools/image-to-pdf"
              element={
                <MemberLayout>
                  <ImageToPdfTool />
                </MemberLayout>
              }
            />
            <Route
              path="/member/submissions"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text)]">Submission History & Reviews</h1>
                    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)]">
                      Lumina Analytics: Approved & Published · Nova AI: Submitted under review.
                    </div>
                  </div>
                </MemberLayout>
              }
            />
            <Route
              path="/member/profile"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text)]">My Public Profile Preview</h1>
                    <MemberProfilePage />
                  </div>
                </MemberLayout>
              }
            />
            <Route
              path="/member/notifications"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text)]">My Notifications</h1>
                    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs">
                      Admin requested typography adjustments on "EcoMarket Mobile UI Kit"
                    </div>
                  </div>
                </MemberLayout>
              }
            />
            <Route
              path="/member/settings"
              element={
                <MemberLayout>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text)]">Member Account Settings</h1>
                    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs space-y-2">
                      <div>Email: <strong>hamza.dev@inspireacademy.edu</strong></div>
                      <div>Role: <strong>Member</strong></div>
                    </div>
                  </div>
                </MemberLayout>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}
