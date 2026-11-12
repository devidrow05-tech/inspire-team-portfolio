import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockMemberProfiles, mockUsers } from '../../services/demo/data';
import { Users, UserPlus, Key, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState(mockMemberProfiles);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [tempPasswordGenerated, setTempPasswordGenerated] = useState<string | null>(null);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    // Server-side temp password pattern per PRD AUTH-003
    const tempPass = `Temp${Math.random().toString(36).slice(-6)}!9`;
    setTempPasswordGenerated(tempPass);

    const newSlug = newFullName.toLowerCase().replace(/\s+/g, '-');
    setMembers((prev) => [
      ...prev,
      {
        id: `mp-${Date.now()}`,
        profile_id: `usr-${Date.now()}`,
        slug: newSlug,
        display_name: newFullName,
        title: newTitle || 'Digital Engineer',
        skills: ['Web', 'Design'],
        specializations: ['Full-Stack'],
        is_published: false,
        sort_order: prev.length + 1,
        other_links: [],
        contact_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Team Members Directory
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Invite-only member governance. Admin provisions accounts with one-time temporary passwords.
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewModal(true);
            setTempPasswordGenerated(null);
          }}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Member</span>
        </button>
      </div>

      {/* Member Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] border-b border-[var(--border)] uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-start">Member Name</th>
                <th className="px-5 py-3.5 text-start">Slug</th>
                <th className="px-5 py-3.5 text-start">Specialist Role</th>
                <th className="px-5 py-3.5 text-start">Public Profile Status</th>
                <th className="px-5 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--surface-2)]/50 transition">
                  <td className="px-5 py-4 font-bold text-[var(--text)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs">
                        {m.display_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{m.display_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[var(--text-muted)]">
                    /team/{m.slug}
                  </td>
                  <td className="px-5 py-4 text-[var(--text)]">
                    {m.title}
                  </td>
                  <td className="px-5 py-4">
                    {m.is_published ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Published
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">
                        Unpublished
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-end">
                    <button
                      onClick={() =>
                        alert(`Generated new temporary password for ${m.display_name}: Pass${Math.random().toString(36).slice(-5)}!`)
                      }
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Member Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowNewModal(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-2xl z-10">
            <h3 className="text-base font-bold text-[var(--text)]">
              Provision New Academy Member
            </h3>

            {tempPasswordGenerated ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">
                    Account Created! Share Temporary Credentials:
                  </div>
                  <div className="font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 select-all">
                    {tempPasswordGenerated}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Warning: This password is shown once. The member will be required to change it on first login.
                  </div>
                </div>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateMember} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Zainab Qureshi"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@inspireacademy.edu"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Specialist Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lead WordPress Engineer"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Generate Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
