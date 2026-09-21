// ============================================================
// CloakBid — Ambient Sound FX
// ============================================================

const ctx = (() => {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
})();

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {/* silent fail */}
}

export const soundFx = {
  playClick: () => playTone(880, 0.05, 'square', 0.04),
  playBid: () => {
    playTone(440, 0.1, 'sine', 0.06);
    setTimeout(() => playTone(660, 0.15, 'sine', 0.05), 100);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.04), 220);
  },
  playSuccess: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.06), i * 100));
  },
  playError: () => {
    playTone(220, 0.3, 'sawtooth', 0.05);
    setTimeout(() => playTone(180, 0.4, 'sawtooth', 0.04), 150);
  },
  playWinner: () => {
    const fanfare = [523, 659, 784, 1047, 1319, 1568];
    fanfare.forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.08), i * 120));
  },
};
