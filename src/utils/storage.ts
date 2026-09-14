import { DebatInfo, PaslonData } from '../types';

export const DEFAULT_PASLON_01: PaslonData = {
  id: '01',
  nomor: '01',
  ketua: 'Muhammad Fadhil Pratama',
  wakil: 'Siti Nur Aisyah',
  slogan: 'AKSI NYATA: Amanah, Kreatif, Santun, dan Inovatif untuk SMPN 4 Randangan',
  visi: 'Mewujudkan OSIS SMP Negeri 4 Randangan Satu Atap sebagai wadah aspirasi siswa yang berakhlak mulia, cerdas, peduli lingkungan, dan berprestasi unggul.',
  misi: [
    'Meningkatkan keimanan dan ketakwaan melalui kegiatan keagamaan rutin sekolah.',
    'Menumbuhkan budaya literasi, kreativitas digital, dan bakat minat siswa.',
    'Menciptakan lingkungan sekolah yang bersih, hijau, ramah anak, dan bebas perundungan.',
    'Mengoptimalkan peran ekstrakurikuler serta mempererat kolaborasi antar kelas.'
  ],
  fotoPaslon: '',
  warnaTema: 'merah'
};

export const DEFAULT_PASLON_02: PaslonData = {
  id: '02',
  nomor: '02',
  ketua: 'Andika Rizky Pratama',
  wakil: 'Zahra Amelia Putri',
  slogan: 'BERSINAR: Berkarakter, Sinergis, Inspiratif, Adaptif, dan Responsif',
  visi: 'Membangun generasi OSIS yang mandiri, berkarakter Pancasila, aktif berinovasi, serta siap membawa nama harum sekolah di tingkat kabupaten dan provinsi.',
  misi: [
    'Memperkuat kedisiplinan dan sopan santun dengan program 5S (Senyum, Salam, Sapa, Sopan, Santun).',
    'Mengembangkan forum komunikasi terbuka kotak aspirasi siswa secara berkala.',
    'Menyelenggarakan kompetisi seni, olahraga, dan sains antar kelas yang kompetitif dan suportif.',
    'Membangun kepedulian sosial melalui aksi gotong royong dan bakti lingkungan sekolah.'
  ],
  fotoPaslon: '',
  warnaTema: 'navy'
};

export const DEFAULT_DEBAT_INFO: DebatInfo = {
  tema: 'Pemimpin Muda, OSIS Berintegritas, Sekolah Berkualitas',
  peserta: 'Pasangan Calon Ketua dan Wakil Ketua OSIS Periode 2026/2027',
  penyelenggara: 'Panitia Pemilihan OSIS (PPO) SMP Negeri 4 Randangan Satu Atap',
  tanggal: 'Senin, 14 September 2026',
  tempat: 'Aula Utama SMP Negeri 4 Randangan Satu Atap',
  moderator: 'Tim Pembina OSIS & Kesiswaan',
  sesiAktif: 'Sesi 1: Penyampaian Visi & Misi'
};

export const STORAGE_KEYS = {
  PASLON_01: 'debat_osis_paslon_01',
  PASLON_02: 'debat_osis_paslon_02',
  DEBAT_INFO: 'debat_osis_info',
  ADMIN_PIN: 'debat_osis_admin_pin',
  TIMER_SETTINGS: 'debat_osis_timer_settings'
};

export const DEFAULT_PIN = '1234';

export function loadStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    // Backward compatibility: migrate legacy fotoKetua/fotoWakil to fotoPaslon if present
    if (parsed && typeof parsed === 'object' && ('nomor' in parsed)) {
      const p = parsed as unknown as PaslonData;
      if (!p.fotoPaslon && (p.fotoKetua || p.fotoWakil)) {
        p.fotoPaslon = p.fotoKetua || p.fotoWakil || '';
      }
    }
    return parsed;
  } catch (err) {
    console.warn(`Error loading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

export function saveStoredData<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
    return false;
  }
}

export function compressAndEncodeImage(file: File, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
