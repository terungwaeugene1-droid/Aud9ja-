import React from 'react';
import {
  Compass,
  Search,
  Library,
  Heart,
  HardDriveDownload,
  UploadCloud,
  ShieldCheck,
  Database,
  Radio,
  MapPin,
  Sparkles,
  Music,
  Mail,
} from 'lucide-react';
import { UserRole, AUD9JA_OFFICIAL_CONTACTS } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  openAIGenerator: () => void;
  openSchemaModal: () => void;
  likedCount: number;
  cachedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  openAIGenerator,
  openSchemaModal,
  likedCount,
  cachedCount,
}) => {
  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search & Browse', icon: Search },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'liked', label: 'Liked Songs', icon: Heart, badge: likedCount > 0 ? likedCount : undefined },
    { id: 'offline', label: 'Offline Music', icon: HardDriveDownload, badge: cachedCount > 0 ? cachedCount : undefined },
  ];

  return (
    <aside className="w-64 bg-[#0a0b0d] border-r border-zinc-800/80 flex flex-col justify-between p-4 flex-shrink-0 select-none">
      <div>
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('discover')}
          className="flex items-center gap-3 px-2 py-3 mb-6 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition transform">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">AUD9ja</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 tracking-wider">Gboko • Lagos • Diaspora</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Explore Music
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Creator & Management */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Creator & Legal
          </p>

          <button
            onClick={() => setCurrentTab('creator')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'creator'
                ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Creator Studio</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'admin'
                ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin & DMCA</span>
          </button>

          <button
            onClick={() => setCurrentTab('contact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'contact'
                ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Contact & Support</span>
          </button>

          <button
            onClick={openSchemaModal}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase SQL</span>
          </button>
        </div>

        {/* AI Quick Banner */}
        <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Afro-Curator</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug mb-3">
            Build custom Benue Groove & Amapiano playlists with Gemini.
          </p>
          <button
            onClick={openAIGenerator}
            className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition"
          >
            Create AI Mix
          </button>
        </div>
      </div>

      {/* Footer / Origin Badge */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-1">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate">Gboko, Benue State, NG</span>
        </div>
        <div className="text-[10px] text-zinc-400">
          <a
            href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
            className="text-amber-400/90 hover:text-amber-300 font-mono hover:underline flex items-center gap-1"
          >
            <Mail className="w-3 h-3 text-amber-500" />
            <span>{AUD9JA_OFFICIAL_CONTACTS.officialEmail}</span>
          </a>
        </div>
        <p className="text-[9px] text-zinc-400">Ema Records Legal Intake</p>
      </div>
    </aside>
  );
};
