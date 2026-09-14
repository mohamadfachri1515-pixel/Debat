import React from 'react';
import { Calendar, MapPin, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { DebatInfo } from '../types';

interface DebatInfoSectionProps {
  info: DebatInfo;
}

export const DebatInfoSection: React.FC<DebatInfoSectionProps> = ({ info }) => {
  return (
    <section id="informasi-debat" className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
                INFORMASI & TATA TERTIB DEBAT
              </h3>
              <p className="text-xs text-slate-400">
                Panduan resmi pelaksanaan debat calon pengurus OSIS
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            SMP Negeri 4 Randangan Satu Atap
          </span>
        </div>

        {/* Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Tema & Peserta */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-red-400 block mb-1">
                TEMA UTAMA DEBAT
              </span>
              <p className="text-sm sm:text-base font-bold text-white leading-snug">
                “{info.tema}”
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                PESERTA DEBAT
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-300">
                {info.peserta}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                SESI AKTIF
              </span>
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {info.sesiAktif || 'Sesi Tanya Jawab Terbuka'}
              </p>
            </div>
          </div>

          {/* Card 2: Waktu, Lokasi & Penyelenggara */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                  WAKTU PELAKSANAAN
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {info.tanggal}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
              <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                  TEMPAT / LOKASI
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {info.tempat}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
              <Award className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                  PENYELENGGARA & MODERATOR
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {info.penyelenggara}
                </p>
                <p className="text-[11px] text-slate-400">
                  Moderator: {info.moderator}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Aturan Waktu Singkat */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TATA TERTIB WAKTU</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Penyampaian visi misi: Maksimal 2 menit untuk setiap pasangan calon.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Tanya jawab antar paslon: 1 menit bertanya, 2 menit menjawab.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Peringatan bell berbunyi pada 5 detik terakhir sebelum waktu habis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Ketika bell "Waktu Habis" berbunyi, paslon wajib segera menghentikan pemaparan.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};
