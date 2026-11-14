import React, { useCallback, useEffect, useState } from 'react';
import { Mail, MailOpen, RefreshCw, Clock3, UserRound, AtSign, MessageSquare } from 'lucide-react';
import { getContactMessages, markContactMessageRead, type ContactMessageRecord } from '../../lib/supabase';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMessages(await getContactMessages());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  const markRead = async (message: ContactMessageRecord) => {
    if (message.status === 'read') return;
    try {
      await markContactMessageRead(message.id);
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: 'read' } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update message.');
    }
  };

  const unread = messages.filter((message) => message.status === 'new').length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Contact Inbox</h1>
          <p className="mt-1 text-sm text-slate-400">Messages submitted through the public website contact form.</p>
        </div>
        <button type="button" onClick={() => void loadMessages()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">All messages</div>
          <div className="mt-1 text-2xl font-bold text-white">{messages.length}</div>
        </div>
        <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4">
          <div className="text-xs text-amber-300">Unread</div>
          <div className="mt-1 text-2xl font-bold text-white">{unread}</div>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-900 bg-rose-950/30 p-4 text-sm text-rose-300">{error}</div>}
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">Loading messages…</div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-12 text-center">
          <Mail className="mx-auto h-9 w-9 text-slate-500" />
          <h2 className="mt-3 text-base font-bold text-white">No messages yet</h2>
          <p className="mt-1 text-sm text-slate-400">New contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className={`rounded-2xl border bg-slate-900 p-4 sm:p-5 ${message.status === 'new' ? 'border-indigo-500/50' : 'border-slate-800'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{message.subject || 'No subject'}</h2>
                    {message.status === 'new' ? <span className="rounded-full bg-indigo-500/15 px-2 py-1 text-[10px] font-bold text-indigo-300">NEW</span> : <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">READ</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{message.name}</span>
                    <a className="inline-flex items-center gap-1.5 hover:text-indigo-300" href={`mailto:${message.email}`}><AtSign className="h-3.5 w-3.5" />{message.email}</a>
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{new Date(message.created_at).toLocaleString()}</span>
                  </div>
                </div>
                {message.status === 'new' && (
                  <button type="button" onClick={() => void markRead(message)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
                    <MailOpen className="h-4 w-4" /> Mark as read
                  </button>
                )}
              </div>
              <div className="mt-4 flex gap-2 border-t border-slate-800 pt-4">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">{message.message}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">Reply by email</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
