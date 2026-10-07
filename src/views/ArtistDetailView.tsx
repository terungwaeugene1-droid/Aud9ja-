import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Artist, Song } from '../types';
import {
  Play,
  Pause,
  ArrowLeft,
  Award,
  Users,
  MapPin,
  Heart,
  Download,
  CheckCircle2,
  Instagram,
  Twitter,
} from 'lucide-react';

interface ArtistDetailViewProps {
  artist: Artist;
  songs: Song[];
  onBack: () => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist,
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

  const artistSongs = songs.filter((s) => s.artist_id === artist.id || s.artist === artist.name);

  const formatPlays = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const isCurrentArtistPlaying =
    isPlaying && artistSongs.some((s) => s.id === currentTrack?.id);

  return (
    <div className="space-y-6 pb-24">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </button>

      {/* Artist Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#111317]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${artist.header_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d]/80 to-transparent" />

        <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl flex-shrink-0">
            <img
              src={artist.avatar_url}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {artist.verified ? (
                  <>
                    <Award className="w-3.5 h-3.5 fill-amber-400" />
                    Verified Gboko Artist
                  </>
                ) : (
                  'Community Artist'
                )}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-zinc-900/80 text-zinc-300 border border-zinc-800">
                <MapPin className="w-3 h-3 text-amber-400" />
                {artist.state_of_origin}, {artist.country}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">{artist.bio}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
              <span>{formatPlays(artist.monthly_listeners)} monthly listeners</span>
              <span>•</span>
              <span>{formatPlays(artist.total_streams)} total streams</span>
              {artist.instagram_handle && (
                <>
                  <span>•</span>
                  <span className="text-amber-400">{artist.instagram_handle}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {artistSongs.length > 0 && (
          <button
            onClick={() => {
              if (isCurrentArtistPlaying) {
                togglePlay();
              } else {
                playTrack(artistSongs[0], artistSongs);
              }
            }}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95 text-sm"
          >
            {isCurrentArtistPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>Play Catalog</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tracks List */}
      <div>
        <h3 className="text-base font-bold text-white mb-3">Popular Releases</h3>
        <div className="space-y-2">
          {artistSongs.map((song, idx) => {
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
                  onClick={() => playTrack(song, artistSongs)}
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
                      {formatPlays(song.plays)} plays • {song.genre}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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
    </div>
  );
};
