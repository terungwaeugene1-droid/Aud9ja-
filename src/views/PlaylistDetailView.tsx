import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Playlist, Song } from '../types';
import {
  Play,
  Pause,
  ArrowLeft,
  Clock,
  Heart,
  Download,
  CheckCircle2,
  Sparkles,
  Music,
} from 'lucide-react';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  songs: Song[];
  onBack: () => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  songs,
  onBack,
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    isLiked,
    toggleCacheSong,
    isCached,
  } = usePlayer();

  const playlistSongs = playlist.song_ids
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[];

  const totalDurationSecs = playlistSongs.reduce((acc, s) => acc + s.duration, 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const isCurrentPlaylistPlaying =
    isPlaying && playlistSongs.some((s) => s.id === currentTrack?.id);

  return (
    <div className="space-y-6 pb-24">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Playlist Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 rounded-3xl bg-gradient-to-b from-amber-600/30 to-[#101216] border border-zinc-800">
        <img
          src={playlist.cover_url}
          alt={playlist.title}
          className="w-44 h-44 rounded-2xl object-cover shadow-2xl border border-zinc-700/60"
        />

        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center sm:justify-start gap-1">
            {playlist.is_ai_generated ? (
              <>
                <Sparkles className="w-3.5 h-3.5" /> AI Curated African Playlist
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5" /> Official Playlist
              </>
            )}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {playlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">{playlist.description}</p>
          <div className="text-xs text-zinc-400 font-mono pt-1">
            <span>{playlistSongs.length} tracks</span> • <span>approx {totalMins} mins</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {playlistSongs.length > 0 && (
          <button
            onClick={() => {
              if (isCurrentPlaylistPlaying) {
                togglePlay();
              } else {
                playTrack(playlistSongs[0], playlistSongs);
              }
            }}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95 text-sm"
          >
            {isCurrentPlaylistPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>Play All</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        {playlistSongs.map((song, idx) => {
          const isCurrent = currentTrack?.id === song.id;
          return (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 rounded-xl transition border ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-[#101216]/60 hover:bg-[#15171d] border-zinc-800'
              }`}
            >
              <div
                onClick={() => playTrack(song, playlistSongs)}
                className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
              >
                <span className="text-xs font-mono text-zinc-400 w-5 text-center font-medium">
                  {idx + 1}
                </span>
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isCurrent ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {song.artist} • {song.genre}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  {formatDuration(song.duration)}
                </span>
                <button
                  onClick={() => toggleLike(song.id)}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked(song.id) ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => toggleCacheSong(song)}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Cache for offline"
                >
                  {isCached(song.id) ? (
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
    </div>
  );
};
