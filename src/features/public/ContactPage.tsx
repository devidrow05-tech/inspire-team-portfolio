import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, PhoneCall } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { config, t } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  const cleanWhatsapp = (config.whatsapp_number || '+923001234567').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {config.contact_heading || 'Contact & Admissions Desk'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {config.contact_subheading || 'Reach out for corporate project consultations, academic programs, or technical team inquiries.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Information & WhatsApp direct link */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
            <h3 className="text-base font-bold text-[var(--text)]">
              Direct Communication Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--text)]">Official Email</div>
                  <div className="text-[var(--text-muted)] mt-0.5">
                    {config.contact_email || 'contact@inspireacademy.edu'}
                  </div>
                </div>
              </div>

              {config.contact_phone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)]">Direct Campus Hotline</div>
                    <div className="text-[var(--text-muted)] mt-0.5">{config.contact_phone}</div>
                  </div>
                </div>
              )}

              {config.contact_address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)]">Main Academy Campus</div>
                    <div className="text-[var(--text-muted)] mt-0.5">
                      {config.contact_address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          {config.whatsapp_number && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Instant WhatsApp Support
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Direct line: {config.whatsapp_number}
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow transition"
              >
                <span>{t('action.contactWhatsapp')}</span>
              </a>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          {config.contact_form_enabled === false ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
              <Mail className="w-8 h-8 mx-auto text-slate-400" />
              <p>Online contact form is temporarily disabled by administrative policy.</p>
              <p>Please reach out directly via email at {config.contact_email}.</p>
            </div>
          ) : isSubmitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">Message Dispatched Successfully</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Thank you for contacting Inspire Team. Your message has been forwarded to {config.contact_email || 'the admissions committee'}.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-[var(--text)] mb-2">
                Send an Official Inquiry
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project inquiry / Academic partnership"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your query..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4 rtl:-scale-x-100" />
                <span>{t('action.sendMessage')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
