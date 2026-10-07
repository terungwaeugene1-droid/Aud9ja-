import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Song, Artist, Playlist, GenreCategory } from '../types';
import {
  Play,
  Pause,
  Heart,
  Download,
  CheckCircle2,
  Sparkles,
  Flame,
  Radio,
  MapPin,
  TrendingUp,
  Disc3,
  Award,
  Users,
} from 'lucide-react';

interface DiscoverViewProps {
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
  genres: GenreCategory[];
  onSelectGenre: (genre: GenreCategory) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  openAIGenerator: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  songs,
  artists,
  playlists,
  genres,
  onSelectGenre,
  onSelectArtist,
  onSelectPlaylist,
  openAIGenerator,
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

  const heroSong = songs[0];

  const formatPlays = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="space-y-10 pb-24">
      {/* Hero Spotlight: Gboko Heritage to the World */}
      {heroSong && (
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#111317]">
          {/* Ambient background with warm amber glow */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay filter blur-md"
            style={{ backgroundImage: `url(${heroSong.cover_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d] via-[#0a0b0d]/90 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-black shadow-md shadow-amber-500/30">
                  Featured Spotlight
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-zinc-900/80 text-amber-300 border border-amber-500/30">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {heroSong.region_origin}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-zinc-900/80 text-zinc-300 border border-zinc-800">
                  {heroSong.genre}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {heroSong.title}
                </h1>
                <p className="text-lg sm:text-xl font-medium text-amber-400/90 mt-1">
                  {heroSong.artist}
                </p>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-lg">
                The premier contemporary Tiv highlife and Benue groove anthem. Recorded and mastered
                in Gboko, uniting ancestral brass polyrhythms with world-class African production.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (currentTrack?.id === heroSong.id) {
                      togglePlay();
                    } else {
                      playTrack(heroSong, songs);
                    }
                  }}
                  className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition transform active:scale-95"
                >
                  {currentTrack?.id === heroSong.id && isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-black" />
                      <span>Pause Playback</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                      <span>Stream Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={openAIGenerator}
                  className="px-5 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-medium flex items-center gap-2 border border-zinc-700 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Curate AI Vibe</span>
                </button>

                <button
                  onClick={() => toggleLike(heroSong.id)}
                  className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                  title="Like"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked(heroSong.id) ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => toggleCacheSong(heroSong)}
                  className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                  title="Cache for offline (PWA)"
                >
                  {isCached(heroSong.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: Artwork Card */}
            <div className="relative group w-56 h-56 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-700/80 flex-shrink-0">
              <img
                src={heroSong.cover_url}
                alt={heroSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center justify-between w-full text-xs text-zinc-300 font-mono">
                  <span>{formatPlays(heroSong.plays)} streams</span>
                  <span>{formatDuration(heroSong.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending Tracks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">Trending Across Africa</h2>
          </div>
          <span className="text-xs text-zinc-400">Live Gboko Stream Counters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {songs.slice(0, 6).map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-2xl transition border ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#101216]/60 hover:bg-[#15171d] border-zinc-800/80'
                }`}
              >
                <div
                  onClick={() => playTrack(track, songs)}
                  className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-sm font-mono text-zinc-400 w-5 text-center font-semibold">
                    {index + 1}
                  </span>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700/60">
                    <img
                      src={track.cover_url}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      {track.explicit && (
                        <span className="px-1 text-[9px] font-bold bg-zinc-800 text-zinc-400 rounded">
                          E
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {formatPlays(track.plays)} plays • {track.genre}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    onClick={() => toggleLike(track.id)}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked(track.id) ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => toggleCacheSong(track)}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                    title="Cache for offline"
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
      </div>

      {/* African Regional Moods & Genres */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">African Genres & Regional Moods</h2>
          </div>
          <span className="text-xs text-zinc-400">Authentic Soundscapes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => onSelectGenre(genre)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${genre.color_gradient} border border-white/10 hover:border-amber-400/50 cursor-pointer shadow-lg transition transform hover:-translate-y-1 group relative overflow-hidden`}
            >
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight mb-1 group-hover:text-amber-200 transition">
                {genre.name}
              </h3>
              <p className="text-[11px] text-zinc-200/80 line-clamp-2 leading-snug">
                {genre.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">Featured African Artists</h2>
          </div>
          <span className="text-xs text-zinc-400">Verified Creators</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="p-4 rounded-2xl bg-[#101216]/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition group text-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-zinc-700/80 group-hover:border-amber-500 transition mb-3">
                <img
                  src={artist.avatar_url}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <h4 className="font-semibold text-sm text-white truncate group-hover:text-amber-400 transition">
                  {artist.name}
                </h4>
                {artist.verified && (
                  <span title="Verified Artist in Gboko Compliance Intake">
                    <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 mt-0.5">{artist.state_of_origin}</p>
              <p className="text-[10px] text-amber-500/90 font-mono mt-1">
                {formatPlays(artist.monthly_listeners)} monthly listeners
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Curated Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">Curated Playlists</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#101216]/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition group"
            >
              <img
                src={pl.cover_url}
                alt={pl.title}
                className="w-20 h-20 rounded-xl object-cover border border-zinc-700/60 group-hover:scale-105 transition"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white truncate group-hover:text-amber-400 transition">
                    {pl.title}
                  </h4>
                  {pl.is_ai_generated && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{pl.description}</p>
                <span className="text-[11px] text-amber-500/80 font-mono mt-2 block">
                  {pl.song_ids.length} Tracks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
