// Web Audio API offline sound synthesizer for debate bell & buzzer

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context error ignored
    }
  }

  public playWarningBeep() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context error ignored
    }
  }

  public playTimeUpBuzzer() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      
      // Triple pulse buzzer - official debate gong/buzzer feel
      const pulses = [0, 0.28, 0.56];
      pulses.forEach((offset) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(440, ctx.currentTime + offset);
        
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(330, ctx.currentTime + offset);

        const startTime = ctx.currentTime + offset;
        const duration = 0.22;

        gain.gain.setValueAtTime(0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
      });
    } catch {
      // Audio context error ignored
    }
  }
}

export const sounds = new SoundEffects();
