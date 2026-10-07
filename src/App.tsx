import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import {
  INITIAL_SONGS,
  INITIAL_ARTISTS,
  INITIAL_PLAYLISTS,
  INITIAL_GENRES,
  INITIAL_ALBUMS,
  INITIAL_DMCA_REPORTS,
  INITIAL_VERIFICATIONS,
} from './data/mockMusic';
import {
  Song,
  Artist,
  Playlist,
  GenreCategory,
  DMCAReport,
  ArtistVerificationRequest,
  UserRole,
} from './types';
import { fetchSongs } from './services/supabaseSongs';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PlayerDock } from './components/PlayerDock';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { QueueDrawer } from './components/QueueDrawer';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { DatabaseSchemaModal } from './components/DatabaseSchemaModal';

// Views
import { DiscoverView } from './views/DiscoverView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { CreatorStudioView } from './views/CreatorStudioView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { ContactView } from './views/ContactView';
import { Footer } from './components/Footer';
import { LegalModal, LegalDocType } from './components/LegalModal';

const SONGS_STORAGE_KEY = 'aud9ja_catalog_songs_v2';
const PLAYLISTS_STORAGE_KEY = 'aud9ja_playlists_v2';
const DMCA_STORAGE_KEY = 'aud9ja_dmca_reports_v2';
const VERIFICATIONS_STORAGE_KEY = 'aud9ja_verifications_v2';

function MainLayout() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('listener');

  // Selected Entities for Detail Views
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Modals & Mobile Drawer
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('terms');

  const handleOpenLegalModal = (docType: LegalDocType) => {
    setLegalDocType(docType);
    setIsLegalModalOpen(true);
  };

  // Persistent Domain States with LocalStorage fallback
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const stored = localStorage.getItem(SONGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  const [dmcaReports, setDmcaReports] = useState<DMCAReport[]>(() => {
    try {
      const stored = localStorage.getItem(DMCA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DMCA_REPORTS;
    } catch {
      return INITIAL_DMCA_REPORTS;
    }
  });

  const [verifications, setVerifications] = useState<ArtistVerificationRequest[]>(() => {
    try {
      const stored = localStorage.getItem(VERIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_VERIFICATIONS;
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  });

  const { likedSongIds, cachedSongIds, playTrack } = usePlayer();

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(DMCA_STORAGE_KEY, JSON.stringify(dmcaReports));
  }, [dmcaReports]);

  useEffect(() => {
    localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(verifications));
  }, [verifications]);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('AUD9ja Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service Worker registration skipped:', err));
    }

    // Attempt Supabase fetch on app startup
    fetchSongs()
      .then((remoteSongs) => {
        if (remoteSongs && remoteSongs.length > 0) {
          setSongs(remoteSongs);
        }
      })
      .catch((err) => {
        console.warn('Using local song catalog fallback:', err);
      });
  }, []);

  // Handlers
  const handleUploadSong = (newSong: Song) => {
    setSongs((prev) => [newSong, ...prev]);

    // Dispatch background administrative notification to aud9ja.legal@gmail.com
    fetch('/api/admin/notify-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'song_upload',
        title: `New Song Upload: "${newSong.title}"`,
        details: `Track: ${newSong.title}\nArtist: ${newSong.artist}\nGenre: ${newSong.genre}\nRegion: ${newSong.region_origin}\nISRC: ${newSong.isrc_code || 'Generated'}`,
        metadata: { songId: newSong.id, artist: newSong.artist, title: newSong.title },
      }),
    }).catch((err) => console.warn('Admin notification queued:', err));
  };

  const handleCreatePlaylist = (title: string, description: string) => {
    const newPl: Playlist = {
      id: `pl-user-${Date.now()}`,
      user_id: 'user-current',
      title,
      description,
      cover_url:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      is_public: true,
      song_ids: ['song-1', 'song-2'],
      created_at: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [newPl, ...prev]);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRenamePlaylist = (id: string, newTitle: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p))
    );
  };

  const handlePlaylistCreatedByAI = (newPl: Playlist) => {
    setPlaylists((prev) => [newPl, ...prev]);
  };

  const handleUpdateDMCAStatus = (reportId: string, status: DMCAReport['status']) => {
    setDmcaReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  const handleUpdateVerificationStatus = (
    reqId: string,
    status: 'approved' | 'rejected'
  ) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === reqId ? { ...v, status } : v))
    );
  };

  const handleSubmitDMCAReport = (report: DMCAReport) => {
    setDmcaReports((prev) => [report, ...prev]);

    // Dispatch background administrative notification to aud9ja.legal@gmail.com
    fetch('/api/admin/notify-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'copyright_complaint',
        title: `DMCA Dispute Notice for "${report.song_title}"`,
        details: `Claimant: ${report.claimant_name} (${report.claimant_email})\nSong: ${report.song_title} by ${report.artist_name}\nIntake Office: ${report.intake_office}\nInfringing URL: ${report.infringing_url || 'N/A'}\nStatement: ${report.notes || 'None'}`,
        metadata: { reportId: report.id, claimant: report.claimant_name, songId: report.song_id },
      }),
    }).catch((err) => console.warn('Admin notification queued:', err));
  };

  const handleSelectGenre = (genre: GenreCategory) => {
    setSearchQuery(genre.name.split(' ')[0]);
    setCurrentTab('search');
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setCurrentTab('artist-detail');
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentTab('playlist-detail');
  };

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-zinc-100 overflow-hidden font-sans">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          userRole={userRole}
          openAIGenerator={() => setIsAIGeneratorOpen(true)}
          openSchemaModal={() => setIsSchemaModalOpen(true)}
          likedCount={likedSongIds.size}
          cachedCount={cachedSongIds.size}
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-72 bg-[#0a0b0d] h-full shadow-2xl border-r border-zinc-800 animate-in slide-in-from-left duration-300"
          >
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              userRole={userRole}
              openAIGenerator={() => {
                setIsMobileMenuOpen(false);
                setIsAIGeneratorOpen(true);
              }}
              openSchemaModal={() => {
                setIsMobileMenuOpen(false);
                setIsSchemaModalOpen(true);
              }}
              likedCount={likedSongIds.size}
              cachedCount={cachedSongIds.size}
            />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
          openAIGenerator={() => setIsAIGeneratorOpen(true)}
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full scrollbar-thin scrollbar-thumb-zinc-800">
          {currentTab === 'discover' && (
            <DiscoverView
              songs={songs}
              artists={INITIAL_ARTISTS}
              playlists={playlists}
              genres={INITIAL_GENRES}
              onSelectGenre={handleSelectGenre}
              onSelectArtist={handleSelectArtist}
              onSelectPlaylist={handleSelectPlaylist}
              openAIGenerator={() => setIsAIGeneratorOpen(true)}
            />
          )}

          {currentTab === 'search' && (
            <SearchView
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              songs={songs}
              artists={INITIAL_ARTISTS}
              albums={INITIAL_ALBUMS}
              playlists={playlists}
              genres={INITIAL_GENRES}
              onSelectArtist={handleSelectArtist}
              onSelectPlaylist={handleSelectPlaylist}
            />
          )}

          {currentTab === 'library' && (
            <LibraryView
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={handleCreatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onSelectPlaylist={handleSelectPlaylist}
              openAIGenerator={() => setIsAIGeneratorOpen(true)}
              activeFilter="all"
            />
          )}

          {currentTab === 'liked' && (
            <LibraryView
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={handleCreatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onSelectPlaylist={handleSelectPlaylist}
              openAIGenerator={() => setIsAIGeneratorOpen(true)}
              activeFilter="liked"
            />
          )}

          {currentTab === 'offline' && (
            <LibraryView
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={handleCreatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onSelectPlaylist={handleSelectPlaylist}
              openAIGenerator={() => setIsAIGeneratorOpen(true)}
              activeFilter="offline"
            />
          )}

          {currentTab === 'creator' && (
            <CreatorStudioView
              artist={INITIAL_ARTISTS[0]} // Defaults to Terungwa (Benue All-Stars)
              songs={songs}
              onUploadSong={handleUploadSong}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboardView
              songs={songs}
              dmcaReports={dmcaReports}
              verifications={verifications}
              onUpdateDMCAStatus={handleUpdateDMCAStatus}
              onUpdateVerificationStatus={handleUpdateVerificationStatus}
              onSubmitDMCAReport={handleSubmitDMCAReport}
            />
          )}

          {currentTab === 'playlist-detail' && selectedPlaylist && (
            <PlaylistDetailView
              playlist={selectedPlaylist}
              songs={songs}
              onBack={() => setCurrentTab('discover')}
            />
          )}

          {currentTab === 'artist-detail' && selectedArtist && (
            <ArtistDetailView
              artist={selectedArtist}
              songs={songs}
              onBack={() => setCurrentTab('discover')}
            />
          )}

          {currentTab === 'contact' && (
            <ContactView
              onBackToDiscover={() => setCurrentTab('discover')}
              onOpenLegalModal={handleOpenLegalModal}
            />
          )}

          {/* Global AUD9ja Footer */}
          <Footer
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              const mainElem = document.querySelector('main');
              if (mainElem) mainElem.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLegalModal={handleOpenLegalModal}
          />
        </main>
      </div>

      {/* Global Persistent Bottom Audio Player Dock */}
      <PlayerDock />

      {/* Full-screen Lyircs & Vinyl Player Overlay */}
      <FullScreenPlayer />

      {/* Music Queue Drawer */}
      <QueueDrawer />

      {/* Google Gemini AI Playlist Generation Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onPlaylistCreated={handlePlaylistCreatedByAI}
      />

      {/* Supabase PostgreSQL Schema Inspector Modal */}
      <DatabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* Official Legal Policies & Compliance Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        docType={legalDocType}
        onClose={() => setIsLegalModalOpen(false)}
        onNavigateContact={() => {
          setIsLegalModalOpen(false);
          setCurrentTab('contact');
          const mainElem = document.querySelector('main');
          if (mainElem) mainElem.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  );
}
