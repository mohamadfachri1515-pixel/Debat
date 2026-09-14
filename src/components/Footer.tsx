import React from 'react';
import { Settings, Shield, Download } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenOfflineGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenOfflineGuide }) => {
  return (
    <footer id="main-footer" className="mt-16 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl">🇮🇩</span>
              <h4 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif] tracking-tight">
                DEBAT CALON KETUA DAN WAKIL KETUA OSIS
              </h4>
            </div>

            <p className="text-sm font-bold text-red-400">
              SMP NEGERI 4 RANDANGAN SATU ATAP
            </p>

            <p className="text-xs sm:text-sm italic text-slate-400">
              “Demokrasi Dimulai dari Sekolah”
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenOfflineGuide}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panduan Buka Offline (Windows)</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Panel Panitia</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Sistem Pemilihan Umum OSIS Bersih, Jujur, Adil & Transparan</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
          © 2026 SMP Negeri 4 Randangan Satu Atap. Dirancang khusus untuk proyektor LCD & layar presentasi sidang debat.
        </div>
      </div>
    </footer>
  );
};
