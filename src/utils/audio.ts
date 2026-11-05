/**
 * Web Audio API based kitchen chime for recipe timers
 * Works offline with zero dependencies or external audio asset files.
 */
export function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Pleasant melodic 3-tone chime (E5 -> G#5 -> B5)
    playTone(659.25, now, 0.4);
    playTone(830.61, now + 0.15, 0.4);
    playTone(987.77, now + 0.3, 0.8);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}
