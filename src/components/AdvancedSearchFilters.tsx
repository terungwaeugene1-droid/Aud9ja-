// src/components/AdvancedSearchFilters.tsx
import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Music, Calendar, Flame } from 'lucide-react';

export interface FilterOptions {
  genre: string;
  releaseDate: string;
  sortBy: 'relevance' | 'newest' | 'plays' | 'likes';
}

export interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onFilterChange,
  initialFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genre, setGenre] = useState(initialFilters?.genre || '');
  const [releaseDate, setReleaseDate] = useState(initialFilters?.releaseDate || '');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'plays' | 'likes'>(
    initialFilters?.sortBy || 'relevance'
  );

  const handleApplyFilters = (updatedField: string, value: string) => {
    const currentFilters: FilterOptions = { genre, releaseDate, sortBy };
    if (updatedField === 'genre') {
      currentFilters.genre = value;
      setGenre(value);
    }
    if (updatedField === 'releaseDate') {
      currentFilters.releaseDate = value;
      setReleaseDate(value);
    }
    if (updatedField === 'sortBy') {
      currentFilters.sortBy = value as 'relevance' | 'newest' | 'plays' | 'likes';
      setSortBy(value as 'relevance' | 'newest' | 'plays' | 'likes');
    }

    onFilterChange(currentFilters);
  };

  return (
    <div className="w-full bg-obsidian-card border border-amber-500/10 rounded-xl p-4 my-4 shadow-xl transition-all duration-300 hover:border-amber-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-200 tracking-wide uppercase">
            Filter & Sort Results
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs text-amber-500 font-medium hover:text-amber-600 transition bg-amber-500/5 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg"
        >
          <span>{isOpen ? 'Hide Options' : 'Show Filters'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Smoothly Animated Dropdown Section */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-obsidian-border animate-slideDown">
          {/* Genre Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-gray-500" /> Music Genre
            </label>
            <select
              value={genre}
              onChange={(e) => {
                handleApplyFilters('genre', e.target.value);
              }}
              className="bg-obsidian text-gray-200 border border-obsidian-border rounded-lg p-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition cursor-pointer appearance-none"
            >
              <option value="">All Genres</option>
              <option value="afrobeats">Afrobeats</option>
              <option value="amapiano">Amapiano</option>
              <option value="benue-groove">Benue Groove (Gboko Native)</option>
              <option value="highlife">Highlife</option>
              <option value="gospel">Gospel</option>
            </select>
          </div>

          {/* Release Date Era */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" /> Release Era
            </label>
            <select
              value={releaseDate}
              onChange={(e) => {
                handleApplyFilters('releaseDate', e.target.value);
              }}
              className="bg-obsidian text-gray-200 border border-obsidian-border rounded-lg p-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition cursor-pointer"
            >
              <option value="">Any Time</option>
              <option value="today">Last 24 Hours</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">2026 Releases</option>
            </select>
          </div>

          {/* Sorting Algorithms */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-gray-500" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                handleApplyFilters('sortBy', e.target.value);
              }}
              className="bg-obsidian text-gray-200 border border-obsidian-border rounded-lg p-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition cursor-pointer"
            >
              <option value="relevance">Best Match</option>
              <option value="newest">Latest Uploads</option>
              <option value="plays">Most Played (Trending)</option>
              <option value="likes">Highly Liked</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
