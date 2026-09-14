import React, { useState, useRef } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Upload, 
  Trash2, 
  Lock, 
  Key, 
  Download, 
  User, 
  Users,
  Plus, 
  Minus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PaslonData, DebatInfo } from '../types';
import { compressAndEncodeImage } from '../utils/storage';
import { generateStandaloneOfflineHtml, downloadHtmlFile } from '../utils/exportHtml';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  paslon1: PaslonData;
  paslon2: PaslonData;
  info: DebatInfo;
  adminPin: string;
  onSaveData: (p1: PaslonData, p2: PaslonData, inf: DebatInfo) => void;
  onResetToDefaults: () => void;
  onUpdatePin: (newPin: string) => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void, isDestructive?: boolean) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  paslon1,
  paslon2,
  info,
  adminPin,
  onSaveData,
  onResetToDefaults,
  onUpdatePin,
  onRequestConfirm,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Editing tab
  const [activeTab, setActiveTab] = useState<'p1' | 'p2' | 'info' | 'pin'>('p1');

  // Form States cloned from props
  const [editP1, setEditP1] = useState<PaslonData>({ ...paslon1 });
  const [editP2, setEditP2] = useState<PaslonData>({ ...paslon2 });
  const [editInfo, setEditInfo] = useState<DebatInfo>({ ...info });

  // PIN change state
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string>('');

  // Upload feedback message
  const [uploadFeedback, setUploadFeedback] = useState<string>('');

  // Hidden file inputs for combined paslon photo (Ketua + Wakil)
  const p1PaslonFileRef = useRef<HTMLInputElement>(null);
  const p2PaslonFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setIsAuthenticated(true);
      setPinError('');
      // Sync form with current props
      setEditP1({ ...paslon1 });
      setEditP2({ ...paslon2 });
      setEditInfo({ ...info });
    } else {
      setPinError('PIN salah! Silakan coba lagi (Default: 1234).');
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
    onClose();
  };

  // Image Upload handler with Canvas Compression for single photo per paslon
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetPaslon: '01' | '02'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Format foto harus JPG, JPEG, PNG, atau WEBP.');
      return;
    }

    try {
      setUploadFeedback(`Mengunggah dan mengompresi foto Paslon ${targetPaslon}...`);
      const base64 = await compressAndEncodeImage(file, 800, 800);

      if (targetPaslon === '01') {
        setEditP1(prev => ({
          ...prev,
          fotoPaslon: base64,
          fotoKetua: '',
          fotoWakil: ''
        }));
      } else {
        setEditP2(prev => ({
          ...prev,
          fotoPaslon: base64,
          fotoKetua: '',
          fotoWakil: ''
        }));
      }
      setUploadFeedback(`Foto Paslon ${targetPaslon} berhasil dimuat! Klik 'Simpan Semua Perubahan' untuk menerapkan.`);
      setTimeout(() => setUploadFeedback(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses gambar. Pastikan file gambar tidak rusak.');
    }
  };

  const handleRemovePhoto = (targetPaslon: '01' | '02') => {
    onRequestConfirm(
      'Hapus Foto Pasangan Calon',
      `Apakah Anda yakin ingin menghapus foto pasangan calon Paslon ${targetPaslon}?`,
      () => {
        if (targetPaslon === '01') {
          setEditP1(prev => ({
            ...prev,
            fotoPaslon: '',
            fotoKetua: '',
            fotoWakil: ''
          }));
        } else {
          setEditP2(prev => ({
            ...prev,
            fotoPaslon: '',
            fotoKetua: '',
            fotoWakil: ''
          }));
        }
      },
      true
    );
  };

  // Misi list helpers
  const handleMisiChange = (targetPaslon: '01' | '02', index: number, value: string) => {
    if (targetPaslon === '01') {
      const newMisi = [...editP1.misi];
      newMisi[index] = value;
      setEditP1(prev => ({ ...prev, misi: newMisi }));
    } else {
      const newMisi = [...editP2.misi];
      newMisi[index] = value;
      setEditP2(prev => ({ ...prev, misi: newMisi }));
    }
  };

  const handleAddMisi = (targetPaslon: '01' | '02') => {
    if (targetPaslon === '01') {
      setEditP1(prev => ({ ...prev, misi: [...prev.misi, ''] }));
    } else {
      setEditP2(prev => ({ ...prev, misi: [...prev.misi, ''] }));
    }
  };

  const handleRemoveMisi = (targetPaslon: '01' | '02', index: number) => {
    if (targetPaslon === '01') {
      setEditP1(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));
    } else {
      setEditP2(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));
    }
  };

  // Save changes
  const handleSaveAll = () => {
    onSaveData(editP1, editP2, editInfo);
    setUploadFeedback('Semua perubahan berhasil disimpan ke LocalStorage!');
    setTimeout(() => {
      setUploadFeedback('');
      handleClose();
    }, 1000);
  };

  // Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN minimal 4 digit angka/karakter.');
      return;
    }
    if (newPin !== confirmNewPin) {
      alert('Konfirmasi PIN baru tidak sesuai!');
      return;
    }

    onUpdatePin(newPin);
    setPinSuccessMsg('PIN Admin berhasil diperbarui!');
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => setPinSuccessMsg(''), 4000);
  };

  // Reset to defaults
  const handleTriggerResetData = () => {
    onRequestConfirm(
      'Reset Data ke Pengaturan Awal',
      'Apakah Anda yakin ingin mengembalikan seluruh data (nama paslon, visi, misi, info) ke data default awal?',
      () => {
        onResetToDefaults();
        handleClose();
      },
      true
    );
  };

  // Download Standalone HTML
  const handleDownloadStandalone = () => {
    const htmlContent = generateStandaloneOfflineHtml(editP1, editP2, editInfo, adminPin);
    downloadHtmlFile(htmlContent, 'debat-osis-smpn4randangan-offline.html');
  };

  return (
    <div 
      id="admin-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="admin-modal-content"
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-800 text-red-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif] tracking-tight">
                PANEL ADMINISTRATOR DEBAT OSIS
              </h2>
              <p className="text-xs text-slate-400">
                SMP Negeri 4 Randangan Satu Atap
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-modal"
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTENT */}
        {!isAuthenticated ? (
          /* PIN LOGIN SCREEN */
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center shadow-inner">
              <Key className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Masukkan PIN Admin
              </h3>
              <p className="text-xs text-slate-400">
                Akses terbatas untuk panitia & guru pembina OSIS
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full space-y-4">
              <div>
                <input
                  id="input-admin-pin"
                  type="password"
                  maxLength={10}
                  placeholder="Ketik PIN (Default: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center text-xl tracking-widest font-mono font-bold bg-slate-950 border border-slate-700 rounded-2xl py-3 text-white focus:outline-none focus:border-red-500 shadow-inner"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs font-semibold text-red-400 mt-2">
                    {pinError}
                  </p>
                )}
              </div>

              <button
                id="btn-submit-pin"
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/50 transition active:scale-95 cursor-pointer"
              >
                BUKA PANEL ADMIN
              </button>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-left">
                ℹ️ <strong>Catatan:</strong> PIN bawaan adalah <code className="text-red-400 font-bold">1234</code>. Anda dapat mengubah PIN ini di dalam panel setelah masuk.
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN EDITING TABS */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/60 px-4 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('p1')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition cursor-pointer ${
                  activeTab === 'p1'
                    ? 'bg-slate-900 text-red-400 border-red-500/50 border-b-2 border-b-slate-900'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                🔴 Data Paslon 01
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('p2')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition cursor-pointer ${
                  activeTab === 'p2'
                    ? 'bg-slate-900 text-blue-400 border-blue-500/50 border-b-2 border-b-slate-900'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                🔵 Data Paslon 02
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-slate-900 text-amber-400 border-amber-500/50 border-b-2 border-b-slate-900'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                📋 Info Acara Debat
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pin')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition cursor-pointer ${
                  activeTab === 'pin'
                    ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 border-b-2 border-b-slate-900'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                🔑 Pengaturan PIN
              </button>
            </div>

            {/* Notification alert banner if present */}
            {uploadFeedback && (
              <div className="bg-emerald-950/80 border-b border-emerald-800/80 text-emerald-300 px-4 py-2 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadFeedback}</span>
              </div>
            )}

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB PASLON 01 */}
              {activeTab === 'p1' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-red-400 flex items-center gap-2">
                      <span>🔴 Edit Data Pasangan Calon 01</span>
                    </h4>
                    <span className="text-xs text-slate-400">Nomor Urut 01</span>
                  </div>

                  {/* Foto Bersama Pasangan Calon (1 Foto: Ketua + Wakil) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Foto Pasangan Calon 01 (1 Foto Bersama: Ketua & Wakil)
                      </span>
                      <span className="text-[11px] text-red-400 font-semibold">
                        Format: JPG, PNG, WEBP
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-40 sm:w-48 aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 relative group shadow-inner">
                        {(editP1.fotoPaslon || editP1.fotoKetua || editP1.fotoWakil) ? (
                          <img
                            src={editP1.fotoPaslon || editP1.fotoKetua || editP1.fotoWakil}
                            alt="Pasangan Calon 01"
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="text-center p-3">
                            <Users className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                            <span className="text-[11px] text-slate-500 block">Belum ada foto</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 flex-1 w-full sm:w-auto">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Unggah 1 foto resmi pasangan calon (Ketua dan Wakil Ketua OSIS berdampingan). Foto otomatis dikompresi agar hemat memori browser.
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          ref={p1PaslonFileRef}
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, '01')}
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => p1PaslonFileRef.current?.click()}
                            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center justify-center gap-2 border border-red-500 shadow-md shadow-red-950/50 cursor-pointer transition"
                          >
                            <Upload className="w-4 h-4" />
                            <span>UPLOAD 1 FOTO PASLON 01</span>
                          </button>
                          {(editP1.fotoPaslon || editP1.fotoKetua || editP1.fotoWakil) && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto('01')}
                              className="py-2.5 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 text-xs font-semibold text-red-300 flex items-center justify-center gap-1.5 border border-red-800/80 cursor-pointer transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>HAPUS FOTO</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nama Ketua & Wakil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Lengkap Calon Ketua
                      </label>
                      <input
                        type="text"
                        value={editP1.ketua}
                        onChange={(e) => setEditP1({ ...editP1, ketua: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Lengkap Calon Wakil
                      </label>
                      <input
                        type="text"
                        value={editP1.wakil}
                        onChange={(e) => setEditP1({ ...editP1, wakil: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Slogan */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Slogan Kampanye
                    </label>
                    <input
                      type="text"
                      value={editP1.slogan}
                      onChange={(e) => setEditP1({ ...editP1, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Visi */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Visi Calon
                    </label>
                    <textarea
                      rows={3}
                      value={editP1.visi}
                      onChange={(e) => setEditP1({ ...editP1, visi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Misi (Dynamic points) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 block">
                        Poin-Poin Misi
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddMisi('01')}
                        className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Misi
                      </button>
                    </div>
                    {editP1.misi.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          value={m}
                          onChange={(e) => handleMisiChange('01', idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                        />
                        {editP1.misi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMisi('01', idx)}
                            className="p-2 text-slate-500 hover:text-red-400 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB PASLON 02 */}
              {activeTab === 'p2' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-blue-400 flex items-center gap-2">
                      <span>🔵 Edit Data Pasangan Calon 02</span>
                    </h4>
                    <span className="text-xs text-slate-400">Nomor Urut 02</span>
                  </div>

                  {/* Foto Bersama Pasangan Calon (1 Foto: Ketua + Wakil) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Foto Pasangan Calon 02 (1 Foto Bersama: Ketua & Wakil)
                      </span>
                      <span className="text-[11px] text-blue-400 font-semibold">
                        Format: JPG, PNG, WEBP
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-40 sm:w-48 aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 relative group shadow-inner">
                        {(editP2.fotoPaslon || editP2.fotoKetua || editP2.fotoWakil) ? (
                          <img
                            src={editP2.fotoPaslon || editP2.fotoKetua || editP2.fotoWakil}
                            alt="Pasangan Calon 02"
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="text-center p-3">
                            <Users className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                            <span className="text-[11px] text-slate-500 block">Belum ada foto</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 flex-1 w-full sm:w-auto">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Unggah 1 foto resmi pasangan calon (Ketua dan Wakil Ketua OSIS berdampingan). Foto otomatis dikompresi agar hemat memori browser.
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          ref={p2PaslonFileRef}
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, '02')}
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => p2PaslonFileRef.current?.click()}
                            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-2 border border-blue-500 shadow-md shadow-blue-950/50 cursor-pointer transition"
                          >
                            <Upload className="w-4 h-4" />
                            <span>UPLOAD 1 FOTO PASLON 02</span>
                          </button>
                          {(editP2.fotoPaslon || editP2.fotoKetua || editP2.fotoWakil) && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto('02')}
                              className="py-2.5 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 text-xs font-semibold text-red-300 flex items-center justify-center gap-1.5 border border-red-800/80 cursor-pointer transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>HAPUS FOTO</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nama Ketua & Wakil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Lengkap Calon Ketua
                      </label>
                      <input
                        type="text"
                        value={editP2.ketua}
                        onChange={(e) => setEditP2({ ...editP2, ketua: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Nama Lengkap Calon Wakil
                      </label>
                      <input
                        type="text"
                        value={editP2.wakil}
                        onChange={(e) => setEditP2({ ...editP2, wakil: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Slogan */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Slogan Kampanye
                    </label>
                    <input
                      type="text"
                      value={editP2.slogan}
                      onChange={(e) => setEditP2({ ...editP2, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Visi */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Visi Calon
                    </label>
                    <textarea
                      rows={3}
                      value={editP2.visi}
                      onChange={(e) => setEditP2({ ...editP2, visi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Misi */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 block">
                        Poin-Poin Misi
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddMisi('02')}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Misi
                      </button>
                    </div>
                    {editP2.misi.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          value={m}
                          onChange={(e) => handleMisiChange('02', idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                        {editP2.misi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMisi('02', idx)}
                            className="p-2 text-slate-500 hover:text-red-400 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB INFO ACARA */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-amber-400">
                      📋 Pengaturan Informasi & Tata Tertib Debat
                    </h4>
                    <p className="text-xs text-slate-400">
                      Informasi ini akan ditampilkan pada bagian informasi debat halaman utama
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Tema Debat
                      </label>
                      <input
                        type="text"
                        value={editInfo.tema}
                        onChange={(e) => setEditInfo({ ...editInfo, tema: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Peserta
                        </label>
                        <input
                          type="text"
                          value={editInfo.peserta}
                          onChange={(e) => setEditInfo({ ...editInfo, peserta: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Sesi Debat Aktif
                        </label>
                        <input
                          type="text"
                          value={editInfo.sesiAktif}
                          onChange={(e) => setEditInfo({ ...editInfo, sesiAktif: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Tanggal & Waktu
                        </label>
                        <input
                          type="text"
                          value={editInfo.tanggal}
                          onChange={(e) => setEditInfo({ ...editInfo, tanggal: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Lokasi / Tempat
                        </label>
                        <input
                          type="text"
                          value={editInfo.tempat}
                          onChange={(e) => setEditInfo({ ...editInfo, tempat: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Penyelenggara
                        </label>
                        <input
                          type="text"
                          value={editInfo.penyelenggara}
                          onChange={(e) => setEditInfo({ ...editInfo, penyelenggara: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Moderator
                        </label>
                        <input
                          type="text"
                          value={editInfo.moderator}
                          onChange={(e) => setEditInfo({ ...editInfo, moderator: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB GANTI PIN */}
              {activeTab === 'pin' && (
                <div className="max-w-md space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-emerald-400">
                      🔑 Ganti PIN Keamanan Admin
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ganti PIN bawaan (1234) dengan kombinasi rahasia baru
                    </p>
                  </div>

                  {pinSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 font-bold">
                      {pinSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleChangePin} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        PIN Baru (Minimal 4 karakter)
                      </label>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Contoh: 5678"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Ulangi PIN Baru
                      </label>
                      <input
                        type="password"
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Ulangi PIN baru"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider transition cursor-pointer"
                    >
                      SIMPAN PIN BARU
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Actions Toolbar */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Reset Data Button */}
                <button
                  id="btn-reset-data-admin"
                  type="button"
                  onClick={handleTriggerResetData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 hover:border-red-800"
                  title="Kembalikan semua data ke pengaturan awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🔄 RESET DATA</span>
                </button>

                {/* Download Standalone Offline File */}
                <button
                  id="btn-download-html"
                  type="button"
                  onClick={handleDownloadStandalone}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                  title="Unduh 1 file HTML mandiri untuk disimpan di flashdisk & dibuka offline di Windows Chrome"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Unduh File HTML Offline</span>
                </button>
              </div>

              {/* SAVE CHANGES BUTTON */}
              <button
                id="btn-save-changes-admin"
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/60 border border-red-400/40 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>💾 SIMPAN PERUBAHAN</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
