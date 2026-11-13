import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  mockPublishedProjects,
  mockWorkingProjects,
  mockUsers,
  mockAssignments,
} from '../../services/demo/data';
import {
  Settings,
  Save,
  CheckCircle2,
  Download,
  ShieldAlert,
  Clock,
  Mail,
  FileText,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [saveToast, setSaveToast] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  // Settings states matching SiteConfig
  const [maintenanceMode, setMaintenanceMode] = useState(config.maintenance_mode || false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    config.maintenance_message || 'Inspire Academy portal is undergoing scheduled maintenance. Please check back shortly.'
  );
  const [submissionEmail, setSubmissionEmail] = useState(config.contact_submission_email || '');
  const [privacyContent, setPrivacyContent] = useState(
    config.privacy_content ||
      'We respect data privacy. Private assignments and non-public drafts are strictly protected within authenticated administrative boundaries.'
  );
  const [termsContent, setTermsContent] = useState(
    config.terms_content ||
      'All deliverables published through the Inspire Academy portal undergo academic peer review. Members retain authorship rights while granting the institution showcase licensing.'
  );
  const [custom404Heading, setCustom404Heading] = useState(config.custom_404_heading || '404 - Academic Resource Not Found');
  const [custom404Message, setCustom404Message] = useState(
    config.custom_404_message || 'The specified project, member profile, or document could not be located in our verified directory.'
  );

  const handleSave = () => {
    updateConfig({
      maintenance_mode: maintenanceMode,
      maintenance_message: maintenanceMessage,
      contact_submission_email: submissionEmail,
      privacy_content: privacyContent,
      terms_content: termsContent,
      custom_404_heading: custom404Heading,
      custom_404_message: custom404Message,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleExportDatabase = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      system: 'Inspire Academy Master Control',
      config,
      users: mockUsers,
      working_projects: mockWorkingProjects,
      published_projects: mockPublishedProjects,
      assignments: mockAssignments,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspire-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Website & System Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Emergency maintenance mode, legal terms, custom 404 handler, and full database snapshots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportDatabase}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Database JSON</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>System settings updated!</span>
        </div>
      )}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce">
          <Download className="w-5 h-5" />
          <span>Database JSON snapshot downloaded successfully!</span>
        </div>
      )}

      {/* Section 1: Maintenance Mode */}
      <div className={`p-6 rounded-2xl border transition-all ${maintenanceMode ? 'bg-amber-950/20 border-amber-600/50' : 'bg-slate-900 border-slate-800'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${maintenanceMode ? 'text-amber-400' : 'text-slate-400'}`} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Maintenance Mode
              </h2>
              {maintenanceMode && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              When enabled, visitors to the public website see an under-maintenance screen. The hidden admin panel (<code className="text-indigo-400 font-mono">/admin</code>) remains accessible to administrators.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {maintenanceMode && (
          <div className="mt-5 pt-4 border-t border-amber-800/40 space-y-2">
            <label className="block text-xs font-semibold text-amber-300">
              Visitor Maintenance Message
            </label>
            <textarea
              rows={2}
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-800/60 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Section 2: Contact Form Destination */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Notification & Destination Email
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contact Submissions Recipient Email</span>
          </label>
          <input
            type="email"
            value={submissionEmail}
            onChange={(e) => setSubmissionEmail(e.target.value)}
            className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Inquiries submitted via the public contact form will be routed to this address.
          </p>
        </div>
      </div>

      {/* Section 3: Legal & Policy Statements */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Legal Terms & Privacy Statements
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Privacy Policy Statement (Public /privacy page)
            </label>
            <textarea
              rows={3}
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Terms of Academy Governance (Public /terms page)
            </label>
            <textarea
              rows={3}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Section 4: 404 Page Customization */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Custom 404 Not Found Page
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              404 Page Heading
            </label>
            <input
              type="text"
              value={custom404Heading}
              onChange={(e) => setCustom404Heading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              404 Explanation Message
            </label>
            <input
              type="text"
              value={custom404Message}
              onChange={(e) => setCustom404Message(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
