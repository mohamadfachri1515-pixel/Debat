import React from 'react';
import { Users, Mic } from 'lucide-react';
import { PaslonData } from '../types';

interface PaslonCardProps {
  paslon: PaslonData;
  isActiveSpeaker: boolean;
  onSelectSpeaker?: () => void;
  isDebateMode?: boolean;
}

export const PaslonCard: React.FC<PaslonCardProps> = ({
  paslon,
  isActiveSpeaker,
  onSelectSpeaker,
  isDebateMode = false,
}) => {
  const isPaslon01 = paslon.nomor === '01';
  const photoUrl = paslon.fotoPaslon || paslon.fotoKetua || paslon.fotoWakil;

  // Badge styling themes
  const themeStyles = isPaslon01
    ? {
        border: isActiveSpeaker ? 'border-red-500 ring-4 ring-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-red-800/60',
        badgeBg: 'bg-red-600',
        badgeGlow: 'shadow-red-900/50',
        accentText: 'text-red-400',
        cardBg: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-red-950/20',
        tagBg: 'bg-red-950/80 border border-red-800/80 text-red-200'
      }
    : {
        border: isActiveSpeaker ? 'border-blue-500 ring-4 ring-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'border-blue-800/60',
        badgeBg: 'bg-blue-600',
        badgeGlow: 'shadow-blue-900/50',
        accentText: 'text-blue-400',
        cardBg: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-blue-950/20',
        tagBg: 'bg-blue-950/80 border border-blue-800/80 text-blue-200'
      };

  return (
    <div
      id={`card-paslon-${paslon.nomor}`}
      className={`relative rounded-3xl border ${themeStyles.border} ${themeStyles.cardBg} backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Top Banner Ribbon */}
      <div className="relative p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-2xl ${themeStyles.badgeBg} text-white font-black text-xl sm:text-2xl tracking-wider shadow-lg ${themeStyles.badgeGlow} font-['Outfit',sans-serif] flex items-center gap-1.5`}>
            <span>{paslon.nomor}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              PASANGAN CALON
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white tracking-wide">
              NOMOR URUT {paslon.nomor}
            </span>
          </div>
        </div>

        {/* Active Speaker Status indicator or button */}
        {isActiveSpeaker ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm animate-pulse">
            <Mic className="w-3.5 h-3.5 animate-bounce" />
            <span>SEDANG BICARA</span>
          </div>
        ) : onSelectSpeaker ? (
          <button
            type="button"
            onClick={onSelectSpeaker}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer"
          >
            Aktifkan Mic
          </button>
        ) : null}
      </div>

      {/* Main Content Area: Hanya Foto dan Nama Calon */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        {/* Foto Bersama Pasangan Calon (1 Foto: Ketua & Wakil) */}
        <div className="space-y-3">
          <div className="relative aspect-[16/11] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`Pasangan Calon ${paslon.nomor} - ${paslon.ketua} & ${paslon.wakil}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Elegant vector avatar placeholder for candidate pair */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-500 bg-slate-950/80">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${isPaslon01 ? 'bg-red-950/60 text-red-400 border border-red-800/40' : 'bg-blue-950/60 text-blue-400 border border-blue-800/40'} flex items-center justify-center mb-2 shadow-inner`}>
                  <Users className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-slate-300">Foto Pasangan Calon {paslon.nomor}</span>
                <span className="text-[10px] text-slate-500">Ketua & Wakil Ketua Bersama</span>
                <span className="text-[9px] text-slate-600 mt-0.5">Belum diunggah di Panel Admin</span>
              </div>
            )}

            {/* Bottom label overlay on photo */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2 text-center">
              <span className={`inline-block px-3 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${themeStyles.tagBg} shadow-sm`}>
                KANDIDAT KETUA & WAKIL KETUA OSIS
              </span>
            </div>
          </div>

          {/* Names Box: Calon Ketua & Calon Wakil */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${isPaslon01 ? 'bg-red-950/80 text-red-400 border border-red-800/60' : 'bg-blue-950/80 text-blue-400 border border-blue-800/60'} min-w-[55px] text-center`}>
                KETUA
              </span>
              <h4 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug truncate">
                {paslon.ketua || 'Nama Calon Ketua'}
              </h4>
            </div>

            <div className="h-px bg-slate-800/80" />

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700/60 min-w-[55px] text-center">
                WAKIL
              </span>
              <h4 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug truncate">
                {paslon.wakil || 'Nama Calon Wakil'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Tag */}
      <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 text-center">
        <span className="text-[10px] font-semibold text-slate-400">
          OSIS SMPN 4 Randangan Satu Atap 2026/2027
        </span>
      </div>
    </div>
  );
};
