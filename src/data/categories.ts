// CATEGORIES — ۳ دسته‌ی اصلی صفحه‌ی خانه

export type CategoryId = 'tazhib' | 'negar' | 'gol';

export interface Category {
  id:        CategoryId;
  title:     string;
  sub:       string;
  motifKey:  'motif4' | 'motif3' | 'motif2';   // which placeholder motif from Motif.tsx
  count:     number;
  locked:    boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'tazhib', title: 'تذهیب',    sub: 'نقوش طلایی و اسلیمی',     motifKey: 'motif4', count: 14, locked: false },
  { id: 'negar',  title: 'نگارگری',  sub: 'سنت مکتب اصفهان و هرات',  motifKey: 'motif3', count: 36, locked: true  },
  { id: 'gol',    title: 'گل و مرغ', sub: 'باغ نقاشی پارسی',          motifKey: 'motif2', count: 18, locked: true  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
