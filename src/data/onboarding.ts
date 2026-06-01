// ONBOARDING — ۳ اسلاید اولین اجرا
// متن‌ها از handoff screens-home.jsx > ONBOARDING
// تصاویر: همان آیکن‌های ۳ دسته (تذهیب، نگارگری، گل و مرغ) برای انسجام بصری.

const BASE = import.meta.env.BASE_URL;

export interface OnboardingSlide {
  /** تصویر hero اسلاید — مسیر کامل با base url */
  imageUrl: string;
  title:    string;
  text:     string;
}

export const ONBOARDING: OnboardingSlide[] = [
  {
    imageUrl: `${BASE}categories/tazhib.jpg`,
    title:    'به جهان نگارگری خوش آمدید',
    text:     'سفری در دل هنر کهن ایران. طرح‌های اصیل گل‌و‌مرغ، نگارگری و تذهیب در انتظار رنگ‌های شماست.',
  },
  {
    imageUrl: `${BASE}categories/negar.jpg`,
    title:    'با ابزارهای حرفه‌ای رنگ بزنید',
    text:     'قلم‌مو، سطل رنگ، قطره‌چکان و پالت سنتی ایرانی — لاجوردی، شنگرف و طلایی. همه‌چیز در دسترس انگشتانتان.',
  },
  {
    imageUrl: `${BASE}categories/gol.jpg`,
    title:    'هنر خود را به اشتراک بگذارید',
    text:     'کارهای رنگ‌شده‌ی خود را با قاب اختصاصی ذخیره و در شبکه‌های اجتماعی به اشتراک بگذارید.',
  },
];
