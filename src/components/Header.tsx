import React from 'react';
import { 
  Mic2, 
  Vote, 
  Users, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Tv
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onToggleDebateMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onToggleDebateMode,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header id="main-header" className="relative pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Top Action Bar (Admin, Sound, Fullscreen, Mode Debat) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/60 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            SIDANG DEBAT RESMI OSIS
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/70 text-slate-300 border border-slate-700/60">
            🇮🇩 PPO Randangan
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Suara Bell Aktif (Klik untuk Mematikan)' : 'Suara Bell Hening (Klik untuk Menyalakan)'}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-slate-800/90 text-amber-300 border-amber-500/40 hover:bg-slate-700' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? 'Suara ON' : 'Suara MUTE'}</span>
          </button>

          {/* Mode Debat Button */}
          <button
            id="btn-mode-debat-header"
            type="button"
            onClick={onToggleDebateMode}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-red-900/30 border border-red-500/50 transition-all transform active:scale-95 cursor-pointer"
          >
            <Tv className="w-4 h-4 animate-pulse" />
            <span>🎤 MODE DEBAT</span>
          </button>

          {/* Fullscreen Button */}
          <button
            id="btn-fullscreen-header"
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Tampilan Layar Penuh (Cocok untuk LCD/Proyektor)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Keluar Fullscreen' : '⛶ Fullscreen'}</span>
          </button>

          {/* Admin Panel Button */}
          <button
            id="btn-admin-open"
            type="button"
            onClick={onOpenAdmin}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Buka Panel Pengaturan Admin"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform" />
            <span>⚙ ADMIN</span>
          </button>
        </div>
      </div>

      {/* Main Header Title & Branding */}
      <div className="text-center space-y-3">
        {/* Indonesian Flag & Emblem Symbolism */}
        <div className="inline-flex items-center justify-center gap-2 p-1.5 px-4 rounded-full bg-gradient-to-r from-red-900/40 via-slate-800/60 to-red-900/40 border border-red-500/30 mb-1 backdrop-blur-sm">
          <span className="text-lg">🇮🇩</span>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-300">
            FORUM DEMOKRASI PENDIDIKAN
          </span>
          <span className="text-lg">🗳️</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif] uppercase drop-shadow-md">
          DEBAT CALON KETUA DAN WAKIL KETUA OSIS
        </h1>

        <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-red-400 font-['Outfit',sans-serif]">
          SMP NEGERI 4 RANDANGAN SATU ATAP
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base md:text-lg font-medium italic text-slate-300 tracking-wide max-w-2xl mx-auto py-1 px-4 rounded-lg bg-slate-800/40 border border-slate-700/40 inline-block">
          “Demokrasi Dimulai dari Sekolah”
        </p>

        {/* Value Badges (Debat, Demokrasi, Kepemimpinan, Nasionalisme) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-3 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <Mic2 className="w-3.5 h-3.5 text-red-400" />
            <span>🎤 Debat Terbuka</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <Vote className="w-3.5 h-3.5 text-amber-400" />
            <span>🗳️ Demokrasi Santun</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>👥 Kepemimpinan Solutif</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-sm">🇮🇩</span>
            <span>Jiwa Nasionalisme</span>
          </div>
        </div>
      </div>
    </header>
  );
};
