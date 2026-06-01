// فهرست همه‌ی طرح‌های اپ

import type { CategoryId } from './categories';

const BASE = import.meta.env.BASE_URL;

export interface Design {
  id:        string;
  category:  CategoryId;
  title:     string;
  fullUrl:   string;
  thumbUrl:  string;
  /** اگر true، طرح premium است (نیاز به پرداخت در نسخه‌ی آینده). فعلاً modal "به‌زودی" نشان داده می‌شود. */
  locked?:   boolean;
}

// ─── تذهیب: ۱۴ طرح ─────────────────────────────────────
const TAZHIB: Design[] = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id:        `tazhib_${n}`,
    category:  'tazhib' as CategoryId,
    title:     `طرح ${i + 1}`,
    fullUrl:   `${BASE}designs/design_${n}.png`,
    thumbUrl:  `${BASE}designs/thumbs/thumb_${n}.png`,
  };
});

// ─── نگارگری: ۱۳ طرح، ۳ تای آخر premium ────────────────
const NEGAR: Design[] = Array.from({ length: 13 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id:        `negar_${n}`,
    category:  'negar' as CategoryId,
    title:     `طرح ${i + 1}`,
    fullUrl:   `${BASE}designs/negar_${n}.png`,
    thumbUrl:  `${BASE}designs/thumbs/thumb_negar_${n}.png`,
    locked:    i >= 10,    // 11, 12, 13 → premium
  };
});

// ─── گل و مرغ: ۱۴ طرح، ۳ تای آخر premium ───────────────
const GOL: Design[] = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id:        `gol_${n}`,
    category:  'gol' as CategoryId,
    title:     `طرح ${i + 1}`,
    fullUrl:   `${BASE}designs/gol_${n}.png`,
    thumbUrl:  `${BASE}designs/thumbs/thumb_gol_${n}.png`,
    locked:    i >= 11,    // 12, 13, 14 → premium
  };
});

export const DESIGNS: Design[] = [...TAZHIB, ...NEGAR, ...GOL];

export function getDesignsByCategory(catId: CategoryId): Design[] {
  return DESIGNS.filter(d => d.category === catId);
}

export function getDesignById(id: string): Design | undefined {
  return DESIGNS.find(d => d.id === id);
}
