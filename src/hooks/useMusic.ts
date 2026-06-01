// useMusic — React hook اطراف music player singleton
//
// خروجی:
//   playing:    دارد پخش می‌شود یا نه
//   track:      آهنگ جاری (یا null)
//   hasTracks:  آیا اصلاً track ای در data/music.ts ست شده
//   toggle, next, prev, playIndex, setVolume — کنترل‌ها

import { useEffect, useState } from 'react';
import * as music from '../lib/music';
import type { Track } from '../data/music';

interface UseMusicResult {
  playing:   boolean;
  track:     Track | null;
  hasTracks: boolean;
  index:     number;
  toggle:    () => void;
  next:      () => void;
  prev:      () => void;
  playIndex: (i: number) => void;
  setVolume: (v: number) => void;
}

export function useMusic(): UseMusicResult {
  const [state, setState] = useState({
    playing:   false,
    index:     0,
    hasTracks: false,
  });

  useEffect(() => {
    return music.subscribe(s => setState(s));
  }, []);

  return {
    playing:   state.playing,
    track:     music.currentTrack(),
    hasTracks: state.hasTracks,
    index:     state.index,
    toggle:    music.toggle,
    next:      music.next,
    prev:      music.prev,
    playIndex: music.playIndex,
    setVolume: music.setVolume,
  };
}
