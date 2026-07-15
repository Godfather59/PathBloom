// Audio system using Web Audio API synthesis (no external files)
let audioCtx = null;
let enabled = (() => {
  try {
    return localStorage.getItem('pathbloom_audio_enabled') !== 'false';
  } catch {
    return true;
  }
})();
let sfxVolume = (() => {
  try {
    return Number(localStorage.getItem('pathbloom_sfx_volume')) || 0.7;
  } catch {
    return 0.7;
  }
})();
let musicVolume = (() => {
  try {
    return Number(localStorage.getItem('pathbloom_music_volume')) || 0.5;
  } catch {
    return 0.5;
  }
})();

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      enabled = false;
    }
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (!enabled) {
    return;
  }
  try {
    const ctx = getCtx();
    if (!ctx) {
      return;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume * sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    /* silent fail */
  }
}

export function setAudioEnabled(val) {
  enabled = Boolean(val);
  try {
    localStorage.setItem('pathbloom_audio_enabled', String(enabled));
  } catch {
    /* storage is optional */
  }
}
export function isAudioEnabled() {
  return enabled;
}

export function setSfxVolume(val) {
  sfxVolume = Math.max(0, Math.min(1, Number(val) || 0));
  try {
    localStorage.setItem('pathbloom_sfx_volume', String(sfxVolume));
  } catch {
    /* storage is optional */
  }
}
export function getSfxVolume() {
  return sfxVolume;
}

export function setMusicVolume(val) {
  musicVolume = Math.max(0, Math.min(1, Number(val) || 0));
  try {
    localStorage.setItem('pathbloom_music_volume', String(musicVolume));
  } catch {
    /* storage is optional */
  }
}
export function getMusicVolume() {
  return musicVolume;
}

// UI feedback
export function playTap() {
  playTone(800, 0.06, 'sine', 0.08);
}

export function playSuccess() {
  playTone(523, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 200);
}

export function playError() {
  playTone(200, 0.2, 'square', 0.1);
  setTimeout(() => playTone(150, 0.3, 'square', 0.1), 150);
}

// Game events
export function playAgeUp() {
  playTone(440, 0.1, 'triangle', 0.1);
  setTimeout(() => playTone(660, 0.15, 'triangle', 0.1), 80);
  setTimeout(() => playTone(880, 0.2, 'triangle', 0.08), 180);
}

export function playGoodEvent() {
  playTone(523, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.1), 120);
}

export function playBadEvent() {
  playTone(311, 0.2, 'sawtooth', 0.08);
  setTimeout(() => playTone(233, 0.3, 'sawtooth', 0.08), 150);
}

export function playDeath() {
  const notes = [440, 392, 349, 311, 261, 196, 165, 131];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sine', 0.1), i * 200);
  });
}

export function playMoney() {
  playTone(988, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(1319, 0.15, 'sine', 0.1), 80);
}

export function achievement() {
  playTone(523, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.12), 200);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.15), 300);
}

export function playCoin() {
  playTone(2500, 0.05, 'sine', 0.06);
  setTimeout(() => playTone(2000, 0.05, 'sine', 0.06), 50);
}

export function playNotification() {
  playTone(880, 0.1, 'sine', 0.08);
  setTimeout(() => playTone(1109, 0.15, 'sine', 0.08), 80);
}
