import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { TimerMode, TimerStatus, ActiveSpeaker } from '../types';
import { sounds } from '../utils/audio';

interface StopwatchSectionProps {
  onResetRequest: () => void;
  activeSpeaker: ActiveSpeaker;
  onSelectSpeaker: (speaker: ActiveSpeaker) => void;
  isCompact?: boolean;
  isCenterLayout?: boolean;
}

export const StopwatchSection: React.FC<StopwatchSectionProps> = ({
  onResetRequest,
  activeSpeaker,
  onSelectSpeaker,
  isCompact = false,
  isCenterLayout = false,
}) => {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const [targetDuration, setTargetDuration] = useState<number>(120); // default 2 minutes (120s)
  const [remainingTime, setRemainingTime] = useState<number>(120); // in seconds
  const [elapsedTime, setElapsedTime] = useState<number>(0); // in seconds (for stopwatch)
  const [customMinutes, setCustomMinutes] = useState<string>('2');
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // High precision timing references
  const startTimeRef = useRef<number>(0);
  const pausedRemainingRef = useRef<number>(120);
  const pausedElapsedRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSecondRef = useRef<number>(-1);

  // Time preset definitions in seconds
  const presets = [
    { label: '1 Menit', seconds: 60 },
    { label: '2 Menit', seconds: 120 },
    { label: '3 Menit', seconds: 180 },
    { label: '5 Menit', seconds: 300 },
    { label: '10 Menit', seconds: 600 },
  ];

  // Helper to format seconds into MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const isNegative = totalSeconds < 0;
    const absSeconds = Math.abs(Math.floor(totalSeconds));
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = absSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      const formattedHours = String(hours).padStart(2, '0');
      return `${isNegative ? '-' : ''}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${isNegative ? '-' : ''}${formattedMinutes}:${formattedSeconds}`;
  };

  // Milliseconds fraction (for professional visual timer precision)
  const getMillisFraction = (timeSec: number) => {
    const fractional = Math.abs(timeSec) % 1;
    return Math.floor(fractional * 10);
  };

  // Handle precision animation loop using performance.now
  const tick = useCallback(() => {
    const now = performance.now();
    const delta = (now - startTimeRef.current) / 1000;

    if (mode === 'timer') {
      const currentRem = Math.max(0, pausedRemainingRef.current - delta);
      setRemainingTime(currentRem);

      const wholeSecond = Math.ceil(currentRem);
      // Countdown sound triggers on last 5 seconds (5, 4, 3, 2, 1)
      if (wholeSecond <= 5 && wholeSecond > 0 && wholeSecond !== lastSecondRef.current) {
        lastSecondRef.current = wholeSecond;
        sounds.playWarningBeep();
      }

      if (currentRem <= 0) {
        setStatus('stopped');
        setIsTimeUp(true);
        sounds.playTimeUpBuzzer();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        return;
      }
    } else {
      // Stopwatch mode: counting up
      const currentEl = pausedElapsedRef.current + delta;
      setElapsedTime(currentEl);
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, [mode]);

  useEffect(() => {
    if (status === 'running') {
      startTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, tick]);

  const handleStart = () => {
    sounds.playClick();
    setIsTimeUp(false);
    lastSecondRef.current = -1;

    if (mode === 'timer') {
      if (remainingTime <= 0) {
        pausedRemainingRef.current = targetDuration;
        setRemainingTime(targetDuration);
      } else {
        pausedRemainingRef.current = remainingTime;
      }
    } else {
      pausedElapsedRef.current = elapsedTime;
    }

    setStatus('running');
  };

  const handlePause = () => {
    sounds.playClick();
    if (status === 'running') {
      const now = performance.now();
      const delta = (now - startTimeRef.current) / 1000;
      if (mode === 'timer') {
        pausedRemainingRef.current = Math.max(0, pausedRemainingRef.current - delta);
        setRemainingTime(pausedRemainingRef.current);
      } else {
        pausedElapsedRef.current = pausedElapsedRef.current + delta;
        setElapsedTime(pausedElapsedRef.current);
      }
      setStatus('paused');
    }
  };

  // Internal reset execution
  const executeReset = () => {
    sounds.playClick();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setStatus('stopped');
    setIsTimeUp(false);
    lastSecondRef.current = -1;

    if (mode === 'timer') {
      setRemainingTime(targetDuration);
      pausedRemainingRef.current = targetDuration;
    } else {
      setElapsedTime(0);
      pausedElapsedRef.current = 0;
    }
  };

  // Trigger parent confirmation dialog before resetting
  const handleResetClick = () => {
    // If timer is already at initial state, reset directly without disturbing modal
    const isAlreadyAtZero = (mode === 'stopwatch' && elapsedTime === 0) || 
      (mode === 'timer' && remainingTime === targetDuration && status === 'stopped' && !isTimeUp);
    
    if (isAlreadyAtZero) {
      executeReset();
    } else {
      onResetRequest();
    }
  };

  // Expose reset execution to parent (attached via window event or ref)
  useEffect(() => {
    const handleTrigger = () => executeReset();
    window.addEventListener('app-reset-timer', handleTrigger);
    return () => window.removeEventListener('app-reset-timer', handleTrigger);
  });

  const handlePresetSelect = (sec: number) => {
    sounds.playClick();
    setTargetDuration(sec);
    setRemainingTime(sec);
    pausedRemainingRef.current = sec;
    setStatus('stopped');
    setIsTimeUp(false);
  };

  const handleCustomMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMinutes(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const sec = Math.round(num * 60);
      setTargetDuration(sec);
      if (status !== 'running') {
        setRemainingTime(sec);
        pausedRemainingRef.current = sec;
        setIsTimeUp(false);
      }
    }
  };

  const switchMode = (newMode: TimerMode) => {
    sounds.playClick();
    setStatus('stopped');
    setMode(newMode);
    setIsTimeUp(false);
    if (newMode === 'timer') {
      setRemainingTime(targetDuration);
      pausedRemainingRef.current = targetDuration;
    } else {
      setElapsedTime(0);
      pausedElapsedRef.current = 0;
    }
  };

  const displayTime = mode === 'timer' ? remainingTime : elapsedTime;
  const isUrgent = mode === 'timer' && remainingTime <= 10 && remainingTime > 0 && status === 'running';

  return (
    <section 
      id="stopwatch-section" 
      aria-label="Waktu Debat"
      className={`relative mx-auto w-full transition-all duration-300 ${
        isCenterLayout 
          ? 'h-full flex flex-col justify-between' 
          : isCompact 
            ? 'max-w-4xl py-2' 
            : 'max-w-5xl my-6 px-4 sm:px-6'
      }`}
    >
      {/* Outer Card Container with Projector Glow */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isCenterLayout ? 'h-full flex flex-col justify-between' : ''
      } ${
        isTimeUp 
          ? 'border-red-500 bg-red-950/70 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse'
          : isUrgent
            ? 'border-amber-500 bg-slate-900/90 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
            : 'border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md'
      }`}>
        
        {/* Subtle Top Red-White Glow Line */}
        <div className={`h-1.5 w-full ${
          isTimeUp 
            ? 'bg-red-500 animate-pulse' 
            : isUrgent 
              ? 'bg-amber-400 animate-pulse' 
              : 'bg-gradient-to-r from-red-600 via-white to-red-600'
        }`} />

        <div className={`p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between ${isCenterLayout ? 'space-y-4' : ''}`}>
          
          {/* Header Controls: Mode Selector & Active Speaker Indicator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-800">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-950/70 border border-slate-800 justify-center">
              <button
                id="btn-mode-timer"
                type="button"
                onClick={() => switchMode('timer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'timer'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>TIMER</span>
              </button>

              <button
                id="btn-mode-stopwatch"
                type="button"
                onClick={() => switchMode('stopwatch')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'stopwatch'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>STOPWATCH</span>
              </button>
            </div>

            {/* Speaker Turn Selector for LCD Debat Stage */}
            <div className="flex items-center justify-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 px-1.5 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-slate-300" />
                <span>Mic:</span>
              </span>
              <button
                type="button"
                onClick={() => { sounds.playClick(); onSelectSpeaker('neutral'); }}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeSpeaker === 'neutral'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Umum
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); onSelectSpeaker('01'); }}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeSpeaker === '01'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                🔴 P1
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); onSelectSpeaker('02'); }}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeSpeaker === '02'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                🔵 P2
              </button>
            </div>
          </div>

          {/* Preset Buttons for Timer Mode */}
          {mode === 'timer' && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                Waktu:
              </span>
              {presets.map((preset) => (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => handlePresetSelect(preset.seconds)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    targetDuration === preset.seconds && status === 'stopped' && !isTimeUp
                      ? 'bg-slate-800 text-amber-300 border-amber-500/60 shadow-sm'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              {/* Custom Minutes Input */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded-xl text-xs text-slate-300">
                <input
                  id="input-custom-minutes"
                  type="number"
                  min="0.5"
                  max="60"
                  step="0.5"
                  value={customMinutes}
                  onChange={handleCustomMinuteChange}
                  className="w-11 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-white font-mono font-bold focus:outline-none focus:border-red-500 text-xs"
                  title="Atur menit custom"
                />
                <span className="text-[11px]">mnt</span>
              </div>
            </div>
          )}

          {/* GIANT DIGITAL CLOCK DISPLAY (Optimized for LCD Projection & Center Column) */}
          <div className="text-center my-2 select-none">
            <div className="relative inline-block w-full max-w-md px-4 py-3 sm:px-8 sm:py-5 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-inner">
              
              {/* Status Indicator Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border shadow-md flex items-center gap-1.5 whitespace-nowrap">
                {status === 'running' ? (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/90 border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    BERJALAN
                  </span>
                ) : status === 'paused' ? (
                  <span className="text-amber-300 bg-amber-950/90 border-amber-700/60 px-2.5 py-0.5 rounded-full">
                    JEDA (PAUSED)
                  </span>
                ) : isTimeUp ? (
                  <span className="text-red-400 bg-red-950/90 border-red-700/60 px-2.5 py-0.5 rounded-full animate-bounce">
                    SELESAI
                  </span>
                ) : (
                  <span className="text-slate-400 bg-slate-900 border-slate-700 px-2.5 py-0.5 rounded-full">
                    STANDBY
                  </span>
                )}
              </div>

              {/* Digits Display */}
              <div 
                className={`font-['JetBrains_Mono',monospace] font-black tracking-tight transition-colors duration-200 ${
                  isCenterLayout
                    ? 'text-5xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl'
                    : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                } ${
                  isTimeUp
                    ? 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                    : isUrgent
                      ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse'
                      : 'text-white'
                }`}
              >
                {formatTime(displayTime)}
                <span className="text-xl sm:text-2xl md:text-3xl text-slate-500 font-normal">
                  .{getMillisFraction(displayTime)}
                </span>
              </div>
            </div>

            {/* Time Up Alert Banner */}
            {isTimeUp && (
              <div 
                id="alert-waktu-habis" 
                className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-black text-base sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl animate-bounce"
              >
                <AlertTriangle className="w-5 h-5 text-amber-200 animate-pulse" />
                <span>WAKTU HABIS!</span>
                <AlertTriangle className="w-5 h-5 text-amber-200 animate-pulse" />
              </div>
            )}
          </div>

          {/* MAIN CONTROLS: START, PAUSE, RESET */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 pt-3 border-t border-slate-800">
            {/* START BUTTON */}
            {status !== 'running' ? (
              <button
                id="btn-timer-start"
                type="button"
                onClick={handleStart}
                className="flex-1 min-w-[120px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transform active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>▶ START</span>
              </button>
            ) : (
              /* PAUSE BUTTON */
              <button
                id="btn-timer-pause"
                type="button"
                onClick={handlePause}
                className="flex-1 min-w-[120px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 border border-amber-400/40 transform active:scale-95 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>⏸ PAUSE</span>
              </button>
            )}

            {/* RESET BUTTON */}
            <button
              id="btn-timer-reset"
              type="button"
              onClick={handleResetClick}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 border border-slate-700 transform active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>🔄 RESET</span>
            </button>
          </div>

          {/* Projector Notice / Helper */}
          <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>
              Waktu akurat berbasis browser timestamp • Fullscreen (⛶)
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
