import React from 'react';
import {
  Mail,
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Users,
  Radio,
  MapPin,
  ExternalLink,
  UploadCloud,
  ChevronRight,
} from 'lucide-react';
import { AUD9JA_OFFICIAL_CONTACTS } from '../types';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenLegalModal: (docType: 'terms' | 'privacy' | 'copyright' | 'community' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenLegalModal }) => {
  return (
    <footer className="mt-16 pt-12 pb-24 border-t border-obsidian-border bg-[#07080a] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigateTab('discover')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition transform">
                <Radio className="w-4 h-4 text-black" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">AUD9ja</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  OFFICIAL
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Stream, discover, and upload premier Afrobeat, Amapiano, and global African music.
              Bridging Gboko, Lagos, and the worldwide African diaspora through high-fidelity,
              data-optimized sound.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-zinc-300 font-medium">Headquarters & Intake:</span>
              <span className="text-zinc-400">{AUD9JA_OFFICIAL_CONTACTS.intakeOffice}</span>
            </div>
          </div>

          {/* Official Contact & Legal Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact & Legal</span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              For general inquiries, creator support, legal matters, and copyright notices:
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-semibold transition group shadow-sm"
                title="Send email to AUD9ja Legal & Support"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="font-mono">{AUD9JA_OFFICIAL_CONTACTS.officialEmail}</span>
              </a>
            </div>
            <ul className="space-y-2 pt-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('contact')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>Interactive Contact Page</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>Admin & DMCA Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Legal Policies</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3 h-3 text-zinc-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('copyright')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="w-3 h-3 text-zinc-400" />
                  <span>Copyright & DMCA Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('community')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <Users className="w-3 h-3 text-zinc-400" />
                  <span>Community Guidelines</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Creators & Info</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegalModal('about')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>About AUD9ja</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('creator')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>Creator Studio & Uploads</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('discover')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>Discover African Catalog</span>
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.creatorEmail}?subject=Artist%20Verification%20Inquiry`}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span>Artist Verification Desk</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © 2026 AUD9ja Streaming Services Ltd. All rights reserved. Ema Records Compliance • Gboko, Benue State, Nigeria.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
              className="hover:text-amber-400 transition"
            >
              Contact: {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
            </a>
            <span className="text-zinc-800">•</span>
            <span className="text-zinc-400">Node NG-BENUE-01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
