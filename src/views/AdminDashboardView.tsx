import React, { useState, useEffect } from 'react';
import { Song, DMCAReport, ArtistVerificationRequest, AUD9JA_OFFICIAL_CONTACTS } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  Scale,
  Building,
  Server,
  Database,
  Users,
  Music,
  Check,
  X,
  FileCheck2,
  Mail,
  Settings,
  Bell,
  Send,
  Copy,
  Inbox,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardViewProps {
  songs: Song[];
  dmcaReports: DMCAReport[];
  verifications: ArtistVerificationRequest[];
  onUpdateDMCAStatus: (reportId: string, status: DMCAReport['status']) => void;
  onUpdateVerificationStatus: (reqId: string, status: 'approved' | 'rejected') => void;
  onSubmitDMCAReport: (report: DMCAReport) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  songs,
  dmcaReports,
  verifications,
  onUpdateDMCAStatus,
  onUpdateVerificationStatus,
  onSubmitDMCAReport,
}) => {
  const [activeTab, setActiveTab] = useState<'dmca' | 'verifications' | 'system' | 'settings'>('dmca');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Platform contact settings state
  const [contactSettings, setContactSettings] = useState<any>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Fetch admin contact settings
  const fetchContactSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/contact-settings');
      if (res.ok) {
        const data = await res.json();
        setContactSettings(data);
      }
    } catch (err) {
      console.warn('Could not fetch admin contact settings:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchContactSettings();
  }, []);

  // New DMCA Form state
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [selectedSongId, setSelectedSongId] = useState(songs[0]?.id || '');
  const [proofUrl, setProofUrl] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateDMCA = (e: React.FormEvent) => {
    e.preventDefault();
    const song = songs.find((s) => s.id === selectedSongId) || songs[0];
    const newReport: DMCAReport = {
      id: `dmca-${Date.now()}`,
      claimant_name: claimantName,
      claimant_email: claimantEmail,
      song_id: song.id,
      song_title: song.title,
      artist_name: song.artist,
      infringing_url: infringingUrl || `https://aud9ja.ng/track/${song.id}`,
      proof_url: proofUrl,
      status: 'pending',
      notes,
      created_at: new Date().toISOString().split('T')[0],
      intake_office: 'Ema Records Legal Intake, Gboko, Benue State, Nigeria',
    };

    onSubmitDMCAReport(newReport);
    setShowSubmitModal(false);
    setClaimantName('');
    setClaimantEmail('');
    setProofUrl('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Admin & DMCA Compliance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Gboko Compliance Office
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Official Ema Records Legal Intake, Gboko, Benue State, Nigeria
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dmca')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'dmca'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>DMCA Takedowns ({dmcaReports.filter((r) => r.status === 'pending' || r.status === 'under_review').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'verifications'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Artist Badges ({verifications.filter((v) => v.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'system'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Node Health</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Contact Settings</span>
          </button>
        </div>
      </div>

      {/* DMCA TAKEDOWN TAB */}
      {activeTab === 'dmca' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Active Copyright Dispute Dossiers
            </span>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-amber-400 text-xs font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File DMCA Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {dmcaReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-3 hover:border-zinc-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        Case: {report.song_title}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          report.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : report.status === 'under_review'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : report.status === 'dismissed'
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Target Artist: <strong className="text-zinc-200">{report.artist_name}</strong> • Filed by: {report.claimant_name} ({report.claimant_email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{report.created_at}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                  {report.notes || 'No preliminary notes provided.'}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intake: {report.intake_office}</span>
                  </div>

                  {/* Action Buttons for Triage */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateDMCAStatus(report.id, 'under_review')}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition text-xs font-medium"
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => onUpdateDMCAStatus(report.id, 'resolved')}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition text-xs font-medium"
                    >
                      Resolve & Clear
                    </button>
                    <button
                      onClick={() => onUpdateDMCAStatus(report.id, 'dismissed')}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition text-xs font-medium"
                    >
                      Dismiss Claim
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTIST VERIFICATION TAB */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Pending Artist Identity & Heritage Verification
          </span>

          <div className="space-y-3">
            {verifications.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{req.artist_name}</h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    State of Origin: <strong className="text-amber-400">{req.state_of_origin}</strong> • ID Provided: {req.government_id_type}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Submitted: {req.submitted_at}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateVerificationStatus(req.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-md transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify Artist</span>
                  </button>
                  <button
                    onClick={() => onUpdateVerificationStatus(req.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-xs font-medium transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM STATUS TAB */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <span className="text-xs uppercase font-semibold text-zinc-400">Regional Gateway</span>
              <p className="text-lg font-bold text-white mt-1">NG-BENUE-01 (Gboko)</p>
              <span className="text-[11px] text-emerald-400 font-mono">Status: 99.98% Latency 14ms</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <span className="text-xs uppercase font-semibold text-zinc-400">Total Catalog</span>
              <p className="text-2xl font-bold text-white mt-1">{songs.length} Master Tracks</p>
              <span className="text-[11px] text-zinc-400">Across 6 African genres</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <span className="text-xs uppercase font-semibold text-zinc-400">Storage Buckets</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Supabase S3 Active</p>
              <span className="text-[11px] text-zinc-400">audio-tracks & artwork-covers</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800">
              <span className="text-xs uppercase font-semibold text-zinc-400">Gemini AI Model</span>
              <p className="text-lg font-bold text-amber-400 mt-1">gemini-3.8-flash</p>
              <span className="text-[11px] text-zinc-400">Auto-tagging & playlist curation</span>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM CONTACT SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121419] via-[#0f1115] to-[#0a0b0d] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Platform Contact & Compliance Settings</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Centralized authority email routing for AUD9ja legal, administrative, copyright, and creator notifications.
              </p>
            </div>

            <button
              onClick={fetchContactSettings}
              disabled={isLoadingSettings}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-200 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLoadingSettings ? 'Refreshing...' : 'Refresh Status'}</span>
            </button>
          </div>

          {/* Email Settings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Official Contact Email</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Primary
                </span>
              </div>
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.officialEmail}`}
                className="text-base font-mono font-bold text-amber-400 hover:underline block"
              >
                {AUD9JA_OFFICIAL_CONTACTS.officialEmail}
              </a>
              <p className="text-[11px] text-zinc-400">Public inquiries, partnership requests, and user correspondence.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Legal Contact Email</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-zinc-800 text-zinc-300">
                  Compliance
                </span>
              </div>
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.legalEmail}`}
                className="text-base font-mono font-bold text-amber-400 hover:underline block"
              >
                {AUD9JA_OFFICIAL_CONTACTS.legalEmail}
              </a>
              <p className="text-[11px] text-zinc-400">Terms of service, privacy inquiries, and statutory communications.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Support Email</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-zinc-800 text-zinc-300">
                  Help Desk
                </span>
              </div>
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.supportEmail}`}
                className="text-base font-mono font-bold text-amber-400 hover:underline block"
              >
                {AUD9JA_OFFICIAL_CONTACTS.supportEmail}
              </a>
              <p className="text-[11px] text-zinc-400">Mobile streaming issues, offline cache recovery, and listener support.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Notification Email</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Automated
                </span>
              </div>
              <a
                href={`mailto:${AUD9JA_OFFICIAL_CONTACTS.adminNotificationEmail}`}
                className="text-base font-mono font-bold text-amber-400 hover:underline block"
              >
                {AUD9JA_OFFICIAL_CONTACTS.adminNotificationEmail}
              </a>
              <p className="text-[11px] text-zinc-400">Receives admin alerts: contact forms, song uploads, DMCA reports.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Email Dispatch Service</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  contactSettings?.emailProviderConfigured
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {contactSettings?.emailProviderConfigured ? 'Active Provider' : 'Compliance Queue Mode'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                {contactSettings?.providerType || 'Compliance Intake Queue'}
              </p>
              <p className="text-[11px] text-zinc-400">
                {contactSettings?.emailProviderConfigured
                  ? 'Configured with EMAIL_PROVIDER_API_KEY for live delivery.'
                  : 'Safe mode: messages recorded in compliance database & queued for admin review.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111317] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-zinc-400">Physical Intake Office</span>
                <Building className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-white">
                {AUD9JA_OFFICIAL_CONTACTS.intakeOffice}
              </p>
              <p className="text-[11px] text-zinc-400">Primary legal office for physical copyright summons & submissions.</p>
            </div>
          </div>

          {/* Contact Submissions Queue Table */}
          <div className="p-6 rounded-2xl bg-[#0e1014] border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-amber-500" />
                  <span>Incoming Contact Submissions ({contactSettings?.recentMessages?.length || 0})</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Restricted Administrative View: Ordinary listeners cannot access contact messages.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">RLS Policy: Service Role Restricted</span>
            </div>

            {(!contactSettings?.recentMessages || contactSettings.recentMessages.length === 0) ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                No new contact form submissions in queue.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2.5 px-3">Sender</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Received At</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {contactSettings.recentMessages.map((msg: any) => (
                      <tr key={msg.id} className="hover:bg-zinc-900/40 transition">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-white">{msg.name}</p>
                          <a
                            href={`mailto:${msg.email}`}
                            className="font-mono text-[11px] text-amber-400 hover:underline"
                          >
                            {msg.email}
                          </a>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <p className="text-zinc-200 truncate font-medium">{msg.subject}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{msg.message}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            {msg.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Admin Notification Events Log */}
          {contactSettings?.recentNotifications && contactSettings.recentNotifications.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#0e1014] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Administrative Audit Notification Log</span>
                </h3>
                <span className="text-[11px] font-mono text-amber-400">
                  Recipient: {AUD9JA_OFFICIAL_CONTACTS.adminNotificationEmail}
                </span>
              </div>

              <div className="space-y-2">
                {contactSettings.recentNotifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{notif.subject}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                          {notif.eventType}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{notif.summary}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        notif.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {notif.status}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {new Date(notif.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message Detail Inspector Modal */}
      {selectedMessage && (
        <div
          onClick={() => setSelectedMessage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0e1014] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">Contact Submission Dossier</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-400 block font-semibold">Sender:</span>
                <p className="text-white font-medium">{selectedMessage.name} &bull; <a href={`mailto:${selectedMessage.email}`} className="text-amber-400 underline">{selectedMessage.email}</a></p>
              </div>

              <div>
                <span className="text-zinc-400 block font-semibold">Subject:</span>
                <p className="text-white font-medium">{selectedMessage.subject}</p>
              </div>

              <div>
                <span className="text-zinc-400 block font-semibold">Message Content:</span>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 mt-1 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 border-t border-zinc-800">
                <span>ID: {selectedMessage.id}</span>
                <span>Date: {new Date(selectedMessage.created_at).toUTCString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re:%20${encodeURIComponent(selectedMessage.subject)}`}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply to Sender</span>
              </a>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File DMCA Notice Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDMCA}
            className="bg-[#0e1015] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">File DMCA Copyright Dispute</h3>
                <p className="text-xs text-zinc-400">Ema Records Legal Intake, Gboko, Nigeria</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Target Audio Track *
                </label>
                <select
                  value={selectedSongId}
                  onChange={(e) => setSelectedSongId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                >
                  {songs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.artist} ({s.genre})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Claimant / Copyright Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Tor Tiv Heritage Music Trust"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Claimant Legal Email *
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="e.g. legal@publisher.ng or aud9ja.legal@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Proof / Trademark Registration URL
                </label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://isrc.soundexchange.com/claims/..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Dispute Details & Statement *
                </label>
                <textarea
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe the unauthorized sample or unlicensed master recording usage..."
                  className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-md"
                >
                  Submit for Intake Review
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
