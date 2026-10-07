import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
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
  Maximize2,
  ListMusic,
  WifiOff,
  Cpu,
} from 'lucide-react';

export const PlayerDock: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isUsingSynth,
    dataSaverMode,
    isQueueOpen,
    isOffline,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    setIsFullScreen,
    setIsQueueOpen,
    toggleLike,
    isLiked,
    toggleCacheSong,
    isCached,
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d10]/95 backdrop-blur-xl border-t border-zinc-800/80 px-3 sm:px-6 py-2.5 shadow-2xl">
      {/* Offline Alert Strip if offline */}
      {isOffline && (
        <div className="max-w-7xl mx-auto mb-1 flex items-center justify-between text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-md">
          <span className="flex items-center gap-1.5 font-medium">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            Offline Mode Active — Playing seamlessly from Cache Storage API
          </span>
          <span className="text-[10px] text-amber-400/80">Gboko Offline Node</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Track Info & Quick Actions */}
        <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
          <div
            onClick={() => setIsFullScreen(true)}
            className="relative cursor-pointer group flex-shrink-0"
          >
            <img
              src={currentTrack.cover_url}
              alt={currentTrack.title}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-zinc-700/80 group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 rounded-lg">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4
                onClick={() => setIsFullScreen(true)}
                className="text-xs sm:text-sm font-semibold text-white truncate cursor-pointer hover:text-amber-400 transition"
              >
                {currentTrack.title}
              </h4>
              {isUsingSynth && (
                <span
                  title="Web Audio African Synthesizer Active"
                  className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30"
                >
                  <Cpu className="w-2.5 h-2.5" /> Synth
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-zinc-400 hidden lg:inline">{currentTrack.region_origin}</span>
              {dataSaverMode && (
                <span className="text-[9px] text-emerald-400 font-medium hidden sm:inline">128k</span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 ml-1 flex-shrink-0">
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              title={isLiked(currentTrack.id) ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-4 h-4 transition ${
                  isLiked(currentTrack.id) ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </button>
            <button
              onClick={() => toggleCacheSong(currentTrack)}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              title={isCached(currentTrack.id) ? 'Cached for offline' : 'Download for offline'}
            >
              {isCached(currentTrack.id) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-3 sm:gap-5 mb-1">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded transition hidden sm:inline-block ${
                isShuffle ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 text-zinc-400 hover:text-white transition"
              title="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 text-zinc-400 hover:text-white transition"
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded transition hidden sm:inline-block ${
                repeatMode !== 'off' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Scrubber slider */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span className="w-7 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
            />
            <span className="w-7">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Drawer Toggles */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/4 sm:w-1/3">
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(Number(e.target.value))}
              className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-lg transition border ${
              isQueueOpen
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white border-zinc-800'
            }`}
            title="Music Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800"
            title="Full Screen Lyrics & Visualizer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
