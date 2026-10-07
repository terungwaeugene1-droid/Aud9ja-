import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Song, RepeatMode } from '../types';
import { INITIAL_SONGS } from '../data/mockMusic';
import { webAudioSynth } from '../services/webAudioSynth';
import { offlineCacheService } from '../services/offlineCache';

interface PlayerContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  dataSaverMode: boolean;
  isFullScreen: boolean;
  isQueueOpen: boolean;
  isUsingSynth: boolean;
  likedSongIds: Set<string>;
  cachedSongIds: Set<string>;
  isOffline: boolean;
  
  // Actions
  playTrack: (track: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (level: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Song) => void;
  playNextInQueue: (track: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleDataSaver: () => void;
  setIsFullScreen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  toggleCacheSong: (song: Song) => Promise<void>;
  isCached: (songId: string) => boolean;
  analyser: AnalyserNode | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const LIKED_SONGS_STORAGE = 'aud9ja_liked_song_ids_v1';
const DATA_SAVER_STORAGE = 'aud9ja_data_saver_mode_v1';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(() => INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration || 180);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Song[]>(() => INITIAL_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(() => {
    return localStorage.getItem(DATA_SAVER_STORAGE) !== 'false';
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isUsingSynth, setIsUsingSynth] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Liked Songs
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(LIKED_SONGS_STORAGE);
    return saved ? new Set(JSON.parse(saved)) : new Set(['song-1', 'song-2']);
  });

  // Cached Songs
  const [cachedSongIds, setCachedSongIds] = useState<Set<string>>(() => {
    return new Set(offlineCacheService.getCachedIds());
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Setup offline network status listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubCache = offlineCacheService.subscribe(() => {
      setCachedSongIds(new Set(offlineCacheService.getCachedIds()));
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubCache();
    };
  }, []);

  // Initialize HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!isUsingSynth) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const onEnded = () => {
      handleTrackEnd();
    };

    const onError = () => {
      console.warn('Audio URL streaming unavailable. Activating AUD9ja Web Audio African Synthesizer.');
      activateSynthFallback();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      webAudioSynth.stopPattern();
    };
  }, []);

  const activateSynthFallback = () => {
    setIsUsingSynth(true);
    const genre = currentTrack?.genre?.toLowerCase() || '';
    const style = genre.includes('piano')
      ? 'amapiano'
      : genre.includes('highlife') || genre.includes('groove')
      ? 'highlife'
      : 'afrobeats';

    webAudioSynth.startPattern(style);

    // Run simulated playback progress
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    synthTimerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const trackDuration = currentTrack?.duration || 180;
        if (prev >= trackDuration) {
          handleTrackEnd();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      seek(0);
      resume();
      return;
    }
    nextTrack();
  };

  const playTrack = (track: Song, newQueue?: Song[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex((s) => s.id === track.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        setQueue((prev) => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 180);
    setIsUsingSynth(false);

    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    webAudioSynth.stopPattern();

    if (audioRef.current) {
      audioRef.current.src = track.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          webAudioSynth.connectAudioElement(audioRef.current!);
        })
        .catch((err) => {
          console.warn('Playback initiation fallback to synth:', err);
          activateSynthFallback();
          setIsPlaying(true);
        });
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (isUsingSynth) {
      webAudioSynth.stopPattern();
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
    }
  };

  const resume = () => {
    setIsPlaying(true);
    if (isUsingSynth) {
      activateSynthFallback();
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {
        activateSynthFallback();
      });
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (audioRef.current && !isUsingSynth) {
      audioRef.current.currentTime = clamped;
    }
  };

  const setVolumeLevel = (level: number) => {
    const clamped = Math.max(0, Math.min(1, level));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    webAudioSynth.setVolume(clamped);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume > 0 ? volume : 0.8;
      webAudioSynth.setVolume(volume > 0 ? volume : 0.8);
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
      webAudioSynth.setVolume(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') {
          nextIdx = 0;
        } else {
          pause();
          return;
        }
      }
    }

    setQueueIndex(nextIdx);
    playTrack(queue[nextIdx]);
  };

  const prevTrack = () => {
    if (currentTime > 4) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    playTrack(queue[prevIdx]);
  };

  const addToQueue = (track: Song) => {
    setQueue((prev) => [...prev, track]);
  };

  const playNextInQueue = (track: Song) => {
    setQueue((prev) => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, track);
      return copy;
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    if (index < queueIndex) {
      setQueueIndex((prev) => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const toggleDataSaver = () => {
    setDataSaverMode((prev) => {
      const next = !prev;
      localStorage.setItem(DATA_SAVER_STORAGE, String(next));
      return next;
    });
  };

  const toggleLike = (songId: string) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      localStorage.setItem(LIKED_SONGS_STORAGE, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isLiked = (songId: string) => likedSongIds.has(songId);

  const toggleCacheSong = async (song: Song) => {
    if (offlineCacheService.isCached(song.id)) {
      await offlineCacheService.removeCachedSong(song.id, song.audio_url);
      setCachedSongIds(new Set(offlineCacheService.getCachedIds()));
    } else {
      await offlineCacheService.cacheSong(song);
      setCachedSongIds(new Set(offlineCacheService.getCachedIds()));
    }
  };

  const isCached = (songId: string) => cachedSongIds.has(songId);

  const analyser = useMemo(() => {
    return webAudioSynth.getAnalyser();
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        dataSaverMode,
        isFullScreen,
        isQueueOpen,
        isUsingSynth,
        likedSongIds,
        cachedSongIds,
        isOffline,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        nextTrack,
        prevTrack,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
        toggleDataSaver,
        setIsFullScreen,
        setIsQueueOpen,
        toggleLike,
        isLiked,
        toggleCacheSong,
        isCached,
        analyser,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
