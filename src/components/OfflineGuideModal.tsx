import React from 'react';
import { X, Download, Monitor, CheckCircle, FolderCheck, Chrome } from 'lucide-react';
import { PaslonData, DebatInfo } from '../types';
import { generateStandaloneOfflineHtml, downloadHtmlFile } from '../utils/exportHtml';

interface OfflineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  paslon1: PaslonData;
  paslon2: PaslonData;
  info: DebatInfo;
  adminPin: string;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({
  isOpen,
  onClose,
  paslon1,
  paslon2,
  info,
  adminPin,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const html = generateStandaloneOfflineHtml(paslon1, paslon2, info, adminPin);
    downloadHtmlFile(html, 'debat-osis-smpn4randangan.html');
  };

  return (
    <div 
      id="offline-guide-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="offline-guide-box"
        className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-800 text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                PANDUAN MENJALANKAN DI WINDOWS SECARA OFFLINE
              </h3>
              <p className="text-xs text-slate-400">
                Cara menyimpan dan membuka file langsung di Google Chrome tanpa internet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-white text-base">Unduh File Siap Pakai (.html)</h4>
              <p className="text-xs text-cyan-200 mt-0.5">
                File tunggal berisi seluruh script timer, audio bel, foto paslon, dan desain responsif.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Sekarang</span>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-base flex items-center gap-2">
              <FolderCheck className="w-5 h-5 text-emerald-400" />
              <span>Langkah Menjalankan di Laptop / Komputer Sekolah:</span>
            </h4>

            <ol className="space-y-3 pl-2">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-red-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  1
                </span>
                <div>
                  <strong className="text-white">Simpan File:</strong> Unduh file di atas atau simpan file bernama <code className="text-amber-300 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">index.html</code> ke folder dokumen laptop Anda atau ke Flashdisk USB.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-red-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  2
                </span>
                <div>
                  <strong className="text-white">Buka dengan Google Chrome:</strong> Klik kanan pada file tersebut di File Explorer Windows → pilih <strong className="text-cyan-300">Open with</strong> → klik <strong className="text-cyan-300">Google Chrome</strong> (atau Microsoft Edge). Anda juga bisa langsung klik dua kali (double-click) file tersebut.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-red-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  3
                </span>
                <div>
                  <strong className="text-white">Hubungkan ke LCD Proyektor:</strong> Tekan tombol <kbd className="px-1.5 py-0.5 bg-slate-950 rounded text-xs border border-slate-700 font-mono text-amber-300">Windows + P</kbd> pada keyboard laptop → pilih <strong className="text-white">Duplicate</strong> atau <strong className="text-white">Extend</strong>.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-red-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  4
                </span>
                <div>
                  <strong className="text-white">Gunakan Layar Penuh (Fullscreen):</strong> Klik tombol <strong className="text-red-400">⛶ Fullscreen</strong> atau tekan tombol <kbd className="px-1.5 py-0.5 bg-slate-950 rounded text-xs border border-slate-700 font-mono text-amber-300">F11</kbd> di browser agar tampilan bersih tanpa address bar browser.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-red-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  5
                </span>
                <div>
                  <strong className="text-white">Gunakan Mode Debat:</strong> Klik tombol <strong className="text-red-400">🎤 MODE DEBAT</strong> ketika sesi perdebatan dimulai agar stopwatch tampil sangat besar dan nama/foto kedua paslon terlihat jelas bagi seluruh audiens dan dewan juri.
                </div>
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>
              100% Offline: Tidak membutuhkan koneksi internet, tidak membutuhkan server lokal khusus seperti XAMPP atau Node.js. Langsung jalan di browser modern mana pun!
            </span>
          </div>

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            TUTUP PANDUAN
          </button>
        </div>
      </div>
    </div>
  );
};
