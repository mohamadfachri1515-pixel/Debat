export interface PaslonData {
  id: '01' | '02';
  nomor: '01' | '02';
  ketua: string;
  wakil: string;
  slogan: string;
  visi: string;
  misi: string[];
  fotoPaslon: string; // Base64 data URL foto bersama Ketua & Wakil
  fotoKetua?: string; // Legacy fallback
  fotoWakil?: string; // Legacy fallback
  warnaTema: 'merah' | 'navy';
}

export interface DebatInfo {
  tema: string;
  peserta: string;
  penyelenggara: string;
  tanggal: string;
  tempat: string;
  moderator: string;
  sesiAktif: string;
}

export type TimerMode = 'stopwatch' | 'timer';
export type TimerStatus = 'stopped' | 'running' | 'paused';
export type ActiveSpeaker = 'neutral' | '01' | '02';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}
