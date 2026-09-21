// ============================================================
// CloakBid — Advanced Cybernetic Web Audio Procedural SFX Engine
// ============================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = false;
  private ambientRunning: boolean = false;

  constructor() {
    // Lazy initialize on first interaction to respect browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientRunning) {
      this.stopAmbientDrone();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08, pitchDecay = true) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchDecay) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.4), this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Silent catch
    }
  }

  // Tactical click
  public playClick() {
    this.playTone(1200, 0.04, 'square', 0.035, false);
  }

  // Micro hover tick
  public playHover() {
    this.playTone(2400, 0.02, 'sine', 0.015, false);
  }

  // Terminal keystroke
  public playKey() {
    const freqs = [700, 850, 920, 1050, 1200];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(f, 0.03, 'triangle', 0.025, true);
  }

  // Bid submission sound sequence
  public playBid() {
    if (this.isMuted) return;
    this.playTone(320, 0.1, 'sine', 0.08);
    setTimeout(() => this.playTone(480, 0.12, 'sine', 0.07), 80);
    setTimeout(() => this.playTone(720, 0.15, 'triangle', 0.06), 180);
    setTimeout(() => this.playTone(960, 0.25, 'sine', 0.05), 300);
  }

  // Success sequence
  public playSuccess() {
    if (this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.22, 'sine', 0.07, false);
      }, idx * 90);
    });
  }

  // Error alert
  public playError() {
    if (this.isMuted) return;
    this.playTone(280, 0.2, 'sawtooth', 0.06);
    setTimeout(() => this.playTone(190, 0.25, 'sawtooth', 0.07), 120);
  }

  // Winner announcement fanfare
  public playWinner() {
    if (this.isMuted) return;
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.35, 'sine', 0.09, false);
      }, idx * 110);
    });
  }

  // Frequency scan sweep
  public playScan() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // Heavy lock engagement
  public playLock() {
    this.playTone(180, 0.15, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(110, 0.25, 'square', 0.06), 70);
  }

  // Warp transition
  public playWarp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.45);
    } catch {}
  }

  // Ambient Sci-Fi Reactor Drone
  public toggleAmbientDrone(): boolean {
    if (this.ambientRunning) {
      this.stopAmbientDrone();
      return false;
    } else {
      this.startAmbientDrone();
      return true;
    }
  }

  public isAmbientActive(): boolean {
    return this.ambientRunning;
  }

  public startAmbientDrone() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.stopAmbientDrone();

      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.ambientFilter = this.ctx.createBiquadFilter();

      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz deep A1 drone

      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(4, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 2.0); // Gentle fade-in

      this.ambientOsc.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
      this.ambientRunning = true;
    } catch {
      this.ambientRunning = false;
    }
  }

  public stopAmbientDrone() {
    if (this.ambientOsc && this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          try {
            this.ambientOsc?.stop();
            this.ambientOsc?.disconnect();
            this.ambientOsc = null;
          } catch {}
        }, 1100);
      } catch {
        this.ambientOsc = null;
      }
    }
    this.ambientRunning = false;
  }
}

export const soundFx = new SoundEngine();
