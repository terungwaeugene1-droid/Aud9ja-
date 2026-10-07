export type UserRole = 'listener' | 'artist' | 'admin';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  bio?: string;
  is_verified?: boolean;
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artist_id: string;
  album?: string;
  album_id?: string;
  duration: number; // in seconds
  audio_url: string;
  cover_url: string;
  genre: string;
  plays: number;
  likes_count: number;
  lyrics?: string;
  synced_lyrics?: LyricLine[];
  explicit: boolean;
  featured_artists?: string[];
  isrc_code?: string;
  release_date: string;
  region_origin: string; // e.g. 'Gboko, Benue State', 'Lagos, Nigeria', 'Johannesburg, SA'
  bitrate_kbps?: number;
  is_cached?: boolean;
}

export interface Artist {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  avatar_url: string;
  header_url: string;
  verified: boolean;
  monthly_listeners: number;
  total_streams: number;
  royalties_ngn: number;
  royalties_usd: number;
  country: string;
  state_of_origin: string;
  instagram_handle?: string;
  twitter_handle?: string;
  genres: string[];
}

export interface Album {
  id: string;
  artist_id: string;
  artist_name: string;
  title: string;
  cover_url: string;
  release_date: string;
  genre: string;
  album_type: 'LP' | 'EP' | 'Single';
  track_count: number;
}

export interface GenreCategory {
  id: string;
  name: string;
  slug: string;
  color_gradient: string;
  description: string;
  icon?: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover_url: string;
  is_public: boolean;
  song_ids: string[];
  is_ai_generated?: boolean;
  created_at: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  category?: 'song' | 'artist' | 'genre' | 'playlist' | 'text';
}

export interface DMCAReport {
  id: string;
  claimant_name: string;
  claimant_email: string;
  song_id: string;
  song_title: string;
  artist_name: string;
  infringing_url?: string;
  proof_url?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  notes?: string;
  created_at: string;
  intake_office: string; // "Ema Records Legal Intake, Gboko, Benue State, Nigeria"
}

export interface ArtistVerificationRequest {
  id: string;
  artist_id: string;
  artist_name: string;
  state_of_origin: string;
  government_id_type: string;
  discography_link: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'under_review' | 'resolved' | 'archived';
  created_at: string;
}

export const AUD9JA_OFFICIAL_CONTACTS = {
  officialEmail: 'aud9ja.legal@gmail.com',
  legalEmail: 'aud9ja.legal@gmail.com',
  supportEmail: 'aud9ja.legal@gmail.com',
  copyrightEmail: 'aud9ja.legal@gmail.com',
  creatorEmail: 'aud9ja.legal@gmail.com',
  adminNotificationEmail: 'aud9ja.legal@gmail.com',
  intakeOffice: 'Ema Records Legal Intake, Gboko, Benue State, Nigeria',
} as const;
