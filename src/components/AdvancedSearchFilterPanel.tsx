import React from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export type GenreFilter =
  | 'all'
  | 'Afrobeats'
  | 'Amapiano'
  | 'Highlife'
  | 'Gospel'
  | 'Benue Groove';

export type EraFilter = 'all' | 'today' | 'this_week' | 'this_month' | '2026';

export type SortMetric = 'relevance' | 'newest' | 'plays' | 'likes';

export interface AdvancedFilterState {
  genre: GenreFilter;
  era: EraFilter;
  sort: SortMetric;
}

interface AdvancedSearchFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: AdvancedFilterState;
  onChange: (updated: AdvancedFilterState) => void;
  onReset: () => void;
  totalResultsCount?: number;
}

export const AdvancedSearchFilterPanel: React.FC<AdvancedSearchFilterPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onChange,
  onReset,
  totalResultsCount,
}) => {
  const isFiltered =
    filters.genre !== 'all' || filters.era !== 'all' || filters.sort !== 'relevance';

  const handleGenreChange = (genre: GenreFilter) => {
    onChange({ ...filters, genre });
  };

  const handleEraChange = (era: EraFilter) => {
    onChange({ ...filters, era });
  };

  const handleSortChange = (sort: SortMetric) => {
    onChange({ ...filters, sort });
  };

  const genreOptions: { label: string; value: GenreFilter; badge?: string }[] = [
    { label: 'All African Genres', value: 'all' },
    { label: 'Afrobeats Mainstream', value: 'Afrobeats' },
    { label: 'Amapiano Sunset', value: 'Amapiano' },
    { label: 'Highlife Revival', value: 'Highlife' },
    { label: 'Afro-Gospel & Praise', value: 'Gospel' },
    { label: 'Benue Groove (Gboko Native)', value: 'Benue Groove', badge: 'Native' },
  ];

  const eraOptions: { label: string; value: EraFilter; hint: string }[] = [
    { label: 'All Eras', value: 'all', hint: 'All catalog' },
    { label: 'Released Today', value: 'today', hint: 'Past 24h' },
    { label: 'This Week', value: 'this_week', hint: 'Past 7 days' },
    { label: 'This Month', value: 'this_month', hint: 'Past 30 days' },
    { label: '2026 Releases', value: '2026', hint: 'Current Year' },
  ];

  const sortOptions: { label: string; value: SortMetric; description: string }[] = [
    { label: 'Best Match (Relevance)', value: 'relevance', description: 'Algorithmic relevance' },
    { label: 'Latest Uploads', value: 'newest', description: 'Most recent release date' },
    { label: 'Most Played / Trending', value: 'plays', description: 'Highest streaming count' },
    { label: 'Highly Liked', value: 'likes', description: 'Most listener favorites' },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0a0b0d] border border-amber-500/30 shadow-xl overflow-hidden transition-all duration-300">
      {/* Header bar that toggles panel */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#101216] via-[#12141a] to-[#0a0b0d] cursor-pointer hover:bg-zinc-900/80 transition select-none group border-b border-amber-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition transform">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                Advanced Search Filters
              </span>
              {isFiltered && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              Refine by African Genre, Release Era, and Streaming Rank
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalResultsCount !== undefined && (
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {totalResultsCount} result{totalResultsCount === 1 ? '' : 's'}
            </span>
          )}

          {isFiltered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-medium text-amber-400 border border-amber-500/30 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div
            className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-amber-400 transition transform ${
              isOpen ? 'rotate-180 text-amber-400 border-amber-500/40' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Collapsible Inner Panel */}
      {isOpen && (
        <div className="p-4 sm:p-6 bg-obsidian-card/90 space-y-6 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Music Genre Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>African Genre</span>
              </label>

              <div className="relative">
                <select
                  value={filters.genre}
                  onChange={(e) => handleGenreChange(e.target.value as GenreFilter)}
                  className="w-full bg-[#121419] border border-amber-500/30 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition appearance-none cursor-pointer pr-10 font-medium"
                >
                  {genreOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121419] text-zinc-100">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Chip Toggles */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['all', 'Afrobeats', 'Amapiano', 'Benue Groove'] as GenreFilter[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenreChange(g)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition ${
                      filters.genre === g
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Release Era Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Release Era</span>
              </label>

              <div className="relative">
                <select
                  value={filters.era}
                  onChange={(e) => handleEraChange(e.target.value as EraFilter)}
                  className="w-full bg-[#121419] border border-amber-500/30 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition appearance-none cursor-pointer pr-10 font-medium"
                >
                  {eraOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121419] text-zinc-100">
                      {opt.label} ({opt.hint})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Chip Toggles for Era */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['all', 'this_week', 'this_month', '2026'] as EraFilter[]).map((era) => (
                  <button
                    key={era}
                    type="button"
                    onClick={() => handleEraChange(era)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition ${
                      filters.era === era
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {era === 'all'
                      ? 'All'
                      : era === 'this_week'
                      ? 'Week'
                      : era === 'this_month'
                      ? 'Month'
                      : '2026'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sorting Metrics Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sorting Metric</span>
              </label>

              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value as SortMetric)}
                  className="w-full bg-[#121419] border border-amber-500/30 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition appearance-none cursor-pointer pr-10 font-medium"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121419] text-zinc-100">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Chip Toggles for Sort */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['relevance', 'plays', 'newest', 'likes'] as SortMetric[]).map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => handleSortChange(metric)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition ${
                      filters.sort === metric
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {metric === 'relevance'
                      ? 'Best Match'
                      : metric === 'plays'
                      ? 'Trending'
                      : metric === 'newest'
                      ? 'Latest'
                      : 'Likes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Summary Pill Bar */}
          <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-zinc-400 font-medium">Applied Filters:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]">
                Genre: {filters.genre === 'all' ? 'All Genres' : filters.genre}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]">
                Era: {filters.era.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]">
                Sort: {filters.sort}
              </span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
