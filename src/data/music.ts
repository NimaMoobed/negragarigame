// فهرست آهنگ‌های موسیقی پس‌زمینه
//
// نحوه‌ی اضافه‌کردن آهنگ:
// 1) فایل MP3 (یا OGG / WebM) را در `public/music/` بگذار
// 2) یک آیتم به آرایه‌ی TRACKS اضافه کن
// 3) build + deploy
//
// ⚠️ فقط آهنگ‌هایی استفاده کن که:
//   - مجوز رسمی برایش گرفته‌ای (لایسنس از هنرمند/شرکت موسیقی)
//   - رویالتی-فری است (Pixabay Music، Free Music Archive، ...)
//   - Public Domain است (هنرمندان قدیمی)
//   - یا خودت ساخته‌ای / تولید AI با مجوز تجاری

const BASE = import.meta.env.BASE_URL;

export interface Track {
  id:     string;
  title:  string;
  artist: string;
  url:    string;
}

export const TRACKS: Track[] = [
  // مثال — وقتی فایل اضافه کردی این را uncomment کن و ادیت کن:
  // { id: 't1', title: 'تک‌نوازی سنتور',     artist: 'نوازنده',     url: `${BASE}music/santour.mp3` },
  // { id: 't2', title: 'مهربان جان',          artist: 'علیرضا افتخاری', url: `${BASE}music/mehraban-jan.mp3` },
  // { id: 't3', title: 'وطنم',                artist: 'محمد اصفهانی',   url: `${BASE}music/vatanam.mp3` },
];

// Re-export BASE for places that need it (e.g. preloading)
export { BASE as MUSIC_BASE };
