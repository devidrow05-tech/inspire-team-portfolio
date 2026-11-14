import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Layouts & Motion Primitives
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminGuard } from './components/layout/AdminGuard';
import { MemberLayout } from './components/layout/MemberLayout';
import { PageWrapper, CursorGlow } from './components/ui/MotionPrimitives';
import { SeoManager } from './components/SeoManager';
import { useSmoothScroll } from './frontend/lib/smoothScroll';
import {
  ScrollProgressBar,
  MagneticCursor,
  PageLoader,
} from './frontend/components/animations';

// Public Pages
import { HomePage } from './features/public/HomePage';
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
import { AdminMessagesPage } from './features/admin/AdminMessagesPage';
import { AdminWebsiteEditor } from './features/admin/AdminWebsiteEditor';
import { AdminBranding } from './features/admin/AdminBranding';
import { AdminSEO } from './features/admin/AdminSEO';
import { AdminSettings } from './features/admin/AdminSettings';
import { AdminMembersPage } from './features/admin/AdminMembersPage';
import { AdminPortfolioProjectsPage } from './features/admin/AdminPortfolioProjectsPage';

// Member Pages
import { MemberDashboard } from './features/member/MemberDashboard';
import { CreateProjectPage } from './features/member/CreateProjectPage';
import { ImageToPdfTool } from './features/pdf-tool/ImageToPdfTool';

function NotFoundPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <PageWrapper>
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
      </PageWrapper>
    </PublicLayout>
  );
}

function PrivacyPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <h1 className="text-3xl font-extrabold text-[var(--text)]">Privacy Policy</h1>
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 text-xs text-[var(--text-muted)] leading-relaxed">
            <p className="whitespace-pre-line">{config.privacy_content}</p>
          </div>
        </div>
      </PageWrapper>
    </PublicLayout>
  );
}

function TermsPage() {
  const { config } = useApp();
  return (
    <PublicLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <h1 className="text-3xl font-extrabold text-[var(--text)]">Terms of Academy Governance</h1>
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 text-xs text-[var(--text-muted)] leading-relaxed">
            <p className="whitespace-pre-line">{config.terms_content}</p>
          </div>
        </div>
      </PageWrapper>
    </PublicLayout>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isPublicRoute =
    !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/member');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={isPublicRoute ? location.pathname : 'portal'}>
        {/* Public Showcase Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route path="/projects" element={<Navigate to="/team" replace />} />
        <Route
          path="/projects/:slug"
          element={
            <PublicLayout>
              <PageWrapper>
                <ProjectDetailPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/team"
          element={
            <PublicLayout>
              <PageWrapper>
                <TeamPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/team/:slug"
          element={
            <PublicLayout>
              <PageWrapper>
                <MemberProfilePage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <PublicLayout>
              <PageWrapper>
                <CategoriesPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
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
              <PageWrapper>
                <MemberLoginPage />
              </PageWrapper>
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
          path="/admin/messages"
          element={<AdminGuard><AdminMessagesPage /></AdminGuard>}
        />
        <Route
          path="/admin/members"
          element={<AdminGuard><AdminMembersPage /></AdminGuard>}
        />
        <Route
          path="/admin/projects"
          element={<AdminGuard><AdminPortfolioProjectsPage /></AdminGuard>}
        />
        <Route path="/admin/projects/published" element={<Navigate to="/admin/projects" replace />} />
        <Route path="/admin/content" element={<Navigate to="/admin/website" replace />} />
        {/* Removed unfinished demo-only admin sections */}
        <Route path="/admin/assignments" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/activity" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/logs" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/files" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/categories" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/tags" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/notifications" element={<Navigate to="/admin/messages" replace />} />
        <Route path="/admin/analytics" element={<Navigate to="/admin" replace />} />

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
    </AnimatePresence>
  );
}

export default function App() {
  useSmoothScroll();
  const [showLoader, setShowLoader] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.sessionStorage.getItem('visited');
  });

  const handleLoaderComplete = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('visited', '1');
    }
    setShowLoader(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollProgressBar />
            <CursorGlow />
            <MagneticCursor />
            <AnimatePresence>
              {showLoader && <PageLoader onComplete={handleLoaderComplete} />}
            </AnimatePresence>
            <Toaster position="bottom-right" />
            <SeoManager />
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </MotionConfig>
  );
}
