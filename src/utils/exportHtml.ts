import { DebatInfo, PaslonData } from '../types';

export function generateStandaloneOfflineHtml(
  paslon1: PaslonData,
  paslon2: PaslonData,
  info: DebatInfo,
  adminPin: string
): string {
  // Generates a 100% self-contained single-file HTML document
  // containing all embedded styles, inline svg, Web Audio API buzzer, and Javascript logic.
  // Can be saved and opened directly in Google Chrome / Edge on Windows without internet.
  
  const paslon1Json = JSON.stringify(paslon1).replace(/<\/script>/g, '<\\/script>');
  const paslon2Json = JSON.stringify(paslon2).replace(/<\/script>/g, '<\\/script>');
  const infoJson = JSON.stringify(info).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debat OSIS SMPN 4 Randangan Satu Atap (Offline Version)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0f19;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }
    .bg-gradient-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-bottom: 2px solid #dc2626;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem; }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 0.75rem;
      border: 1px solid #334155;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #f8fafc;
      background: #1e293b;
      transition: all 0.2s;
      font-size: 0.875rem;
    }
    .btn:hover { background: #334155; }
    .btn-red { background: linear-gradient(135deg, #dc2626, #b91c1c); border-color: #ef4444; }
    .btn-red:hover { background: #dc2626; }
    .btn-green { background: linear-gradient(135deg, #16a34a, #15803d); border-color: #22c55e; }
    .btn-amber { background: linear-gradient(135deg, #d97706, #b45309); border-color: #f59e0b; }
    
    /* Stopwatch Styling */
    .stopwatch-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 1.5rem;
      padding: 2rem 1.5rem;
      text-align: center;
      margin: 1.5rem 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .clock-digits {
      font-family: "Courier New", Courier, monospace;
      font-size: clamp(3.5rem, 8vw, 6.5rem);
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -2px;
      margin: 1rem 0;
      text-shadow: 0 0 20px rgba(255,255,255,0.2);
    }
    .clock-urgent { color: #f59e0b; text-shadow: 0 0 30px rgba(245, 158, 11, 0.6); }
    .clock-timeup { color: #ef4444; text-shadow: 0 0 35px rgba(239, 68, 68, 0.8); animation: pulse 0.5s infinite; }
    
    /* 3-Column Arena Grid */
    .arena-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin: 1.5rem 0;
      align-items: start;
    }
    @media (min-width: 992px) {
      .arena-grid {
        grid-template-columns: 1fr 1.2fr 1fr;
      }
    }
    .card-paslon {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 1.5rem;
      padding: 1.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-paslon-01 { border-top: 4px solid #dc2626; }
    .card-paslon-02 { border-top: 4px solid #2563eb; }
    .badge-no {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 0.6rem;
      font-weight: 900;
      font-size: 1.25rem;
      color: #fff;
    }
    .badge-01 { background: #dc2626; }
    .badge-02 { background: #2563eb; }
    .photo-frame {
      aspect-ratio: 16/11;
      background: #030712;
      border-radius: 1rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #1f2937;
      margin-bottom: 0.75rem;
    }
    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
    .names-box {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .names-box-row {
      margin-bottom: 0.35rem;
    }
    .names-box-row:last-child { margin-bottom: 0; }
    .role-label {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: none; align-items: center; justify-content: center; z-index: 9999; padding: 1rem;
    }
    .modal-box {
      background: #0f172a; border: 1px solid #334155; border-radius: 1.25rem;
      padding: 1.5rem; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;
    }
    input, textarea {
      width: 100%; padding: 0.6rem; background: #020617; border: 1px solid #334155;
      color: #fff; border-radius: 0.5rem; margin-top: 0.25rem; margin-bottom: 0.75rem;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="bg-gradient-header">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="font-size: 0.75rem; color: #f87171; font-weight: 700; letter-spacing: 2px;">🇮🇩 SMP NEGERI 4 RANDANGAN SATU ATAP</div>
        <h1 style="font-size: 1.5rem; font-weight: 900; color: #fff;">DEBAT CALON KETUA & WAKIL KETUA OSIS</h1>
        <div style="font-size: 0.875rem; color: #cbd5e1; font-style: italic;">“Demokrasi Dimulai dari Sekolah”</div>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-red" onclick="toggleFullscreen()">⛶ Fullscreen</button>
        <button class="btn" onclick="openAdminModal()">⚙ Admin</button>
      </div>
    </div>
  </div>

  <div class="container">
    <!-- 3-Column Arena Grid: Paslon 01 (Kiri) - Timer Debat (Tengah) - Paslon 02 (Kanan) -->
    <div class="arena-grid">
      
      <!-- Paslon 01 (Kiri) -->
      <div class="card-paslon card-paslon-01">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="badge-no badge-01">01</span>
            <span style="font-weight: 800; color: #f87171;">PASLON NOMOR URUT 01</span>
          </div>

          <!-- 1 Foto Resmi Pasangan Calon 01 -->
          <div class="photo-frame" id="foto-01-container">
            <span style="color:#64748b; font-size: 0.85rem; font-weight: 600;">Foto Pasangan Calon 01</span>
          </div>

          <!-- Nama Ketua & Wakil -->
          <div class="names-box">
            <div class="names-box-row">
              <div class="role-label" style="color: #f87171;">Calon Ketua:</div>
              <p id="nama-01-ketua" style="font-weight: 800; font-size: 0.95rem; color: #fff;"></p>
            </div>
            <div class="names-box-row" style="margin-top: 0.4rem; border-top: 1px solid #1f2937; padding-top: 0.35rem;">
              <div class="role-label" style="color: #94a3b8;">Calon Wakil:</div>
              <p id="nama-01-wakil" style="font-weight: 800; font-size: 0.95rem; color: #e2e8f0;"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- TIMER DEBAT (TENGAH) -->
      <div class="stopwatch-card" style="margin: 0;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #ef4444; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.5rem;">
          ⏱ TIMER PANGGUNG DEBAT
        </div>

        <div style="display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <button class="btn" onclick="setTimerPreset(60)">1 Mnt</button>
          <button class="btn" onclick="setTimerPreset(120)">2 Mnt</button>
          <button class="btn" onclick="setTimerPreset(180)">3 Mnt</button>
          <button class="btn" onclick="setTimerPreset(300)">5 Mnt</button>
        </div>

        <div class="clock-digits" id="timer-display">02:00</div>
        
        <div id="time-up-banner" style="display: none; background: #dc2626; color: #fff; font-weight: 900; padding: 0.5rem; border-radius: 0.5rem; font-size: 1.25rem; margin-bottom: 1rem;">
          ⚠️ WAKTU HABIS! ⚠️
        </div>

        <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-green" id="btn-start" onclick="startTimer()">▶ START</button>
          <button class="btn btn-amber" id="btn-pause" onclick="pauseTimer()" style="display:none;">⏸ PAUSE</button>
          <button class="btn" onclick="confirmResetTimer()">🔄 RESET</button>
        </div>
      </div>

      <!-- Paslon 02 (Kanan) -->
      <div class="card-paslon card-paslon-02">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="badge-no badge-02">02</span>
            <span style="font-weight: 800; color: #60a5fa;">PASLON NOMOR URUT 02</span>
          </div>

          <!-- 1 Foto Resmi Pasangan Calon 02 -->
          <div class="photo-frame" id="foto-02-container">
            <span style="color:#64748b; font-size: 0.85rem; font-weight: 600;">Foto Pasangan Calon 02</span>
          </div>

          <!-- Nama Ketua & Wakil -->
          <div class="names-box">
            <div class="names-box-row">
              <div class="role-label" style="color: #60a5fa;">Calon Ketua:</div>
              <p id="nama-02-ketua" style="font-weight: 800; font-size: 0.95rem; color: #fff;"></p>
            </div>
            <div class="names-box-row" style="margin-top: 0.4rem; border-top: 1px solid #1f2937; padding-top: 0.35rem;">
              <div class="role-label" style="color: #94a3b8;">Calon Wakil:</div>
              <p id="nama-02-wakil" style="font-weight: 800; font-size: 0.95rem; color: #e2e8f0;"></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>
    let p1 = ${paslon1Json};
    let p2 = ${paslon2Json};
    let inf = ${infoJson};
    let adminPin = "${adminPin}";

    // Load from LocalStorage if available
    try {
      const sp1 = localStorage.getItem('debat_osis_paslon_01');
      if (sp1) p1 = JSON.parse(sp1);
      const sp2 = localStorage.getItem('debat_osis_paslon_02');
      if (sp2) p2 = JSON.parse(sp2);
    } catch(e){}

    function renderUI() {
      const elKetua1 = document.getElementById('nama-01-ketua');
      if (elKetua1) elKetua1.innerText = p1.ketua;
      const elWakil1 = document.getElementById('nama-01-wakil');
      if (elWakil1) elWakil1.innerText = p1.wakil;
      const f1 = p1.fotoPaslon || p1.fotoKetua || p1.fotoWakil;
      const elFoto1 = document.getElementById('foto-01-container');
      if (f1 && elFoto1) {
        elFoto1.innerHTML = '<img src="' + f1 + '" alt="Pasangan Calon 01">';
      }

      const elKetua2 = document.getElementById('nama-02-ketua');
      if (elKetua2) elKetua2.innerText = p2.ketua;
      const elWakil2 = document.getElementById('nama-02-wakil');
      if (elWakil2) elWakil2.innerText = p2.wakil;
      const f2 = p2.fotoPaslon || p2.fotoKetua || p2.fotoWakil;
      const elFoto2 = document.getElementById('foto-02-container');
      if (f2 && elFoto2) {
        elFoto2.innerHTML = '<img src="' + f2 + '" alt="Pasangan Calon 02">';
      }
    }
    renderUI();

    // Timer Logic
    let totalSec = 120;
    let remSec = 120;
    let isRunning = false;
    let startTime = 0;
    let timerInterval = null;

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
    }

    function updateDisplay() {
      const el = document.getElementById('timer-display');
      el.innerText = formatTime(remSec);
      if (remSec === 0) {
        el.className = 'clock-digits clock-timeup';
        document.getElementById('time-up-banner').style.display = 'block';
      } else if (remSec <= 10) {
        el.className = 'clock-digits clock-urgent';
        document.getElementById('time-up-banner').style.display = 'none';
      } else {
        el.className = 'clock-digits';
        document.getElementById('time-up-banner').style.display = 'none';
      }
    }

    function startTimer() {
      if (isRunning) return;
      isRunning = true;
      document.getElementById('btn-start').style.display = 'none';
      document.getElementById('btn-pause').style.display = 'inline-flex';
      startTime = Date.now();
      const initialRem = remSec;
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        remSec = Math.max(0, initialRem - elapsed);
        updateDisplay();
        if (remSec === 0) {
          pauseTimer();
          playBuzzer();
        }
      }, 200);
    }

    function pauseTimer() {
      isRunning = false;
      clearInterval(timerInterval);
      document.getElementById('btn-start').style.display = 'inline-flex';
      document.getElementById('btn-pause').style.display = 'none';
    }

    function confirmResetTimer() {
      if (confirm('Apakah Anda yakin ingin mereset waktu?')) {
        pauseTimer();
        remSec = totalSec;
        updateDisplay();
      }
    }

    function setTimerPreset(sec) {
      pauseTimer();
      totalSec = sec;
      remSec = sec;
      updateDisplay();
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    function playBuzzer() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } catch(e){}
    }

    function openAdminModal() {
      const pin = prompt('Masukkan PIN Admin:');
      if (pin === adminPin) {
        alert('Untuk mengedit data lengkap, silakan buka aplikasi versi penuh di web browser atau hubungi tim IT.');
      } else if (pin !== null) {
        alert('PIN Salah!');
      }
    }
  </script>
</body>
</html>`;
}

export function downloadHtmlFile(content: string, filename = 'debat-osis-smpn4randangan.html') {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
