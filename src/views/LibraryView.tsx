import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Song, Playlist } from '../types';
import {
  Heart,
  Plus,
  Trash2,
  Edit2,
  HardDriveDownload,
  Play,
  Music,
  CheckCircle2,
  Download,
  Sparkles,
  Disc3,
  X,
  Check,
} from 'lucide-react';

interface LibraryViewProps {
  playlists: Playlist[];
  songs: Song[];
  onCreatePlaylist: (title: string, description: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenamePlaylist: (id: string, newTitle: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  openAIGenerator: () => void;
  activeFilter?: 'all' | 'liked' | 'offline';
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  playlists,
  songs,
  onCreatePlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onSelectPlaylist,
  openAIGenerator,
  activeFilter = 'all',
}) => {
  const {
    likedSongIds,
    cachedSongIds,
    playTrack,
    currentTrack,
    toggleLike,
    isLiked,
    toggleCacheSong,
    isCached,
  } = usePlayer();

  const [currentFilter, setCurrentFilter] = useState<'all' | 'liked' | 'offline'>(activeFilter);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Get liked songs
  const likedSongs = songs.filter((s) => likedSongIds.has(s.id));
  // Get cached songs
  const cachedSongs = songs.filter((s) => cachedSongIds.has(s.id));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreatePlaylist(newTitle.trim(), newDesc.trim() || 'Custom user playlist on AUD9ja');
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const startRename = (pl: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlaylistId(pl.id);
    setRenameValue(pl.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (renameValue.trim()) {
      onRenamePlaylist(id, renameValue.trim());
    }
    setEditingPlaylistId(null);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Filter Chips */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Your Music Library</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your African playlists, liked songs, and PWA offline storage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
          <button
            onClick={openAIGenerator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-amber-400 text-xs font-medium transition"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mix</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-3">
        <button
          onClick={() => setCurrentFilter('all')}
          className={`px-4 py-1.5 rounded-full font-medium transition ${
            currentFilter === 'all'
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          All Playlists ({playlists.length})
        </button>
        <button
          onClick={() => setCurrentFilter('liked')}
          className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition ${
            currentFilter === 'liked'
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Liked Songs ({likedSongs.length})</span>
        </button>
        <button
          onClick={() => setCurrentFilter('offline')}
          className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition ${
            currentFilter === 'offline'
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <HardDriveDownload className="w-3.5 h-3.5" />
          <span>Offline Cached ({cachedSongs.length})</span>
        </button>
      </div>

      {/* Content based on selected filter */}
      {currentFilter === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quick Liked Songs Hero Card */}
          <div
            onClick={() => setCurrentFilter('liked')}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/80 via-amber-800/60 to-zinc-900 border border-amber-500/40 cursor-pointer shadow-lg hover:scale-102 transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-amber-400">
                <Heart className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Liked Songs</h3>
              <p className="text-xs text-amber-200/90">{likedSongs.length} favorites saved</p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-300 font-mono">Auto-Synced</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (likedSongs.length > 0) playTrack(likedSongs[0], likedSongs);
                }}
                className="p-2.5 rounded-full bg-amber-500 text-black shadow-md"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </button>
            </div>
          </div>

          {/* User Playlists */}
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="p-4 rounded-2xl bg-[#101216]/60 border border-zinc-800 hover:border-amber-500/40 cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={pl.cover_url}
                  alt={pl.title}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700/60 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  {editingPlaylistId === pl.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500 rounded px-2 py-0.5 text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={(e) => saveRename(pl.id, e)}
                        className="p-1 text-emerald-400 hover:bg-zinc-800 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlaylistId(null);
                        }}
                        className="p-1 text-zinc-400 hover:bg-zinc-800 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-white truncate group-hover:text-amber-400 transition">
                        {pl.title}
                      </h4>
                      {pl.is_ai_generated && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> AI
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{pl.description}</p>
                  <span className="text-[11px] text-amber-500/80 font-mono mt-2 block">
                    {pl.song_ids.length} Songs
                  </span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-zinc-800/80">
                <button
                  onClick={(e) => startRename(pl, e)}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  title="Rename Playlist"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${pl.title}"?`)) {
                      onDeletePlaylist(pl.id);
                    }
                  }}
                  className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liked Songs List */}
      {currentFilter === 'liked' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Liked Tracks ({likedSongs.length})
            </span>
            {likedSongs.length > 0 && (
              <button
                onClick={() => playTrack(likedSongs[0], likedSongs)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play All</span>
              </button>
            )}
          </div>

          {likedSongs.length === 0 ? (
            <div className="text-center py-16 bg-[#101216]/40 rounded-2xl border border-zinc-800">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No liked songs yet</p>
              <p className="text-xs text-zinc-400 mt-1">
                Tap the heart on any track to add it to your synchronized favorites.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {likedSongs.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition border ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-[#101216]/60 hover:bg-[#15171d] border-zinc-800'
                    }`}
                  >
                    <div
                      onClick={() => playTrack(track, likedSongs)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-zinc-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-amber-400' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {track.artist} • {track.region_origin}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(track.id)}
                        className="p-2 rounded-full hover:bg-zinc-800 text-amber-500"
                      >
                        <Heart className="w-4 h-4 fill-amber-500" />
                      </button>
                      <button
                        onClick={() => toggleCacheSong(track)}
                        className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        {isCached(track.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Offline Cached Songs List */}
      {currentFilter === 'offline' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <HardDriveDownload className="w-4 h-4" />
                PWA Browser Cache Storage API
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                These tracks are saved securely in your browser&apos;s Cache Storage and play buffer-free
                even without an internet connection in Gboko or on the road.
              </p>
            </div>
            {cachedSongs.length > 0 && (
              <button
                onClick={() => playTrack(cachedSongs[0], cachedSongs)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play Offline</span>
              </button>
            )}
          </div>

          {cachedSongs.length === 0 ? (
            <div className="text-center py-16 bg-[#101216]/40 rounded-2xl border border-zinc-800">
              <HardDriveDownload className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No cached tracks</p>
              <p className="text-xs text-zinc-400 mt-1">
                Tap the download icon on any song to store it offline.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cachedSongs.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition border ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-[#101216]/60 hover:bg-[#15171d] border-zinc-800'
                    }`}
                  >
                    <div
                      onClick={() => playTrack(track, cachedSongs)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-zinc-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? 'text-amber-400' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-medium">Cached</span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate">
                          {track.artist} • {track.genre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCacheSong(track)}
                        className="p-2 rounded-full hover:bg-zinc-800 text-emerald-400"
                        title="Remove from offline cache"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[#0e1015] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white">Create New African Playlist</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Gboko Weekend Groove"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="A handpicked collection of highlife and Amapiano bangers..."
                  className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-md shadow-amber-500/20 transition"
                >
                  Create Playlist
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
