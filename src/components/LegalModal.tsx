import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  FileText,
  Lock,
  Users,
  Info,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { AUD9JA_OFFICIAL_CONTACTS } from '../types';

export type LegalDocType = 'terms' | 'privacy' | 'copyright' | 'community' | 'about';

interface LegalModalProps {
  isOpen: boolean;
  docType: LegalDocType;
  onClose: () => void;
  onNavigateContact?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  docType,
  onClose,
  onNavigateContact,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(AUD9JA_OFFICIAL_CONTACTS.officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDocDetails = () => {
    switch (docType) {
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          lastUpdated: 'March 2026',
          content: (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                Welcome to <strong>AUD9ja</strong> (&ldquo;the Platform&rdquo;), the African premier music streaming
                service owned and operated by AUD9ja Streaming Services Ltd. in conjunction with Ema Records Compliance,
                headquartered in Gboko, Benue State, Nigeria.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">1. Acceptance of Terms</h4>
              <p>
                By accessing or using AUD9ja through our web application, progressive web application (PWA), or APIs,
                you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Platform.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">2. Creator Rights & Master Audio Uploads</h4>
              <p>
                Creators and artists retain copyright over their original master recordings. By uploading content to AUD9ja,
                creators grant AUD9ja a non-exclusive, worldwide, royalty-bearing license to stream, transcode (including data-saver
                AAC encoding for mobile African bandwidth optimization), and distribute content across authorized digital listeners.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">3. Prohibited Content & DMCA</h4>
              <p>
                Users and creators shall not upload copyright-infringing tracks, unauthorized bootlegs, bootleg DJ blends without
                cleared rights, or defamatory material. Repeat infringers will have their accounts terminated under our DMCA policy.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">4. Official Legal Notice & Contacts</h4>
              <p>
                All legal notices, regulatory inquiries, dispute summons, and compliance documents must be submitted to our
                designated legal team:
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Official AUD9ja Legal Email:</span>
                  <a
                    href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.legalEmail}`}
                    className="font-mono text-amber-400 hover:underline font-bold text-xs"
                  >
                    {AUD9JA_OFFICIAL_CONTACTS.legalEmail}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ),
        };

      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: Lock,
          lastUpdated: 'March 2026',
          content: (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                AUD9ja is dedicated to protecting listener and creator privacy in compliance with the Nigeria Data Protection Act (NDPA)
                and international privacy standards.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">1. Information We Collect</h4>
              <p>
                We collect listening metrics (play counts, skip rates, regional origin for music charts like Benue Groove vs Lagos Mainstream),
                account profile details, and cached audio data stored locally on your device for offline playback.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">2. Offline Music Storage & Local Cache</h4>
              <p>
                Audio downloaded via our Data-Saver and Offline mode is stored inside your browser&rsquo;s sandboxed Cache API storage.
                We do not access or index other personal files on your device.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">3. Data Protection Officer & Inquiries</h4>
              <p>
                To request data deletion, profile export, or inquire about how your data is handled:
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Privacy & Data Governance Officer:</span>
                  <a
                    href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.supportEmail}?subject=Privacy%20Inquiry`}
                    className="font-mono text-amber-400 hover:underline font-bold text-xs"
                  >
                    {AUD9JA_OFFICIAL_CONTACTS.supportEmail}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ),
        };

      case 'copyright':
        return {
          title: 'Copyright & DMCA Takedown Policy',
          icon: ShieldCheck,
          lastUpdated: 'March 2026',
          content: (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                AUD9ja respects the intellectual property rights of recording artists, songwriters, producers, and record labels.
                We adhere to the Digital Millennium Copyright Act (17 U.S.C. § 512) and the Nigerian Copyright Act.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">1. Filing a Notice of Infringement</h4>
              <p>
                If you believe your copyrighted sound recording or musical composition is being distributed without authorization
                on AUD9ja, you must notify our designated DMCA Agent with:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Identification of the copyrighted work claimed to have been infringed (ISRC code, audio title, artist name).</li>
                <li>The specific URL or track identifier on AUD9ja where the infringing material is located.</li>
                <li>Your contact information (name, address, telephone number, and legal email address).</li>
                <li>A statement of good faith belief that the disputed use is not authorized by the copyright owner.</li>
                <li>A physical or electronic signature of the authorized copyright owner or agent.</li>
              </ul>

              <h4 className="font-bold text-white text-sm pt-2">2. Designated Copyright Intake Officer</h4>
              <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-semibold">Official Copyright & DMCA Email:</span>
                    <a
                      href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.copyrightEmail}?subject=DMCA%20Notice%20of%20Copyright%20Infringement`}
                      className="font-mono text-amber-400 hover:underline font-bold text-sm"
                    >
                      {AUD9JA_OFFICIAL_CONTACTS.copyrightEmail}
                    </a>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                  <strong>Physical Intake Office:</strong> {AUD9JA_OFFICIAL_CONTACTS.intakeOffice}
                </div>
              </div>
            </div>
          ),
        };

      case 'community':
        return {
          title: 'Community Guidelines',
          icon: Users,
          lastUpdated: 'March 2026',
          content: (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                AUD9ja is built to celebrate African music diversity — from the log drums of Amapiano to the brass
                and talking drums of Tiv Highlife and Benue Groove.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">1. Respect African Heritage & Creators</h4>
              <p>
                Give credit to traditional composers, featured vocalists, and regional origins. Do not upload misleading metadata
                or impersonate verified Nigerian or African creators.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">2. Zero Tolerance for Hate & Abuse</h4>
              <p>
                We do not tolerate tribal discrimination, hate speech, threats of violence, or predatory behavior.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">3. Reporting Violations</h4>
              <p>
                To report harassment, abusive comments, or policy violations, please email our moderation desk:
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Community Trust & Safety Desk:</span>
                  <a
                    href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.supportEmail}?subject=Community%20Report`}
                    className="font-mono text-amber-400 hover:underline font-bold text-xs"
                  >
                    {AUD9JA_OFFICIAL_CONTACTS.supportEmail}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ),
        };

      case 'about':
      default:
        return {
          title: 'About AUD9ja',
          icon: Info,
          lastUpdated: '2026 Edition',
          content: (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong>AUD9ja</strong> is Nigeria&rsquo;s premier independent music streaming ecosystem, born out of Gboko,
                Benue State, Nigeria, and scaled for African music lovers across Lagos, Abuja, London, Johannesburg, and worldwide.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">Our Mission</h4>
              <p>
                We empower African creators with direct listener access, transparent monetization, intelligent AI-assisted tagging,
                and mobile-optimized data-saving playback designed specifically for African mobile network realities.
              </p>

              <h4 className="font-bold text-white text-sm pt-2">Corporate & Compliance Information</h4>
              <p>
                Operations are conducted under the regulatory framework of the Federal Republic of Nigeria in compliance
                with Ema Records standard music distribution policies.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-semibold">Official Executive & Legal Contact:</span>
                    <a
                      href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
                      className="font-mono text-amber-400 hover:underline font-bold text-xs"
                    >
                      {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
                    </a>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                  <strong>Intake Headquarters:</strong> {AUD9JA_OFFICIAL_CONTACTS.intakeOffice}
                </div>
              </div>
            </div>
          ),
        };
    }
  };

  const details = getDocDetails();
  const Icon = details.icon;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] bg-[#0c0d11] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-obsidian-border bg-obsidian-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{details.title}</h3>
              <p className="text-[11px] text-zinc-400">AUD9ja Official Compliance • {details.lastUpdated}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {details.content}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-obsidian-border bg-[#0a0b0e] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <a
              href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
              className="text-amber-400 hover:underline font-mono"
            >
              {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateContact && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateContact();
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-amber-500/40 text-xs font-semibold transition"
              >
                Open Contact Form
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
