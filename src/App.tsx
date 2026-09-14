/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PaslonData, DebatInfo, ActiveSpeaker, ConfirmDialogState } from './types';
import { 
  DEFAULT_PASLON_01, 
  DEFAULT_PASLON_02, 
  DEFAULT_DEBAT_INFO, 
  STORAGE_KEYS, 
  DEFAULT_PIN, 
  loadStoredData, 
  saveStoredData 
} from './utils/storage';
import { sounds } from './utils/audio';

import { BackgroundMerahPutih } from './components/BackgroundMerahPutih';
import { Header } from './components/Header';
import { StopwatchSection } from './components/StopwatchSection';
import { PaslonCard } from './components/PaslonCard';
import { DebatInfoSection } from './components/DebatInfoSection';
import { DebatStageMode } from './components/DebatStageMode';
import { AdminModal } from './components/AdminModal';
import { ConfirmModal } from './components/ConfirmModal';
import { OfflineGuideModal } from './components/OfflineGuideModal';
import { Footer } from './components/Footer';

export default function App() {
  // Application Data States
  const [paslon1, setPaslon1] = useState<PaslonData>(() => 
    loadStoredData<PaslonData>(STORAGE_KEYS.PASLON_01, DEFAULT_PASLON_01)
  );

  const [paslon2, setPaslon2] = useState<PaslonData>(() => 
    loadStoredData<PaslonData>(STORAGE_KEYS.PASLON_02, DEFAULT_PASLON_02)
  );

  const [info, setInfo] = useState<DebatInfo>(() => 
    loadStoredData<DebatInfo>(STORAGE_KEYS.DEBAT_INFO, DEFAULT_DEBAT_INFO)
  );

  const [adminPin, setAdminPin] = useState<string>(() => 
    loadStoredData<string>(STORAGE_KEYS.ADMIN_PIN, DEFAULT_PIN)
  );

  // App Modes & Navigation States
  const [isDebateMode, setIsDebateMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeSpeaker, setActiveSpeaker] = useState<ActiveSpeaker>('neutral');

  // Modal Dialog States
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isOfflineGuideOpen, setIsOfflineGuideOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Track fullscreen changes from ESC key or browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Save changes to localStorage whenever core data changes
  const handleSaveData = (newP1: PaslonData, newP2: PaslonData, newInfo: DebatInfo) => {
    setPaslon1(newP1);
    setPaslon2(newP2);
    setInfo(newInfo);
    saveStoredData(STORAGE_KEYS.PASLON_01, newP1);
    saveStoredData(STORAGE_KEYS.PASLON_02, newP2);
    saveStoredData(STORAGE_KEYS.DEBAT_INFO, newInfo);
  };

  const handleUpdatePin = (newPin: string) => {
    setAdminPin(newPin);
    saveStoredData(STORAGE_KEYS.ADMIN_PIN, newPin);
  };

  const handleResetToDefaults = () => {
    setPaslon1(DEFAULT_PASLON_01);
    setPaslon2(DEFAULT_PASLON_02);
    setInfo(DEFAULT_DEBAT_INFO);
    setAdminPin(DEFAULT_PIN);
    saveStoredData(STORAGE_KEYS.PASLON_01, DEFAULT_PASLON_01);
    saveStoredData(STORAGE_KEYS.PASLON_02, DEFAULT_PASLON_02);
    saveStoredData(STORAGE_KEYS.DEBAT_INFO, DEFAULT_DEBAT_INFO);
    saveStoredData(STORAGE_KEYS.ADMIN_PIN, DEFAULT_PIN);
  };

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen API may be blocked in some iframe contexts
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) {
      sounds.playClick();
    }
  };

  // Trigger confirmation dialog helper
  const openConfirm = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    isDestructive: boolean = false
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      isDestructive,
    });
  };

  // Stopwatch reset confirmation handler
  const handleStopwatchResetRequest = () => {
    openConfirm(
      'Reset Waktu Stopwatch / Timer',
      'Apakah Anda yakin ingin mereset waktu ke awal?',
      () => {
        window.dispatchEvent(new CustomEvent('app-reset-timer'));
      },
      true
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Animated Merah-Putih Background */}
      <BackgroundMerahPutih />

      {/* Conditionally Render Mode Debat OR Normal Homepage */}
      {isDebateMode ? (
        <DebatStageMode
          paslon1={paslon1}
          paslon2={paslon2}
          info={info}
          activeSpeaker={activeSpeaker}
          onSelectSpeaker={setActiveSpeaker}
          onExitDebateMode={() => {
            sounds.playClick();
            setIsDebateMode(false);
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onResetRequest={handleStopwatchResetRequest}
        />
      ) : (
        /* NORMAL HOMEPAGE LAYOUT */
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* 1. HEADER UTAMA */}
            <Header
              onOpenAdmin={() => {
                sounds.playClick();
                setIsAdminOpen(true);
              }}
              onToggleDebateMode={() => {
                sounds.playClick();
                setIsDebateMode(true);
              }}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
            />

            {/* 2 & 3. ARENA DEBAT: PASLON 01 — TIMER DEBAT (TENGAH) — PASLON 02 */}
            <section id="arena-debat-section" className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-red-950/70 border border-red-800/60 text-red-300">
                  PANGGUNG UTAMA DEBAT KANDIDAT OSIS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif] mt-2">
                  PASANGAN CALON 01 <span className="text-red-500">VS</span> PASANGAN CALON 02
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
                  Hitungan mundur waktu debat diatur di tengah panggung dengan indikator giliran bicara otomatis
                </p>
              </div>

              {/* 3-Column Layout: Paslon 01 on Left, Timer in the Center, Paslon 02 on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* KIRI: Paslon 01 */}
                <div className="order-1 lg:col-span-4 h-full">
                  <PaslonCard
                    paslon={paslon1}
                    isActiveSpeaker={activeSpeaker === '01'}
                    onSelectSpeaker={() => setActiveSpeaker('01')}
                  />
                </div>

                {/* TENGAH: Stopwatch & Timer Debat */}
                <div className="order-2 lg:col-span-4 h-full flex flex-col justify-start">
                  <StopwatchSection
                    onResetRequest={handleStopwatchResetRequest}
                    activeSpeaker={activeSpeaker}
                    onSelectSpeaker={setActiveSpeaker}
                    isCenterLayout={true}
                  />
                </div>

                {/* KANAN: Paslon 02 */}
                <div className="order-3 lg:col-span-4 h-full">
                  <PaslonCard
                    paslon={paslon2}
                    isActiveSpeaker={activeSpeaker === '02'}
                    onSelectSpeaker={() => setActiveSpeaker('02')}
                  />
                </div>
              </div>
            </section>

            {/* 4. INFORMASI DEBAT */}
            <DebatInfoSection info={info} />
          </div>

          {/* 5. FOOTER */}
          <Footer
            onOpenAdmin={() => {
              sounds.playClick();
              setIsAdminOpen(true);
            }}
            onOpenOfflineGuide={() => {
              sounds.playClick();
              setIsOfflineGuideOpen(true);
            }}
          />
        </div>
      )}

      {/* ADMIN PANEL MODAL */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        paslon1={paslon1}
        paslon2={paslon2}
        info={info}
        adminPin={adminPin}
        onSaveData={handleSaveData}
        onResetToDefaults={handleResetToDefaults}
        onUpdatePin={handleUpdatePin}
        onRequestConfirm={openConfirm}
      />

      {/* CONFIRMATION DIALOG MODAL */}
      <ConfirmModal
        state={confirmDialog}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* OFFLINE USAGE GUIDE MODAL */}
      <OfflineGuideModal
        isOpen={isOfflineGuideOpen}
        onClose={() => setIsOfflineGuideOpen(false)}
        paslon1={paslon1}
        paslon2={paslon2}
        info={info}
        adminPin={adminPin}
      />
    </div>
  );
}
