import React, { useState, useRef } from 'react';
import { Song, Artist } from '../types';
import {
  UploadCloud,
  Music,
  Image as ImageIcon,
  Sparkles,
  Zap,
  BarChart3,
  DollarSign,
  Users,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileAudio,
  Cpu,
  Loader2,
  TrendingUp,
  MapPin,
  Globe,
} from 'lucide-react';

interface CreatorStudioViewProps {
  artist: Artist;
  songs: Song[];
  onUploadSong: (newSong: Song) => void;
}

export const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({
  artist,
  songs,
  onUploadSong,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics'>('upload');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  // Upload Form State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Benue Groove');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [isrcCode, setIsrcCode] = useState(`NG-AUD9JA-26-${Math.floor(10000 + Math.random() * 90000)}`);
  const [regionOrigin, setRegionOrigin] = useState('Gboko, Benue State');
  const [isExplicit, setIsExplicit] = useState(false);
  const [lyricsSnippet, setLyricsSnippet] = useState('');
  const [coverPreview, setCoverPreview] = useState<string>(
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
  );
  const [audioFileName, setAudioFileName] = useState<string>('sample-track.mp3');
  const [detectedDuration, setDetectedDuration] = useState<number>(204); // in seconds
  const [targetBitrate, setTargetBitrate] = useState<number>(128); // 128kbps AAC default for data saver
  const [transcodeResult, setTranscodeResult] = useState<any | null>(null);

  // AI Tagging State
  const [isAITagging, setIsAITagging] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Audio Upload & Frontend Duration Detection
  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      // Automatically detect audio duration using Audio element / Object URL
      const tempAudio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      tempAudio.src = objectUrl;
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setDetectedDuration(Math.floor(tempAudio.duration));
        }
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  // Image upload
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Tagging with Gemini API
  const handleAITagging = async () => {
    setIsAITagging(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/gemini/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          genre_hint: genre,
          lyrics_snippet: lyricsSnippet,
          file_name: audioFileName,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
        if (data.analysis.suggested_genre) {
          setGenre(data.analysis.suggested_genre);
        }
        if (data.analysis.is_explicit !== undefined) {
          setIsExplicit(data.analysis.is_explicit);
        }
      }
    } catch (err) {
      console.error('Failed auto-tagging:', err);
    } finally {
      setIsAITagging(false);
    }
  };

  // Run FFmpeg Transcoding Simulation
  const handleTranscodeOptimization = async () => {
    try {
      const res = await fetch('/api/transcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_size_bytes: 10485760, // 10MB WAV/high-bitrate MP3
          target_bitrate_kbps: targetBitrate,
          format: 'aac',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTranscodeResult(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSong: Song = {
      id: `song-creator-${Date.now()}`,
      title: title.trim(),
      artist: artist.name,
      artist_id: artist.id,
      duration: detectedDuration || 195,
      audio_url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3', // default playable
      cover_url: coverPreview,
      genre: genre,
      plays: 1,
      likes_count: 0,
      explicit: isExplicit,
      featured_artists: featuredArtists ? featuredArtists.split(',').map((s) => s.trim()) : undefined,
      isrc_code: isrcCode,
      release_date: new Date().toISOString().split('T')[0],
      region_origin: regionOrigin,
      bitrate_kbps: targetBitrate,
      synced_lyrics: [
        { time: 0, text: `♪ ${title} - Official Gboko Release ♪` },
        { time: 10, text: lyricsSnippet ? lyricsSnippet.slice(0, 60) : 'Afrobeats groove starting now' },
        { time: 24, text: 'AUD9ja premier streaming sound' },
      ],
    };

    onUploadSong(newSong);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setTitle('');
      setLyricsSnippet('');
      setAiAnalysis(null);
      setTranscodeResult(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Creator Studio & Distribution
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Gboko Node
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Artist: <strong className="text-white">{artist.name}</strong> ({artist.state_of_origin})
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Publish Track</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Royalties & Stats</span>
          </button>
        </div>
      </div>

      {/* PUBLISH TRACK TAB */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmitUpload} className="space-y-8">
          {/* Main Upload Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Audio, Image & Metadata */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio File Selection Card */}
              <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
                  <FileAudio className="w-4 h-4" /> 1. Audio Master File (MP3 / WAV)
                </span>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-xl p-6 text-center cursor-pointer transition bg-zinc-900/40 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*"
                    onChange={handleAudioFile}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-semibold text-white">
                    {audioFileName ? audioFileName : 'Click to select audio file'}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Frontend duration automatically detected: <strong className="text-amber-400">{detectedDuration}s</strong> ({Math.floor(detectedDuration / 60)}:{(detectedDuration % 60).toString().padStart(2, '0')})
                  </p>
                </div>
              </div>

              {/* Metadata Inputs */}
              <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                  <Music className="w-4 h-4" /> 2. Track Metadata & Credits
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Track Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Mkar Mountain Sunset"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Genre Classification
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Benue Groove">Benue Groove & Highlife</option>
                      <option value="Afrobeats">Afrobeats</option>
                      <option value="Amapiano">Amapiano</option>
                      <option value="Afro-Fusion">Afro-Fusion</option>
                      <option value="Alte">Alte</option>
                      <option value="Fuji">Fuji Fusion</option>
                      <option value="Afro-Gospel">Afro-Gospel</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Featured Artists (comma separated)
                    </label>
                    <input
                      type="text"
                      value={featuredArtists}
                      onChange={(e) => setFeaturedArtists(e.target.value)}
                      placeholder="e.g. Tiwa Savage, Burna Boy"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Regional Origin
                    </label>
                    <input
                      type="text"
                      value={regionOrigin}
                      onChange={(e) => setRegionOrigin(e.target.value)}
                      placeholder="e.g. Gboko, Benue State"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      ISRC / Copyright Code
                    </label>
                    <input
                      type="text"
                      value={isrcCode}
                      onChange={(e) => setIsrcCode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={isExplicit}
                        onChange={(e) => setIsExplicit(e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
                      />
                      <span>Mark as Explicit Content (E)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Lyrics Snippet (for AI Auto-Tagging & Moderation)
                  </label>
                  <textarea
                    value={lyricsSnippet}
                    onChange={(e) => setLyricsSnippet(e.target.value)}
                    placeholder="Enter chorus or lyrics snippet to let Gemini suggest mood chips and verify clean language..."
                    className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* AI Smart Tagging Button */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAITagging}
                    disabled={isAITagging}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition disabled:opacity-50"
                  >
                    {isAITagging ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Gemini AI Auto-Tag & Moderation Check</span>
                  </button>

                  <span className="text-[11px] text-zinc-400">Gboko Compliance AI Node</span>
                </div>

                {/* AI Analysis Result */}
                {aiAnalysis && (
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-400">AI Tagging Insights:</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Confidence: {(aiAnalysis.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAnalysis.mood_chips?.map((mood: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      Safety Audit: {aiAnalysis.is_explicit ? '⚠️ Explicit Flagged' : '✅ Verified Safe'} — {aiAnalysis.explicit_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Artwork & Transcode Optimization */}
            <div className="space-y-6">
              {/* Artwork Upload */}
              <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5 mb-3">
                  <ImageIcon className="w-4 h-4" /> 3. Cover Artwork (1:1)
                </span>

                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-zinc-700 hover:border-amber-500 cursor-pointer relative group transition"
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-xs font-semibold text-white">Change Artwork</span>
                  </div>
                </div>
              </div>

              {/* Data Optimization & Transcoding Simulator */}
              <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> 4. Mobile Transcoding
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">FFmpeg Node</span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug">
                  Compress user upload for Nigerian mobile data optimization (AAC/MP3 128kbps).
                </p>

                <div className="flex items-center gap-2">
                  {[64, 128, 256, 320].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setTargetBitrate(rate)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                        targetBitrate === rate
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {rate}k
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTranscodeOptimization}
                  className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
                >
                  Simulate Mobile Transcode
                </button>

                {transcodeResult && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Data Saved:</span>
                      <span>{transcodeResult.savings_percentage} ({transcodeResult.data_saved_mb} MB)</span>
                    </div>
                    <p className="text-zinc-300">{transcodeResult.message}</p>
                  </div>
                )}
              </div>

              {/* Final Submit Publish Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-xl shadow-amber-500/25 transition transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 fill-black text-amber-500" />
                  <span>Publish to AUD9ja Network</span>
                </button>

                {uploadSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs text-center font-semibold animate-in fade-in">
                    🎉 Track successfully transcoded and distributed from Gboko Node!
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ROYALTIES & ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-semibold">Total Streams</span>
                <Play className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-white">
                {(artist.total_streams / 1000000).toFixed(2)}M
              </p>
              <span className="text-[11px] text-emerald-400 font-medium">↑ +18.4% this month</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-semibold">Monthly Listeners</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-white">
                {(artist.monthly_listeners / 1000).toFixed(1)}K
              </p>
              <span className="text-[11px] text-emerald-400 font-medium">Across 24 African nations</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold">Estimated Royalties</span>
                  <div className="flex items-center text-[10px] bg-zinc-900 border border-zinc-800 rounded p-0.5">
                    <button
                      onClick={() => setCurrency('NGN')}
                      className={`px-1.5 py-0.5 rounded ${
                        currency === 'NGN' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
                      }`}
                    >
                      ₦ NGN
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-1.5 py-0.5 rounded ${
                        currency === 'USD' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>

              <p className="text-2xl font-extrabold text-white">
                {currency === 'NGN'
                  ? `₦${(artist.royalties_ngn).toLocaleString()}`
                  : `$${(artist.royalties_usd).toLocaleString()}`}
              </p>
              <span className="text-[11px] text-zinc-400">Direct deposit via Nigerian CBN payout</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-semibold">Verification</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-bold text-white">
                {artist.verified ? 'Verified Gboko Creator' : 'Pending Review'}
              </p>
              <span className="text-[11px] text-zinc-400">Ema Records Certified</span>
            </div>
          </div>

          {/* Regional Demographics & Top Tracks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fan Regional Demographics */}
            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" /> Regional Demographics
                </h3>
                <span className="text-xs text-zinc-400">Top Listener Locations</span>
              </div>

              <div className="space-y-3">
                {[
                  { region: 'Benue State (Gboko, Makurdi, Otukpo)', percent: 38, count: '32.0K listeners' },
                  { region: 'Lagos & Mainland', percent: 28, count: '23.6K listeners' },
                  { region: 'South Africa (Johannesburg, Soweto)', percent: 14, count: '11.8K listeners' },
                  { region: 'Abuja FCT', percent: 12, count: '10.1K listeners' },
                  { region: 'United Kingdom & Diaspora', percent: 8, count: '6.7K listeners' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-200 font-medium">{item.region}</span>
                      <span className="text-amber-400 font-mono">{item.percent}% ({item.count})</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Tracks */}
            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" /> Catalog Performance
                </h3>
                <span className="text-xs text-zinc-400">Real-time plays</span>
              </div>

              <div className="space-y-2">
                {songs.slice(0, 4).map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-zinc-400 w-4">{idx + 1}</span>
                      <img
                        src={s.cover_url}
                        alt={s.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{s.title}</p>
                        <p className="text-zinc-400 truncate">{s.genre} • {s.region_origin}</p>
                      </div>
                    </div>
                    <span className="font-mono text-amber-400 font-semibold">
                      {(s.plays).toLocaleString()} plays
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
