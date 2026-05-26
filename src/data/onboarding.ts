// ONBOARDING — ۳ اسلاید اولین اجرا
// متن‌ها از handoff screens-home.jsx > ONBOARDING

export interface OnboardingSlide {
  motifKey: 'motif2' | 'motif3' | 'motif4' | 'motif5';
  title:    string;
  text:     string;
}

export const ONBOARDING: OnboardingSlide[] = [
  {
    motifKey: 'motif4',
    title:    'به جهان نگارگری خوش آمدید',
    text:     'سفری در دل هنر کهن ایران. طرح‌های اصیل گل‌و‌مرغ، نگارگری و تذهیب در انتظار رنگ‌های شماست.',
  },
  {
    motifKey: 'motif2',
    title:    'با ابزارهای حرفه‌ای رنگ بزنید',
    text:     'قلم‌مو، سطل رنگ، قطره‌چکان و پالت سنتی ایرانی — لاجوردی، شنگرف و طلایی. همه‌چیز در دسترس انگشتانتان.',
  },
  {
    motifKey: 'motif5',
    title:    'هنر خود را به اشتراک بگذارید',
    text:     'کارهای رنگ‌شده‌ی خود را با قاب اختصاصی ذخیره و در شبکه‌های اجتماعی به اشتراک بگذارید.',
  },
];
