import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface AuditItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  ip: string;
}

const INITIAL_LOGS: AuditItem[] = [];

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditItem[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportLogsAsCSV = () => {
    const headers = 'ID,Timestamp,Actor,Role,Action,Target,Status,IP\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.status}","${l.ip}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspire-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Immutable System Audit Logs
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chronological trace of administrative actions, project lifecycle events, and security access.
          </p>
        </div>

        <button
          onClick={exportLogsAsCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export Logs CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, or target..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success Only</option>
          <option value="WARNING">Warnings</option>
          <option value="ERROR">Errors</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-semibold">
                    {log.actor}
                    <span className="block text-[10px] text-slate-500 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 text-indigo-300 font-semibold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {log.target}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">
                    {log.ip}
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
