import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Download,
  CheckCircle2,
  Radio,
  Sparkles,
  MapPin,
  Disc3,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    dataSaverMode,
    isUsingSynth,
    isFullScreen,
    setIsFullScreen,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    toggleLike,
    isLiked,
    toggleCacheSong,
    isCached,
  } = usePlayer();

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Find active lyric line based on currentTime
  const activeLyricIndex = (currentTrack?.synced_lyrics || []).reduce(
    (acc, line, idx) => (currentTime >= line.time ? idx : acc),
    0
  );

  // Auto-scroll lyrics into view (called unconditionally on every render)
  useEffect(() => {
    if (!isFullScreen || !currentTrack) return;
    if (lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isFullScreen, currentTrack, activeLyricIndex]);

  if (!isFullScreen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0b0d]/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-10 animate-in fade-in duration-300 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Now Playing</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-200">AUD9ja Live Stream</span>
              {isUsingSynth && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                  Web Audio African Synth
                </span>
              )}
              {dataSaverMode && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  128kbps Data Saver
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFullScreen(false)}
          className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-800"
          title="Close player"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Center Content: Artwork + Lyrics */}
      <div className="max-w-7xl mx-auto w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Vinyl Artwork & Song Details */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="relative group mb-8">
            <div
              className={`w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border-2 border-zinc-800 relative z-10 transition-transform ${
                isPlaying ? 'scale-100' : 'scale-95 opacity-90'
              }`}
            >
              <img
                src={currentTrack.cover_url}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Glowing spinning vinyl record backing behind cover */}
            <div
              className={`absolute top-0 right-[-15px] md:right-[-25px] w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-zinc-900 bg-[#0d0e12] flex items-center justify-center -z-0 transition-all ${
                isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
              }`}
            >
              <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950">
                <Disc3 className="w-10 h-10 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Track Info */}
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-lg text-amber-400/90 font-medium mt-1">{currentTrack.artist}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(currentTrack.id)}
                  className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition border border-zinc-800"
                >
                  <Heart
                    className={`w-6 h-6 transition ${
                      isLiked(currentTrack.id)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  />
                </button>
                <button
                  onClick={() => toggleCacheSong(currentTrack)}
                  className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition border border-zinc-800"
                  title="Download for offline playback (PWA Cache)"
                >
                  {isCached(currentTrack.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Download className="w-6 h-6 text-zinc-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                {currentTrack.genre}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-zinc-900 text-zinc-300 border border-zinc-800">
                <MapPin className="w-3 h-3 text-amber-400" />
                {currentTrack.region_origin}
              </span>
              {currentTrack.isrc_code && (
                <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-900 text-zinc-400 border border-zinc-800">
                  ISRC: {currentTrack.isrc_code}
                </span>
              )}
            </div>

            {/* Waveform Visualizer in Fullscreen */}
            <div className="mt-6 w-full">
              <AudioVisualizer className="w-full h-16 bg-zinc-900/40 p-2 border border-zinc-800/80" barCount={42} />
            </div>
          </div>
        </div>

        {/* Right: Real-time Synced Lyrics */}
        <div className="h-96 md:h-[460px] bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
            <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Synced African Lyrics
            </span>
            <span className="text-xs text-zinc-400">Tap line to seek</span>
          </div>

          <div
            ref={lyricsContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth select-none scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {currentTrack.synced_lyrics && currentTrack.synced_lyrics.length > 0 ? (
              currentTrack.synced_lyrics.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 p-2.5 rounded-xl font-medium text-lg leading-relaxed ${
                      isActive
                        ? 'text-amber-400 text-xl font-bold bg-amber-500/10 border-l-4 border-amber-500 scale-102 pl-4'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-center text-zinc-400 p-8">
                <div>
                  <Disc3 className="w-10 h-10 mx-auto mb-2 text-zinc-600 animate-spin" />
                  <p>Lyrics being transcribed and verified by Gboko editorial team.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Transport Controls */}
      <div className="max-w-4xl mx-auto w-full pt-4">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-4">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 group-hover:h-2.5 transition-all"
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition ${
              isShuffle ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={prevTrack}
              className="p-3 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Previous Track"
            >
              <SkipBack className="w-7 h-7" />
            </button>

            <button
              onClick={togglePlay}
              className="p-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 transition transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Next Track"
            >
              <SkipForward className="w-7 h-7" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-lg transition ${
                repeatMode !== 'off' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                className="w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
