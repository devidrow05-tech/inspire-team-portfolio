import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockAssignments } from '../../services/demo/data';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Calendar, Clock } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Assignments Management
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Private tasks assigned to academy members with strict deadlines and progress monitoring.
          </p>
        </div>
        <button
          onClick={() => alert('New assignment modal dialog')}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

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
              {mockAssignments.map((asg) => (
                <tr key={asg.id} className="hover:bg-[var(--surface-2)]/50 transition">
                  <td className="px-5 py-4 font-bold text-[var(--text)]">
                    {asg.title}
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize font-semibold text-[var(--text)]">
                      {asg.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text)]">
                    {asg.members?.[0]?.member_name || 'Assigned Member'}
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">
                    {asg.due_date}
                  </td>
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
                    <button
                      onClick={() => alert(`Managing assignment: ${asg.title}`)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
