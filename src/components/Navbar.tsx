import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { UserRole } from '../types';
import {
  Search,
  Sparkles,
  Wifi,
  WifiOff,
  Zap,
  ShieldAlert,
  UserCheck,
  Headphones,
  Disc3,
  SlidersHorizontal,
  Menu,
  X as CloseIcon,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  openAIGenerator: () => void;
  toggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  userRole,
  setUserRole,
  openAIGenerator,
  toggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const { dataSaverMode, toggleDataSaver, isOffline } = usePlayer();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0b0d]/95 backdrop-blur-xl border-b border-zinc-800/80 px-3 md:px-6 flex items-center justify-between gap-3">
      {/* Mobile Hamburger Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition flex-shrink-0"
        title="Open Navigation Menu"
      >
        {isMobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Search Input Box */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (currentTab !== 'search') setCurrentTab('search');
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'search') setCurrentTab('search');
            }}
            placeholder="Search Gboko Highlife, Afrobeats, Amapiano..."
            className="w-full bg-zinc-900/90 text-sm text-zinc-200 pl-10 pr-4 py-2 rounded-full border border-zinc-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Playlist Trigger */}
        <button
          onClick={openAIGenerator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-semibold shadow-md shadow-amber-500/15 transition transform active:scale-95"
          title="Curate personalized African playlist with Gemini AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Mix</span>
        </button>

        {/* Data Saver Mode Toggle */}
        <button
          onClick={toggleDataSaver}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition ${
            dataSaverMode
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Data Saver transcode optimization (128kbps AAC for African mobile networks)"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Data Saver</span>
          <span className="text-[10px] font-mono px-1 rounded bg-black/40">
            {dataSaverMode ? '128k' : '320k'}
          </span>
        </button>

        {/* Network / Offline indicator */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border ${
            isOffline
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
          title={isOffline ? 'Offline Mode (PWA Cache)' : 'Online Connection Verified'}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="hidden lg:inline">{isOffline ? 'Offline' : 'Gboko Node'}</span>
        </div>

        {/* Role Switcher Pill (Listener / Artist / Admin) */}
        <div className="flex items-center p-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setUserRole('listener')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              userRole === 'listener'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Listener
          </button>
          <button
            onClick={() => {
              setUserRole('artist');
              setCurrentTab('creator');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              userRole === 'artist'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Artist
          </button>
          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentTab('admin');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              userRole === 'admin'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
