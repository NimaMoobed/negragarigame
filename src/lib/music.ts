// Music player — global singleton audio element
//
// محرک‌ها (events):
//   - 'change': آهنگ جاری، حالت play/pause، یا time عوض شد
//
// محدودیت مرورگر/اندروید: play() فقط بعد از تعامل کاربر مجاز است،
// پس اولین کلیک روی دکمه‌ی موسیقی باید توسط خود کاربر باشد.

import { TRACKS, type Track } from '../data/music';
import { getJson, setJson } from './storage';

interface MusicState {
  index:     number;
  playing:   boolean;
  hasTracks: boolean;
}

const PREF_KEY = 'music_pref';   // { lastIndex: number, autoplay: boolean, volume: number }

let audio:        HTMLAudioElement | null = null;
let index:        number = 0;
let initialized = false;
const listeners = new Set<(s: MusicState) => void>();

async function init() {
  if (initialized) return;
  initialized = true;
  if (TRACKS.length === 0) return;

  const pref = await getJson<{ lastIndex?: number; volume?: number }>(PREF_KEY);
  index = Math.min(Math.max(pref?.lastIndex ?? 0, 0), TRACKS.length - 1);

  audio = new Audio(TRACKS[index].url);
  audio.preload = 'metadata';
  audio.loop = false;
  audio.volume = pref?.volume ?? 0.5;

  audio.addEventListener('ended',   () => next());
  audio.addEventListener('play',    () => { notify(); updateMediaSession(); });
  audio.addEventListener('pause',   notify);
  audio.addEventListener('error',   notify);

  // Pause music when the user leaves the app (notifications, switching apps, etc.).
  // This also stops the system media notification from staying visible.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audio && !audio.paused) {
      audio.pause();
    }
  });
  window.addEventListener('pagehide', () => {
    if (audio && !audio.paused) audio.pause();
  });
}

/** Set MediaSession metadata so the system media notification shows OUR title/artist (not the URL). */
function updateMediaSession() {
  if (!('mediaSession' in navigator) || TRACKS.length === 0) return;
  const t = TRACKS[index];
  const base = location.origin + (import.meta.env.BASE_URL || '/');
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title:  t.title,
      artist: t.artist,
      album:  'رنگ‌آمیزی هنر نگارگری ایرانی',
      artwork: [
        { src: base + 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: base + 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    });
    navigator.mediaSession.setActionHandler('play',          () => { audio?.play().catch(() => {}); });
    navigator.mediaSession.setActionHandler('pause',         () => { audio?.pause(); });
    navigator.mediaSession.setActionHandler('previoustrack', () => { prev(); });
    navigator.mediaSession.setActionHandler('nexttrack',     () => { next(); });
  } catch { /* not supported */ }
}

function getState(): MusicState {
  return {
    index,
    playing:   !!audio && !audio.paused,
    hasTracks: TRACKS.length > 0,
  };
}

function notify() { for (const fn of listeners) fn(getState()); }

async function savePref() {
  if (!audio) return;
  await setJson(PREF_KEY, { lastIndex: index, volume: audio.volume });
}

export function subscribe(fn: (s: MusicState) => void): () => void {
  init();
  listeners.add(fn);
  fn(getState());
  return () => { listeners.delete(fn); };
}

export async function toggle() {
  await init();
  if (!audio) return;
  if (audio.paused) {
    try { await audio.play(); } catch { /* ignore autoplay errors */ }
  } else {
    audio.pause();
  }
  notify();
  savePref();
}

export async function next() {
  await init();
  if (!audio || TRACKS.length === 0) return;
  index = (index + 1) % TRACKS.length;
  audio.src = TRACKS[index].url;
  try { await audio.play(); } catch { /* ignore */ }
  notify();
  savePref();
}

export async function prev() {
  await init();
  if (!audio || TRACKS.length === 0) return;
  index = (index - 1 + TRACKS.length) % TRACKS.length;
  audio.src = TRACKS[index].url;
  try { await audio.play(); } catch { /* ignore */ }
  notify();
  savePref();
}

export async function playIndex(i: number) {
  await init();
  if (!audio || i < 0 || i >= TRACKS.length) return;
  index = i;
  audio.src = TRACKS[index].url;
  try { await audio.play(); } catch { /* ignore */ }
  notify();
  savePref();
}

export function setVolume(v: number) {
  if (!audio) return;
  audio.volume = Math.max(0, Math.min(1, v));
  savePref();
}

export function currentTrack(): Track | null {
  return TRACKS[index] || null;
}

export function getTracks(): readonly Track[] {
  return TRACKS;
}
