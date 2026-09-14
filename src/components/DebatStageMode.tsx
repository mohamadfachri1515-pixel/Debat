import React from 'react';
import { ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX, Mic, Users } from 'lucide-react';
import { PaslonData, ActiveSpeaker, DebatInfo } from '../types';
import { StopwatchSection } from './StopwatchSection';

interface DebatStageModeProps {
  paslon1: PaslonData;
  paslon2: PaslonData;
  info: DebatInfo;
  activeSpeaker: ActiveSpeaker;
  onSelectSpeaker: (speaker: ActiveSpeaker) => void;
  onExitDebateMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetRequest: () => void;
}

export const DebatStageMode: React.FC<DebatStageModeProps> = ({
  paslon1,
  paslon2,
  info,
  activeSpeaker,
  onSelectSpeaker,
  onExitDebateMode,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  onResetRequest,
}) => {
  return (
    <div id="mode-debat-stage" className="min-h-screen flex flex-col justify-between p-3 sm:p-6 select-none">
      
      {/* Minimal Debate Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 bg-slate-950/40 px-4 py-2.5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            id="btn-kembali-debat"
            type="button"
            onClick={onExitDebateMode}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← KEMBALI</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white font-['Outfit',sans-serif] uppercase tracking-wide">
              PANGGUNG DEBAT OSIS • SMPN 4 RANDANGAN
            </h2>
            <p className="text-[11px] text-red-400 font-medium line-clamp-1">
              {info.tema}
            </p>
          </div>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-2">
          {/* Active Speaker Banner on Projector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Pembicara:</span>
            <span className="font-bold text-white">
              {activeSpeaker === '01' ? '🔴 Paslon 01' : activeSpeaker === '02' ? '🔵 Paslon 02' : '⚪ Netral'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Suara Bell Aktif' : 'Suara Bell Mute'}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Center Stage: Timer in the Center between Paslon 01 and Paslon 02 */}
      <main className="flex-1 flex flex-col justify-center my-3 sm:my-5 px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-7xl mx-auto w-full items-stretch">
          
          {/* PASLON 01 Stage Card (Kiri) */}
          <div 
            onClick={() => onSelectSpeaker('01')}
            className={`order-1 lg:col-span-3 xl:col-span-3 cursor-pointer rounded-3xl p-4 sm:p-5 border flex flex-col justify-between transition-all duration-300 ${
              activeSpeaker === '01'
                ? 'border-red-500 bg-red-950/40 ring-4 ring-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-[1.01]'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black text-xl font-['Outfit',sans-serif] shadow-md shadow-red-900/50">
                    01
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                      PASANGAN CALON
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      NOMOR URUT 01
                    </span>
                  </div>
                </div>

                {activeSpeaker === '01' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/60 animate-pulse">
                    <Mic className="w-3.5 h-3.5" />
                    SEDANG BICARA
                  </span>
                )}
              </div>

              {/* 1 Foto Resmi Pasangan Calon 01 (Ketua + Wakil) */}
              <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner relative group mb-3">
                {(paslon1.fotoPaslon || paslon1.fotoKetua || paslon1.fotoWakil) ? (
                  <img
                    src={paslon1.fotoPaslon || paslon1.fotoKetua || paslon1.fotoWakil}
                    alt={`${paslon1.ketua} & ${paslon1.wakil}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                    <Users className="w-10 h-10 text-slate-600 mb-1" />
                    <span className="text-xs font-semibold text-slate-400">Foto Paslon 01</span>
                    <span className="text-[10px] text-slate-500">Ketua & Wakil Ketua</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-slate-700 text-[10px] font-bold text-red-300">
                  PASLON 01
                </div>
              </div>

              {/* Nama Kandidat Ketua & Wakil */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="border-b border-slate-800/60 pb-1.5">
                  <span className="text-[10px] font-bold text-red-400 block uppercase tracking-wider">
                    Calon Ketua OSIS
                  </span>
                  <p className="text-sm font-black text-white line-clamp-1">
                    {paslon1.ketua}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Calon Wakil Ketua OSIS
                  </span>
                  <p className="text-sm font-black text-slate-200 line-clamp-1">
                    {paslon1.wakil}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TIMER DEBAT (TENGAH: Di antara Paslon 01 dan Paslon 02) */}
          <div className="order-2 lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <StopwatchSection
              onResetRequest={onResetRequest}
              activeSpeaker={activeSpeaker}
              onSelectSpeaker={onSelectSpeaker}
              isCompact={true}
              isCenterLayout={true}
            />
          </div>

          {/* PASLON 02 Stage Card (Kanan) */}
          <div 
            onClick={() => onSelectSpeaker('02')}
            className={`order-3 lg:col-span-3 xl:col-span-3 cursor-pointer rounded-3xl p-4 sm:p-5 border flex flex-col justify-between transition-all duration-300 ${
              activeSpeaker === '02'
                ? 'border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] scale-[1.01]'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xl font-['Outfit',sans-serif] shadow-md shadow-blue-900/50">
                    02
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                      PASANGAN CALON
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      NOMOR URUT 02
                    </span>
                  </div>
                </div>

                {activeSpeaker === '02' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/60 animate-pulse">
                    <Mic className="w-3.5 h-3.5" />
                    SEDANG BICARA
                  </span>
                )}
              </div>

              {/* 1 Foto Resmi Pasangan Calon 02 (Ketua + Wakil) */}
              <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner relative group mb-3">
                {(paslon2.fotoPaslon || paslon2.fotoKetua || paslon2.fotoWakil) ? (
                  <img
                    src={paslon2.fotoPaslon || paslon2.fotoKetua || paslon2.fotoWakil}
                    alt={`${paslon2.ketua} & ${paslon2.wakil}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                    <Users className="w-10 h-10 text-slate-600 mb-1" />
                    <span className="text-xs font-semibold text-slate-400">Foto Paslon 02</span>
                    <span className="text-[10px] text-slate-500">Ketua & Wakil Ketua</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-slate-700 text-[10px] font-bold text-blue-300">
                  PASLON 02
                </div>
              </div>

              {/* Nama Kandidat Ketua & Wakil */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="border-b border-slate-800/60 pb-1.5">
                  <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-wider">
                    Calon Ketua OSIS
                  </span>
                  <p className="text-sm font-black text-white line-clamp-1">
                    {paslon2.ketua}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Calon Wakil Ketua OSIS
                  </span>
                  <p className="text-sm font-black text-slate-200 line-clamp-1">
                    {paslon2.wakil}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Stage Footer */}
      <footer className="text-center text-xs text-slate-500 py-1 border-t border-slate-800/60">
        Klik kartu pasangan calon untuk menandai giliran bicara • Tampilan LCD Layar Penuh Debat OSIS SMPN 4 Randangan
      </footer>

    </div>
  );
};
