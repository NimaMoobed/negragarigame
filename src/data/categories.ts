// CATEGORIES — ۳ دسته‌ی اصلی صفحه‌ی خانه

export type CategoryId = 'tazhib' | 'negar' | 'gol';

export interface Category {
  id:       CategoryId;
  title:    string;
  sub:      string;
  /** اگر iconUrl ست شود، آن استفاده می‌شود؛ وگرنه motifKey رندر می‌شود. */
  iconUrl?: string;
  /** نحوه‌ی fit کردن تصویر داخل کارت. پیش‌فرض contain (مناسب PNG شفاف). */
  iconFit?: 'contain' | 'cover';
  motifKey: 'motif4' | 'motif3' | 'motif2';
  count:    number;
  locked:   boolean;
}

const BASE = import.meta.env.BASE_URL;

export const CATEGORIES: Category[] = [
  {
    id: 'tazhib', title: 'تذهیب', sub: 'نقوش طلایی و اسلیمی',
    iconUrl:  `${BASE}categories/tazhib.png`,
    motifKey: 'motif4', count: 14, locked: false,
  },
  {
    id: 'negar', title: 'نگارگری', sub: 'سنت مکتب اصفهان و هرات',
    iconUrl:  `${BASE}categories/negar.jpg`,
    iconFit:  'cover',
    motifKey: 'motif3', count: 36, locked: true,
  },
  {
    id: 'gol', title: 'گل و مرغ', sub: 'باغ نقاشی پارسی',
    iconUrl:  `${BASE}categories/gol.jpg`,
    iconFit:  'cover',
    motifKey: 'motif2', count: 18, locked: true,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
