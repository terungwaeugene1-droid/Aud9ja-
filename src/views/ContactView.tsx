import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Music2,
  Scale,
  Headphones,
  MapPin,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { AUD9JA_OFFICIAL_CONTACTS } from '../types';

interface ContactViewProps {
  onBackToDiscover?: () => void;
  onOpenLegalModal?: (docType: 'terms' | 'privacy' | 'copyright' | 'community' | 'about') => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onBackToDiscover,
  onOpenLegalModal,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    message: string;
    notificationStatus: string;
    timestamp: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const subjectOptions = [
    'General Inquiry',
    'Creator & Artist Support',
    'Legal Matters & Compliance',
    'Copyright Concern / DMCA Notice',
    'Music Distribution & Licensing',
    'Technical / Audio Stream Bug',
    'Other / Custom Subject',
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(AUD9JA_OFFICIAL_CONTACTS.officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const finalSubject = subject === 'Other / Custom Subject' ? customSubject.trim() : subject;
    const cleanMessage = message.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please provide your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please provide a valid email address so we can reply.');
      return;
    }

    if (!finalSubject || finalSubject.length < 3) {
      setErrorMessage('Please specify a subject for your message.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMessage('Please enter a detailed message (at least 10 characters).');
      return;
    }

    if (cleanMessage.length > 5000) {
      setErrorMessage('Message exceeds the maximum limit of 5,000 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: finalSubject,
          message: cleanMessage,
          bot_honeypot: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit contact message.');
      }

      setSuccessData({
        id: data.id,
        message: data.message,
        notificationStatus: data.notificationStatus,
        timestamp: data.timestamp,
      });

      // Reset form
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setCustomSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Official Communications Desk</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact AUD9ja
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          For general inquiries, creator support, legal matters, copyright concerns, and platform-related
          questions:
        </p>

        {/* Primary Contact Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12141a] via-[#101217] to-[#0a0b0d] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
                Official Platform & Legal Email
              </span>
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
                className="text-base sm:text-lg font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline transition"
              >
                {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Mail Client</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition"
              title="Copy email to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown Cards for Inquiries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1116] border border-obsidian-border space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Headphones className="w-4 h-4" />
            <span>General Inquiries</span>
          </div>
          <p className="text-xs text-zinc-400">Listener questions, mobile offline cache, and account support.</p>
          <a
            href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.supportEmail}?subject=General%20Inquiry`}
            className="text-[11px] font-mono text-amber-400 hover:underline block pt-1"
          >
            {AUD9JA_OFFICIAL_CONTACTS.supportEmail}
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1116] border border-obsidian-border space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Music2 className="w-4 h-4" />
            <span>Creator Support</span>
          </div>
          <p className="text-xs text-zinc-400">Artist onboarding, master audio uploads, and Benue Groove curation.</p>
          <a
            href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.creatorEmail}?subject=Creator%20Support`}
            className="text-[11px] font-mono text-amber-400 hover:underline block pt-1"
          >
            {AUD9JA_OFFICIAL_CONTACTS.creatorEmail}
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1116] border border-obsidian-border space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Scale className="w-4 h-4" />
            <span>Legal Matters</span>
          </div>
          <p className="text-xs text-zinc-400">Contracts, compliance regulations, terms of service, and privacy.</p>
          <a
            href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.legalEmail}?subject=Legal%20Inquiry`}
            className="text-[11px] font-mono text-amber-400 hover:underline block pt-1"
          >
            {AUD9JA_OFFICIAL_CONTACTS.legalEmail}
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1116] border border-obsidian-border space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Copyright & DMCA</span>
          </div>
          <p className="text-xs text-zinc-400">Official copyright complaints, takedown notices, and licensing.</p>
          <a
            href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.copyrightEmail}?subject=DMCA%20Notice`}
            className="text-[11px] font-mono text-amber-400 hover:underline block pt-1"
          >
            {AUD9JA_OFFICIAL_CONTACTS.copyrightEmail}
          </a>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0c0d12] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Send Direct Platform Message</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                All submissions are securely logged and dispatched to {AUD9JA_OFFICIAL_CONTACTS.adminNotificationEmail}.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
              Secure SSL
            </span>
          </div>

          {/* Success Banner */}
          {successData && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Message Received & Recorded</span>
              </div>
              <p className="text-xs leading-relaxed">{successData.message}</p>
              <div className="text-[11px] font-mono text-emerald-400/80 pt-1 border-t border-emerald-500/20 flex flex-wrap gap-4">
                <span>Intake ID: {successData.id}</span>
                <span>Notification Status: {successData.notificationStatus}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for bot detection (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label>Leave this empty</label>
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Terungwa Eugene"
                  className="w-full bg-[#121419] border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder:text-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Email Address <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. artist@example.com"
                  className="w-full bg-[#121419] border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Subject / Inquiry Category <span className="text-amber-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#121419] border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
              >
                {subjectOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#121419] text-zinc-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {subject === 'Other / Custom Subject' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Custom Subject Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Specify subject..."
                  className="w-full bg-[#121419] border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            )}

            {/* Message Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-300">
                  Message <span className="text-amber-500">*</span>
                </label>
                <span className="text-zinc-400">{message.length} / 5,000</span>
              </div>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your inquiry, feedback, or legal complaint in detail..."
                className="w-full bg-[#121419] border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder:text-zinc-400 resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <p className="text-[11px] text-zinc-400 max-w-sm">
                Protected by AUD9ja Anti-Spam & Rate Limiting. Form inputs are sanitized.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-bold transition shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Compliance */}
        <div className="space-y-6">
          {/* Physical Intake Office */}
          <div className="p-6 rounded-2xl bg-[#0f1116] border border-obsidian-border space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Physical Intake Office</span>
            </h3>

            <div className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-zinc-200">Ema Records Legal & Copyright Intake</p>
              <p>Gboko, Benue State, Nigeria</p>
              <p className="text-[11px] text-zinc-400">Serving Nigeria, West Africa & the Global Diaspora</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Office Hours: 08:00 - 18:00 WAT (Mon-Fri)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <a
                  href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
                  className="font-mono text-amber-400 hover:underline"
                >
                  {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Legal Links */}
          <div className="p-6 rounded-2xl bg-[#0f1116] border border-obsidian-border space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span>Legal Disclosures</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Review our policies regarding copyright protection, artist royalties, and privacy:
            </p>
            <div className="space-y-2 text-xs pt-1">
              {onOpenLegalModal && (
                <>
                  <button
                    onClick={() => onOpenLegalModal('copyright')}
                    className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800"
                  >
                    <span>DMCA Takedown Guidelines</span>
                    <span className="text-[10px] text-zinc-400">Read &rarr;</span>
                  </button>
                  <button
                    onClick={() => onOpenLegalModal('terms')}
                    className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800"
                  >
                    <span>Terms of Service</span>
                    <span className="text-[10px] text-zinc-400">Read &rarr;</span>
                  </button>
                  <button
                    onClick={() => onOpenLegalModal('privacy')}
                    className="w-full text-left text-zinc-300 hover:text-amber-400 transition flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800"
                  >
                    <span>Privacy Policy</span>
                    <span className="text-[10px] text-zinc-400">Read &rarr;</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
