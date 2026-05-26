// لیست ۱۴ طرح تذهیب — PNG های موجود در /public/designs/

import type { CategoryId } from './categories';

export interface Design {
  id:         string;
  category:   CategoryId;
  title:      string;
  fullUrl:    string;
  thumbUrl:   string;
}

export const DESIGNS: Design[] = Array.from({ length: 14 }, (_, i) => {
  const n  = String(i + 1).padStart(2, '0');
  return {
    id:        `tazhib_${n}`,
    category:  'tazhib' as CategoryId,
    title:     `طرح ${i + 1}`,
    fullUrl:   `/designs/design_${n}.png`,
    thumbUrl:  `/designs/thumbs/thumb_${n}.png`,
  };
});

export function getDesignsByCategory(catId: CategoryId): Design[] {
  return DESIGNS.filter(d => d.category === catId);
}

export function getDesignById(id: string): Design | undefined {
  return DESIGNS.find(d => d.id === id);
}
