import React, { useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Song, Artist, Album, Playlist, GenreCategory, RecentSearch } from '../types';
import {
  Search,
  Clock,
  Trash2,
  TrendingUp,
  Sparkles,
  Play,
  Heart,
  Download,
  CheckCircle2,
  X,
  Filter,
  ArrowUpDown,
  Music2,
  Users,
  Disc,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AdvancedSearchFilterPanel,
  AdvancedFilterState,
  GenreFilter,
  EraFilter,
  SortMetric,
} from '../components/AdvancedSearchFilterPanel';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  genres: GenreCategory[];
  onSelectArtist: (artist: Artist) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

type FilterTab = 'all' | 'songs' | 'artists' | 'playlists' | 'genres';

const RECENT_SEARCHES_KEY = 'aud9ja_recent_searches_v2';
const ADVANCED_FILTERS_KEY = 'aud9ja_search_advanced_filters_v1';

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  setSearchQuery,
  songs,
  artists,
  albums,
  playlists,
  genres,
  onSelectArtist,
  onSelectPlaylist,
}) => {
  const { playTrack, currentTrack, toggleLike, isLiked, toggleCacheSong, isCached } = usePlayer();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  // Advanced Filter state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(() => {
    try {
      const stored = localStorage.getItem(ADVANCED_FILTERS_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            genre: 'all',
            era: 'all',
            sort: 'relevance',
          };
    } catch {
      return {
        genre: 'all',
        era: 'all',
        sort: 'relevance',
      };
    }
  });

  // Recent Searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored
        ? JSON.parse(stored)
        : [
            { id: 'rs-1', query: 'Terungwa Gboko', timestamp: Date.now() - 3600000 },
            { id: 'rs-2', query: 'Amapiano Log Drum', timestamp: Date.now() - 7200000 },
            { id: 'rs-3', query: 'Lekki Afrobeats', timestamp: Date.now() - 86400000 },
          ];
    } catch {
      return [];
    }
  });

  const trendingQueries = [
    'Gboko Highlife',
    'Amapiano 2026',
    'Middle Belt Anthem',
    'Terungwa',
    'Lekki Midnight',
    'Tiv Cultural Rhythm',
    'Alte Afro-Soul',
  ];

  // Save advanced filters when changed
  useEffect(() => {
    localStorage.setItem(ADVANCED_FILTERS_KEY, JSON.stringify(advancedFilters));
  }, [advancedFilters]);

  // Save to recent searches when query is submitted or typed
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length > 2) {
      const timer = setTimeout(() => {
        addRecentSearch(trimmed);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const addRecentSearch = (query: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
      const updated: RecentSearch[] = [
        { id: `rs-${Date.now()}`, query, timestamp: Date.now() },
        ...filtered.slice(0, 7), // Keep top 8
      ];
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({
      genre: 'all',
      era: 'all',
      sort: 'relevance',
    });
  };

  // Helper to test if a track falls within selected era
  const isWithinEra = (releaseDateStr: string, era: EraFilter): boolean => {
    if (era === 'all') return true;
    const releaseTime = new Date(releaseDateStr).getTime();
    if (isNaN(releaseTime)) return true;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (era === 'today') {
      return now - releaseTime <= dayMs * 2;
    }
    if (era === 'this_week') {
      return now - releaseTime <= dayMs * 14;
    }
    if (era === 'this_month') {
      return now - releaseTime <= dayMs * 60;
    }
    if (era === '2026') {
      return releaseDateStr.startsWith('2026');
    }
    return true;
  };

  // Helper to match genre
  const matchesGenre = (trackGenre: string, filterGenre: GenreFilter): boolean => {
    if (filterGenre === 'all') return true;
    const tg = trackGenre.toLowerCase();
    const fg = filterGenre.toLowerCase();

    if (filterGenre === 'Benue Groove') {
      return tg.includes('benue') || tg.includes('groove') || tg.includes('tiv');
    }
    if (filterGenre === 'Afrobeats') {
      return tg.includes('afrobeat') || tg.includes('afro-pop');
    }
    if (filterGenre === 'Amapiano') {
      return tg.includes('amapiano') || tg.includes('piano');
    }
    if (filterGenre === 'Highlife') {
      return tg.includes('highlife') || tg.includes('fuji');
    }
    if (filterGenre === 'Gospel') {
      return tg.includes('gospel') || tg.includes('praise');
    }
    return tg.includes(fg);
  };

  // Filter and sort songs
  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    // Filter by text query if provided, or return all matching genre/era if no query
    let result = songs.filter((s) => {
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.region_origin.toLowerCase().includes(q);

      const genreOk = matchesGenre(s.genre, advancedFilters.genre);
      const eraOk = isWithinEra(s.release_date, advancedFilters.era);

      return matchesQuery && genreOk && eraOk;
    });

    // Sorting
    if (advancedFilters.sort === 'plays') {
      result.sort((a, b) => b.plays - a.plays);
    } else if (advancedFilters.sort === 'likes') {
      result.sort((a, b) => b.likes_count - a.likes_count);
    } else if (advancedFilters.sort === 'newest') {
      result.sort(
        (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    }

    return result;
  }, [searchQuery, songs, advancedFilters]);

  // Filter artists
  const filteredArtists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return artists.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.state_of_origin.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q));

      const genreOk =
        advancedFilters.genre === 'all' ||
        a.genres.some((g) => matchesGenre(g, advancedFilters.genre));

      return matchesQuery && genreOk;
    });
  }, [searchQuery, artists, advancedFilters.genre]);

  // Filter playlists
  const filteredPlaylists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return playlists.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      const genreOk =
        advancedFilters.genre === 'all' ||
        matchesGenre(p.title + ' ' + p.description, advancedFilters.genre);

      return matchesQuery && genreOk;
    });
  }, [searchQuery, playlists, advancedFilters.genre]);

  // Filter genres
  const filteredGenres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return genres.filter((g) => {
      const matchesQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);

      const genreOk =
        advancedFilters.genre === 'all' || matchesGenre(g.name, advancedFilters.genre);

      return matchesQuery && genreOk;
    });
  }, [searchQuery, genres, advancedFilters.genre]);

  const hasActiveFilters =
    advancedFilters.genre !== 'all' ||
    advancedFilters.era !== 'all' ||
    advancedFilters.sort !== 'relevance';

  const shouldShowResults = Boolean(searchQuery.trim() || hasActiveFilters);

  const totalResultsCount =
    filteredSongs.length +
    filteredArtists.length +
    filteredPlaylists.length +
    filteredGenres.length;

  const hasResults = totalResultsCount > 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search African tracks, artists, Gboko highlife, Amapiano..."
            className="w-full bg-[#121419] border border-zinc-800 text-white pl-12 pr-10 py-3.5 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter toggle button */}
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-semibold transition ${
            isFilterPanelOpen
              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-[#121419] border-zinc-800 text-zinc-300 hover:border-amber-500/40 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Advanced Search Filters Collapsible Component */}
      <AdvancedSearchFilterPanel
        isOpen={isFilterPanelOpen}
        onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        filters={advancedFilters}
        onChange={setAdvancedFilters}
        onReset={handleResetFilters}
        totalResultsCount={totalResultsCount}
      />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['all', 'songs', 'artists', 'playlists', 'genres'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3.5 py-1.5 rounded-full font-medium capitalize transition whitespace-nowrap ${
              filterTab === tab
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* When no query and no active filters: Show Recent Searches & Trending Regional Tags */}
      {!shouldShowResults && (
        <div className="space-y-8 py-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Recent Searches
                </span>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-zinc-400 hover:text-red-400 transition"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSearchQuery(item.query)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121419] border border-zinc-800 hover:border-amber-500/40 text-xs text-zinc-200 cursor-pointer transition group"
                  >
                    <span>{item.query}</span>
                    <button
                      onClick={(e) => removeRecentSearch(item.id, e)}
                      className="text-zinc-400 hover:text-red-400 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              Trending African Searches
            </span>

            <div className="flex flex-wrap gap-2">
              {trendingQueries.map((trend) => (
                <button
                  key={trend}
                  onClick={() => setSearchQuery(trend)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-xs text-zinc-300 transition"
                >
                  🔥 {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {shouldShowResults && (
        <div className="space-y-8">
          {!hasResults && (
            <div className="text-center py-16 bg-[#101216]/40 rounded-2xl border border-zinc-800">
              <Search className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No matching African tracks</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                No songs or creators matched your current search filters. Try switching the African
                Genre to &ldquo;All&rdquo; or resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Songs Section */}
          {(filterTab === 'all' || filterTab === 'songs') && filteredSongs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Music2 className="w-4 h-4 text-amber-500" /> Songs ({filteredSongs.length})
              </h3>
              <div className="space-y-2">
                {filteredSongs.map((track) => {
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
                        onClick={() => playTrack(track, filteredSongs)}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
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
                            {track.artist} • {track.genre}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                          {track.region_origin}
                        </span>
                        <button
                          onClick={() => toggleLike(track.id)}
                          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked(track.id) ? 'fill-amber-500 text-amber-500' : ''
                            }`}
                          />
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
            </div>
          )}

          {/* Artists Section */}
          {(filterTab === 'all' || filterTab === 'artists') && filteredArtists.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> Artists ({filteredArtists.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredArtists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => onSelectArtist(artist)}
                    className="p-4 rounded-xl bg-[#101216]/60 border border-zinc-800 hover:border-amber-500/40 cursor-pointer text-center group transition"
                  >
                    <img
                      src={artist.avatar_url}
                      alt={artist.name}
                      className="w-20 h-20 mx-auto rounded-full object-cover border border-zinc-700 group-hover:scale-105 transition mb-2"
                    />
                    <h4 className="font-semibold text-sm text-white truncate group-hover:text-amber-400">
                      {artist.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{artist.state_of_origin}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists Section */}
          {(filterTab === 'all' || filterTab === 'playlists') && filteredPlaylists.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Disc className="w-4 h-4 text-amber-500" /> Playlists ({filteredPlaylists.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredPlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => onSelectPlaylist(pl)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#101216]/60 border border-zinc-800 hover:border-amber-500/40 cursor-pointer transition"
                  >
                    <img
                      src={pl.cover_url}
                      alt={pl.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-white truncate">{pl.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{pl.song_ids.length} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
