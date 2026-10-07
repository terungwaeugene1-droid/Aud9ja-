import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Play, Trash2, ArrowUp, ArrowDown, Music2, Sparkles } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0e1014] border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-zinc-100 text-sm">Play Queue ({queue.length})</h3>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="text-xs text-zinc-400 hover:text-red-400 transition px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Now Playing section */}
        {currentTrack && (
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3" /> Now Playing
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <img
                src={currentTrack.cover_url}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover border border-amber-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-black font-semibold text-[10px]">
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
            Up Next
          </span>

          {queue.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">Queue is empty</p>
          ) : (
            <div className="space-y-1.5">
              {queue.map((track, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`flex items-center justify-between p-2 rounded-lg group transition border ${
                      isCurrent
                        ? 'bg-zinc-900 border-amber-500/40'
                        : 'hover:bg-zinc-900/60 border-transparent hover:border-zinc-800'
                    }`}
                  >
                    <div
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs text-zinc-400 w-4 text-center font-mono">
                        {idx + 1}
                      </span>
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        className="w-9 h-9 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium truncate ${
                            isCurrent ? 'text-amber-400 font-semibold' : 'text-zinc-200 group-hover:text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => removeFromQueue(idx)}
                        className="p-1 rounded text-zinc-400 hover:text-red-400 transition"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
