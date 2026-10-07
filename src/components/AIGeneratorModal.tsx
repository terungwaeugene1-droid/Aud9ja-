import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Sparkles, X, Music, Check, ArrowRight, Loader2, Disc3 } from 'lucide-react';
import { Playlist, Song } from '../types';
import { INITIAL_SONGS } from '../data/mockMusic';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: Playlist) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const { likedSongIds, currentTrack, playTrack } = usePlayer();
  const [promptPreference, setPromptPreference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickVibePills = [
    'Gboko Sunset Afro-Fusion',
    'Lekki Midnight Amapiano Grooves',
    'Alte Soul & Chill Relaxation',
    'Benue State Highlife Revival',
    'Private School Piano 2026',
    'Afro-Gospel Uplifting Praise',
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const likedSongsList = INITIAL_SONGS.filter((s) => likedSongIds.has(s.id)).map((s) => ({
        title: s.title,
        artist: s.artist,
        genre: s.genre,
      }));

      const res = await fetch('/api/gemini/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listening_history: currentTrack
            ? [{ title: currentTrack.title, artist: currentTrack.artist, genre: currentTrack.genre }]
            : [],
          liked_songs: likedSongsList,
          prompt_preference: promptPreference,
        }),
      });

      const data = await res.json();
      if (data.success && data.playlist) {
        setResult(data.playlist);
      } else {
        throw new Error(data.error || 'Failed to generate playlist');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with Gemini AI server route.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndPlay = () => {
    if (!result) return;

    // Match or create songs for the playlist
    const matchedSongIds: string[] = [];
    result.recommended_tracks?.forEach((rec: any) => {
      const found = INITIAL_SONGS.find(
        (s) =>
          s.title.toLowerCase().includes(rec.title.toLowerCase()) ||
          rec.title.toLowerCase().includes(s.title.toLowerCase())
      );
      if (found) {
        matchedSongIds.push(found.id);
      } else {
        // Fallback to random song if not exact match
        matchedSongIds.push(INITIAL_SONGS[matchedSongIds.length % INITIAL_SONGS.length].id);
      }
    });

    const newPlaylist: Playlist = {
      id: `ai-pl-${Date.now()}`,
      user_id: 'user-current',
      title: result.title || 'AI Curated African Vibes',
      description: result.description || 'Generated with Google Gemini on AUD9ja',
      cover_url:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      is_public: true,
      is_ai_generated: true,
      song_ids: matchedSongIds.length > 0 ? matchedSongIds : ['song-1', 'song-2', 'song-3'],
      created_at: new Date().toISOString().split('T')[0],
    };

    onPlaylistCreated(newPlaylist);

    // If tracks exist, play the first track in queue
    const queueTracks = newPlaylist.song_ids
      .map((id) => INITIAL_SONGS.find((s) => s.id === id))
      .filter(Boolean) as Song[];

    if (queueTracks.length > 0) {
      playTrack(queueTracks[0], queueTracks);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1015] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gemini AI African Mix Studio</h3>
              <p className="text-xs text-zinc-400">
                Personalized Afrobeat & Amapiano curation powered by Google AI Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!result ? (
          <div className="py-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-zinc-400 block mb-1.5">
                Describe your desired vibe or groove
              </label>
              <textarea
                value={promptPreference}
                onChange={(e) => setPromptPreference(e.target.value)}
                placeholder="e.g. Curate an upbeat sunset session blending heavy Amapiano log-drums with Gboko Highlife brass and Tiv chants..."
                className="w-full h-24 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition resize-none placeholder:text-zinc-600"
              />
            </div>

            <div>
              <span className="text-[11px] font-medium text-zinc-400 block mb-2">
                Quick Regional Inspiration:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickVibePills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setPromptPreference(pill)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-300 transition"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing African Groove & Curation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Playlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Generated Playlist
                  </span>
                  <h4 className="text-xl font-bold text-white mt-0.5">{result.title}</h4>
                  <p className="text-xs text-zinc-300 mt-1">{result.description}</p>
                </div>
              </div>

              {/* Mood chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.mood_tags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase text-zinc-400 block mb-2">
                Curated Track Sequence ({result.recommended_tracks?.length || 0})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {result.recommended_tracks?.map((track: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-zinc-400 w-4">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{track.title}</p>
                        <p className="text-zinc-400 truncate">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 max-w-[140px] truncate text-right">
                      {track.reason || track.genre}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-800 transition"
              >
                Regenerate
              </button>
              <button
                onClick={handleSaveAndPlay}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <Check className="w-4 h-4" />
                <span>Save to Library & Play Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
