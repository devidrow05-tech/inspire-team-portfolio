import React, { useState } from 'react';
import { mockAssignments } from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AnimatedButton,
  AnimatedModal,
  RevealSection,
  showAnimatedToast,
} from '../../components/ui/MotionPrimitives';
import { PlusCircle } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAssignments((prev) => [
      {
        id: `asg-${Date.now()}`,
        title,
        description: 'Faculty assigned deliverable',
        priority,
        status: 'assigned',
        due_date: dueDate || new Date().toISOString().slice(0, 10),
        progress: 0,
        reference_links: [],
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTitle('');
    setDueDate('');
    setShowCreateModal(false);
    showAnimatedToast('New assignment dispatched!', 'success');
  };

  return (
    <div className="space-y-6">
      <RevealSection className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Assignments Management
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Private tasks assigned to academy members with strict deadlines and progress monitoring.
          </p>
        </div>
        <AnimatedButton
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Assignment</span>
        </AnimatedButton>
      </RevealSection>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] border-b border-[var(--border)] uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-start">Task Title</th>
                <th className="px-5 py-3.5 text-start">Priority</th>
                <th className="px-5 py-3.5 text-start">Assigned Member</th>
                <th className="px-5 py-3.5 text-start">Due Date</th>
                <th className="px-5 py-3.5 text-start">Progress</th>
                <th className="px-5 py-3.5 text-start">Status</th>
                <th className="px-5 py-3.5 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-[var(--text-muted)]">
                    No assignments created yet.
                  </td>
                </tr>
              )}
              {assignments.map((asg) => (
                <tr key={asg.id} className="hover:bg-[var(--surface-2)]/50 transition">
                  <td className="px-5 py-4 font-bold text-[var(--text)]">{asg.title}</td>
                  <td className="px-5 py-4">
                    <span className="capitalize font-semibold text-[var(--text)]">
                      {asg.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text)]">
                    {asg.members?.[0]?.member_name || 'Assigned Member'}
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">{asg.due_date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${asg.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold">{asg.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={asg.status} />
                  </td>
                  <td className="px-5 py-4 text-end">
                    <AnimatedButton
                      type="button"
                      onClick={() => showAnimatedToast(`Opened management controls for ${asg.title}`, 'info')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Manage
                    </AnimatedButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatedModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Responsive Landing Page Build"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text)]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <AnimatedButton
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="w-1/2 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Dispatch Assignment
            </AnimatedButton>
          </div>
        </form>
      </AnimatedModal>
    </div>
  );
};
