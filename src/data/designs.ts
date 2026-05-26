// لیست ۱۴ طرح تذهیب — PNG های موجود در /public/designs/

import type { CategoryId } from './categories';

export interface Design {
  id:         string;
  category:   CategoryId;
  title:      string;
  fullUrl:    string;
  thumbUrl:   string;
}

// Vite injects BASE_URL at build time. For GitHub Pages it becomes "/negragarigame/",
// for local dev it's "/". Using it makes the URLs work in both environments.
const BASE = import.meta.env.BASE_URL;

export const DESIGNS: Design[] = Array.from({ length: 14 }, (_, i) => {
  const n  = String(i + 1).padStart(2, '0');
  return {
    id:        `tazhib_${n}`,
    category:  'tazhib' as CategoryId,
    title:     `طرح ${i + 1}`,
    fullUrl:   `${BASE}designs/design_${n}.png`,
    thumbUrl:  `${BASE}designs/thumbs/thumb_${n}.png`,
  };
});

export function getDesignsByCategory(catId: CategoryId): Design[] {
  return DESIGNS.filter(d => d.category === catId);
}

export function getDesignById(id: string): Design | undefined {
  return DESIGNS.find(d => d.id === id);
}
