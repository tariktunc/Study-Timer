// playAudio.js

export const SOUND_MAP = {
  alarm: { name: "Alarm", file: "/Sound/alarm.mp3" },
  alarmFire: { name: "Yangın Alarmı", file: "/Sound/alarm-fire-alarm.mp3" },
  churchBell: { name: "Kilise Çanı", file: "/Sound/church-bell.mp3" },
  copperBell: { name: "Bakır Çan", file: "/Sound/copper-bell.mp3" },
  bellRinging: { name: "Çan Sesi", file: "/Sound/alarmclock-bell-ringing.mp3" },
};

export const TICKING_MAP = {
  none: { name: "Kapalı" },
  tickingSlow: { name: "Yavaş Tikleme", bpm: 60 },
  tickingFast: { name: "Hızlı Tikleme", bpm: 120 },
};

let audioElement = null;
let tickingInterval = null;
let tickingCtx = null;

export const playSound = (selectedSound, volume) => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  const soundData = SOUND_MAP[selectedSound];
  if (!soundData) return;

  const audio = new Audio(soundData.file);
  audio.volume = Math.min(Math.max(volume / 100, 0), 1);
  audio.play().catch(() => {});
  audioElement = audio;
};

export const stopSound = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
};

// Web Audio API ile ticking sesi üret (dosya gerekmez)
function playTick(volume) {
  try {
    if (!tickingCtx) {
      tickingCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const osc = tickingCtx.createOscillator();
    const gain = tickingCtx.createGain();

    osc.connect(gain);
    gain.connect(tickingCtx.destination);

    osc.frequency.value = 800;
    osc.type = "sine";

    const vol = Math.min(Math.max(volume / 100, 0), 1) * 0.3;
    gain.gain.setValueAtTime(vol, tickingCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, tickingCtx.currentTime + 0.05);

    osc.start(tickingCtx.currentTime);
    osc.stop(tickingCtx.currentTime + 0.05);
  } catch (e) {
    // Web Audio API desteklenmiyorsa sessiz kal
  }
}

export const startTicking = (tickingKey, volume) => {
  stopTicking();
  const tickData = TICKING_MAP[tickingKey];
  if (!tickData || !tickData.bpm) return;

  const intervalMs = (60 / tickData.bpm) * 1000;
  playTick(volume);
  tickingInterval = setInterval(() => playTick(volume), intervalMs);
};

export const stopTicking = () => {
  if (tickingInterval) {
    clearInterval(tickingInterval);
    tickingInterval = null;
  }
};

export const setTickingVolume = (volume) => {
  // Volume değiştiğinde mevcut ticking'i yeniden başlat
  if (tickingInterval) {
    const tickKey = localStorage.getItem("tickingSound") || "none";
    startTicking(tickKey, volume);
  }
};
