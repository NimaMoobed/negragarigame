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
  { id: 'setar-garden', title: 'باغ سه‌تار', artist: 'بی‌کلام', url: `${BASE}music/setar-garden.mp3` },
];

// Re-export BASE for places that need it (e.g. preloading)
export { BASE as MUSIC_BASE };
