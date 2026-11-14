import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  AnimatedButton,
  AnimatedCard,
  RevealSection,
  showAnimatedToast,
} from '../../components/ui/MotionPrimitives';
import { EASINGS, scaleIn } from '../../frontend/lib/animations';
import { Mail, Phone, MapPin, Send, CheckCircle2, PhoneCall, Loader2, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { config, t } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || submitState !== 'idle') return;

    setSubmitState('sending');
    setTimeout(() => {
      setSubmitState('sent');
      confetti({ particleCount: 70, spread: 58, origin: { y: 0.7 } });
      showAnimatedToast('Message dispatched successfully to Inspire Academy!', 'success');

      setTimeout(() => {
        setIsSubmitted(true);
        setSubmitState('idle');
      }, 550);
    }, 550);
  };

  const cleanWhatsapp = (config.whatsapp_number || '+923001234567').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          {config.contact_heading || 'Contact & Admissions Desk'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {config.contact_subheading ||
            'Reach out for corporate project consultations, academic programs, or technical team inquiries.'}
        </p>
      </RevealSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Information & WhatsApp */}
        <div className="space-y-6">
          <AnimatedCard className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
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
                    {config.contact_email || 'admissions@inspireacademy.edu'}
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
                    <div className="text-[var(--text-muted)] mt-0.5">{config.contact_address}</div>
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>

          {config.whatsapp_number && (
            <AnimatedCard className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-6 space-y-3">
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
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow transition hover:-translate-y-0.5"
              >
                <span>{t('action.contactWhatsapp')}</span>
              </a>
            </AnimatedCard>
          )}
        </div>

        {/* Contact Form with Floating Labels & Morphing Submit Button */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          {config.contact_form_enabled === false ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
              <Mail className="w-8 h-8 mx-auto text-slate-400" />
              <p>Online contact form is temporarily disabled by administrative policy.</p>
              <p>Please reach out directly via email at {config.contact_email}.</p>
            </div>
          ) : isSubmitted ? (
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              className="text-center py-12 space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">Message Dispatched Successfully</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Thank you for contacting Inspire Team. Your message has been forwarded to{' '}
                {config.contact_email || 'the admissions committee'}.
              </p>
              <AnimatedButton
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-2 px-3 py-1.5"
              >
                Send Another Message
              </AnimatedButton>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-base font-bold text-[var(--text)] mb-1">
                Send an Official Inquiry
              </h3>

              {/* Floating Label: Full Name */}
              <div className="relative">
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className="peer w-full text-xs px-3.5 pt-5 pb-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <label
                  htmlFor="contact-name"
                  className="pointer-events-none absolute start-3.5 top-3.5 text-xs text-[var(--text-muted)] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  Your Full Name
                </label>
              </div>

              {/* Floating Label: Email */}
              <div className="relative">
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full text-xs px-3.5 pt-5 pb-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <label
                  htmlFor="contact-email"
                  className="pointer-events-none absolute start-3.5 top-3.5 text-xs text-[var(--text-muted)] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  Email Address
                </label>
              </div>

              {/* Floating Label: Subject */}
              <div className="relative">
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder=" "
                  className="peer w-full text-xs px-3.5 pt-5 pb-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <label
                  htmlFor="contact-subject"
                  className="pointer-events-none absolute start-3.5 top-3.5 text-xs text-[var(--text-muted)] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  Subject
                </label>
              </div>

              {/* Floating Label: Message */}
              <div className="relative">
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=" "
                  className="peer w-full text-xs px-3.5 pt-6 pb-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition"
                />
                <label
                  htmlFor="contact-message"
                  className="pointer-events-none absolute start-3.5 top-3.5 text-xs text-[var(--text-muted)] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  Message
                </label>
              </div>

              {/* Morphing Submit Button */}
              <AnimatedButton
                type="submit"
                disabled={submitState !== 'idle'}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                  submitState === 'sent'
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                }`}
              >
                <AnimatePresence mode="wait">
                  {submitState === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={EASINGS.spring}
                      className="inline-flex items-center gap-2"
                    >
                      <Send className="w-4 h-4 rtl:-scale-x-100" />
                      <span>{t('action.sendMessage')}</span>
                    </motion.span>
                  )}
                  {submitState === 'sending' && (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching...</span>
                    </motion.span>
                  )}
                  {submitState === 'sent' && (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Dispatched!</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </AnimatedButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
