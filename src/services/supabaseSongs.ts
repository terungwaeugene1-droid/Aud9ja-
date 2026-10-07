import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Song } from '../types';
import { INITIAL_SONGS } from '../data/mockMusic';

/**
 * Filter and query options for fetching songs
 */
export interface FetchSongsParams {
  genre?: string;
  releaseDate?: string | { start?: string; end?: string } | 'today' | 'this_week' | 'this_month' | '2026';
  sortBy?: 'relevance' | 'plays' | 'likes' | 'newest' | 'created_at' | 'likes_count';
  limit?: number;
  offset?: number;
}

// Read Supabase credentials from client-side Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Initializes Supabase client if valid URL and Anon key are present
 */
export const supabase: SupabaseClient | null =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-id')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Maps sortBy parameter options to database column names in `public.songs`
 */
const mapSortColumn = (sortBy?: FetchSongsParams['sortBy']): { column: 'plays' | 'likes_count' | 'created_at'; ascending: boolean } => {
  switch (sortBy) {
    case 'plays':
      return { column: 'plays', ascending: false };
    case 'likes':
    case 'likes_count':
      return { column: 'likes_count', ascending: false };
    case 'newest':
    case 'created_at':
      return { column: 'created_at', ascending: false };
    case 'relevance':
    default:
      // Default to plays descending for relevance/trending
      return { column: 'plays', ascending: false };
  }
};

/**
 * Helper to compute date range strings for era filters
 */
const resolveDateBoundary = (releaseDate: FetchSongsParams['releaseDate']): { start?: string; end?: string } => {
  if (!releaseDate) return {};
  if (typeof releaseDate === 'object') return releaseDate;

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (releaseDate === 'today') {
    const todayStr = formatYMD(now);
    return { start: todayStr };
  }

  if (releaseDate === 'this_week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { start: formatYMD(weekAgo) };
  }

  if (releaseDate === 'this_month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { start: formatYMD(monthAgo) };
  }

  if (releaseDate === '2026') {
    return { start: '2026-01-01', end: '2026-12-31' };
  }

  // Exact date string passed
  return { start: releaseDate };
};

/**
 * Filter mock array locally when Supabase environment variables are missing or unconfigured
 */
const filterLocalMockSongs = (params?: FetchSongsParams): Song[] => {
  let list = [...INITIAL_SONGS];

  if (!params) return list;

  // Genre filter
  if (params.genre && params.genre !== 'all') {
    const g = params.genre.toLowerCase();
    list = list.filter((s) => {
      const sg = s.genre.toLowerCase();
      if (params.genre === 'Benue Groove') {
        return sg.includes('benue') || sg.includes('groove') || sg.includes('tiv');
      }
      return sg.includes(g);
    });
  }

  // Date filter
  if (params.releaseDate && params.releaseDate !== 'all') {
    const { start, end } = resolveDateBoundary(params.releaseDate);
    if (start) {
      const startTime = new Date(start).getTime();
      list = list.filter((s) => new Date(s.release_date).getTime() >= startTime);
    }
    if (end) {
      const endTime = new Date(end).getTime();
      list = list.filter((s) => new Date(s.release_date).getTime() <= endTime);
    }
  }

  // Sort mapping
  const { column, ascending } = mapSortColumn(params.sortBy);
  list.sort((a, b) => {
    let valA: number | string = 0;
    let valB: number | string = 0;

    if (column === 'plays') {
      valA = a.plays;
      valB = b.plays;
    } else if (column === 'likes_count') {
      valA = a.likes_count;
      valB = b.likes_count;
    } else if (column === 'created_at') {
      valA = new Date(a.release_date).getTime();
      valB = new Date(b.release_date).getTime();
    }

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });

  // Limit / Offset
  if (params.offset) {
    list = list.slice(params.offset);
  }
  if (params.limit) {
    list = list.slice(0, params.limit);
  }

  return list;
};

/**
 * Fetch songs from Supabase PostgREST client ('public.songs')
 * with graceful fallback to local mock arrays if unconfigured or on network failure.
 *
 * @param params Optional filtering and sorting parameters
 * @returns Promise<Song[]>
 */
export async function fetchSongs(params?: FetchSongsParams): Promise<Song[]> {
  // Graceful fallback to local mock data if Supabase is unconfigured
  if (!supabase) {
    return filterLocalMockSongs(params);
  }

  try {
    let query = supabase
      .from('songs')
      .select(`
        id,
        title,
        duration,
        audio_url,
        cover_url,
        genre,
        plays,
        likes_count,
        lyrics,
        explicit,
        featured_artists,
        isrc_code,
        region_origin,
        created_at,
        artists (
          id,
          name
        ),
        albums (
          id,
          title
        )
      `);

    // 1. Filter by Genre
    if (params?.genre && params.genre !== 'all') {
      if (params.genre === 'Benue Groove') {
        query = query.ilike('genre', '%Benue%');
      } else {
        query = query.ilike('genre', `%${params.genre}%`);
      }
    }

    // 2. Filter by Release Date / Era
    if (params?.releaseDate && params.releaseDate !== 'all') {
      const { start, end } = resolveDateBoundary(params.releaseDate);
      if (start) {
        query = query.gte('created_at', start);
      }
      if (end) {
        query = query.lte('created_at', end);
      }
    }

    // 3. Sorting by actual DB columns ('plays', 'likes_count', 'created_at')
    const { column, ascending } = mapSortColumn(params?.sortBy);
    query = query.order(column, { ascending });

    // Pagination
    if (params?.limit) {
      const from = params.offset || 0;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn('Supabase query error, falling back to local catalog:', error?.message);
      return filterLocalMockSongs(params);
    }

    // Map database result rows to Song interface
    const mappedSongs: Song[] = data.map((row: any) => {
      const artistData = Array.isArray(row.artists) ? row.artists[0] : row.artists;
      const albumData = Array.isArray(row.albums) ? row.albums[0] : row.albums;

      return {
        id: row.id,
        title: row.title,
        artist: artistData?.name || 'Unknown Artist',
        artist_id: artistData?.id || '',
        album: albumData?.title,
        album_id: albumData?.id,
        duration: row.duration || 180,
        audio_url: row.audio_url,
        cover_url: row.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        genre: row.genre || 'Afrobeats',
        plays: row.plays || 0,
        likes_count: row.likes_count || 0,
        lyrics: row.lyrics,
        explicit: Boolean(row.explicit),
        featured_artists: row.featured_artists || [],
        isrc_code: row.isrc_code,
        release_date: row.created_at ? row.created_at.split('T')[0] : '2026-01-01',
        region_origin: row.region_origin || 'Gboko, Benue State',
      };
    });

    return mappedSongs;
  } catch (err) {
    console.warn('Network or PostgREST exception, falling back gracefully:', err);
    return filterLocalMockSongs(params);
  }
}
