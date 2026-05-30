# راهنمای نگه‌داری اپ نگارگری

یک دفترچه‌ی copy-paste برای تغییر، گسترش و ارسال آپدیت‌های اپ **رنگ‌آمیزی هنر نگارگری ایرانی** (`app.negargari.iranian`) بدون اینکه لازم باشد چیزی از کد بدانی.

هر بخش با یک **پرامپت آماده** تمام می‌شود که می‌توانی در یک session تازه‌ی Claude paste کنی. پرامپت‌ها **خودکفا** هستند — یعنی Claude بدون اینکه بقیه‌ی این راهنما را بخواند هم می‌تواند کار را انجام دهد.

> 📄 نسخه‌ی انگلیسی این راهنما: `MAINTENANCE.md` (پرامپت‌های انگلیسی بهتر کار می‌کنند ولی پرامپت‌های فارسی پایین هم درست عمل می‌کنند)

---

## ۱. نمای کلی (یک بار بخوان، بعد فراموش کن)

```
APK روی گوشی  ──باز می‌کند──►  https://nimamoobed.github.io/negragarigame/
                                      │
                                      ▼
                              GitHub Pages (شاخه‌ی gh-pages)
                                      │
                                      ▼
                              کد منبع روی شاخه‌ی main
                                      │
                                      ▼
                              کد محلی در C:\Users\user\negargari\
```

تقریباً هرگز به فایل APK دست نمی‌زنی. **کد را تغییر می‌دهی، deploy می‌کنی، گوشی دفعه‌ی بعد که اپ را باز کنی نسخه‌ی جدید را می‌گیرد.**

### دو repo در GitHub (اشتباه نگیر)

| Repo | کاربرد | آدرس |
|---|---|---|
| `negragarigame` | کد اصلی اپ + خروجی web | https://github.com/NimaMoobed/negragarigame |
| `nimamoobed.github.io` | فقط نگه‌داری `.well-known/assetlinks.json` و landing page — برای مخفی‌کردن نوار آدرس TWA | https://github.com/NimaMoobed/nimamoobed.github.io |

**۹۹٪ تغییرات تو در `negragarigame` اتفاق می‌افتند.** repo دیگر فقط وقتی لازم می‌شود که APK جدید با کلید امضای متفاوت بسازی.

---

## ۲. نقشه‌ی فایل‌های پروژه (راهنمای سریع)

```
C:\Users\user\negargari\
│
├── public/                          ← فایل‌های ثابت که عیناً سرو می‌شوند
│   ├── designs/
│   │   ├── design_NN.png            ← طرح‌های ۱۰۲۴×۱۰۲۴ رنگ‌آمیزی
│   │   └── thumbs/thumb_NN.png      ← thumbnail های ۲۵۶×۲۵۶
│   ├── icons/                       ← آیکن‌های اپ (خودکار ساخته می‌شوند)
│   ├── .well-known/assetlinks.json  ← Digital Asset Links
│   └── .nojekyll                    ← به GitHub Pages می‌گوید پوشه‌های نقطه‌دار را فیلتر نکند
│
├── src/
│   ├── theme/
│   │   ├── classic.ts               ← همه‌ی رنگ‌های تم (سبز، لاجوردی، ...)
│   │   └── palette.ts               ← ۱۲ رنگ سنتی پالت
│   │
│   ├── data/
│   │   ├── categories.ts            ← ۳ دسته‌ی صفحه‌ی خانه
│   │   ├── designs.ts               ← فهرست طرح‌های موجود + عنوان‌هایشان
│   │   └── onboarding.ts            ← متن اسلایدهای آنبوردینگ
│   │
│   ├── screens/                     ← هر صفحه‌ی اپ
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DesignListScreen.tsx
│   │   ├── ColoringScreen.tsx       ← پیچیده‌ترین صفحه
│   │   ├── ShareScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── modals/LockModal.tsx         ← مودال «ریویو برای باز شدن»
│   ├── canvas/                      ← منطق نقاشی (به‌ندرت دست‌خوش می‌شود)
│   ├── components/                  ← اجزای UI قابل استفاده مجدد
│   ├── hooks/useUnlocked.ts         ← وضعیت قفل/باز
│   └── lib/storage.ts               ← ذخیره/بازخوانی با Capacitor Preferences
│
├── scripts/make-icons.py            ← اسکریپت Python برای ساخت آیکن‌ها
├── vite.config.ts                   ← نام اپ، manifest، base path
├── package.json
├── MAINTENANCE.md                   ← راهنمای انگلیسی
└── MAINTENANCE.fa.md                ← همین فایل
```

---

## ۳. تست محلی قبل از Deploy

ضروری نیست — ولی اگر می‌خواهی تغییر را قبل از deploy ببینی، یک چرخه‌ی deploy/uninstall کمتر می‌خوری.

```bash
cd C:\Users\user\negargari
npm run dev
```

بعد در مرورگر باز کن: `http://localhost:5173/` (یا هر پورتی که نشان داد). تغییرات auto-reload می‌شوند. `Ctrl+C` برای توقف.

---

## ۴. Deploy تغییرات روی گوشی

بعد از هر تغییر کد، این سه دستور را به ترتیب اجرا کن:

```bash
cd C:\Users\user\negargari
npm run build
git add -A && git commit -m "توضیح آنچه تغییر دادی"
git push
npx gh-pages -d dist -b gh-pages --dotfiles
```

~۶۰ ثانیه صبر کن، بعد:

۱. اپ را روی گوشی کاملاً ببند (از task switcher swipe up)
۲. دوباره باز کن — service worker در پشت‌صحنه فایل‌های جدید را دانلود می‌کند
۳. دوباره ببند و باز کن → نسخه‌ی جدید آمد

اگر بعد از ۲ بار باز و بسته کردن هنوز قدیمی است، برو به:
**تنظیمات گوشی → برنامه‌ها → رنگ‌آمیزی → Storage → Clear cache** و دوباره باز کن.

> 💡 **می‌خواهی Claude همه‌ی این مراحل deploy را برایت انجام دهد؟** از پرامپت #۱ پایین استفاده کن.

---

## ۵. پرامپت‌های آماده (بخش مهم)

هر کدام از این‌ها را می‌توانی در یک session تازه‌ی Claude paste کنی. هر کدام **خودکفا** است.

---

### پرامپت #۱ — فقط deploy کن تغییرات pending را

> در `C:\Users\user\negargari` تغییراتی دارم که هنوز commit نشده‌اند. لطفاً پروژه را rebuild کن، با یک پیام واضح که توضیح می‌دهد چه چیزی تغییر کرده commit کن، روی شاخه‌ی `main` در `github.com/NimaMoobed/negragarigame` push کن، و پوشه‌ی `dist/` را با `npx gh-pages -d dist -b gh-pages --dotfiles` به شاخه‌ی `gh-pages` deploy کن. سپس به من بگو اپ را روی گوشی close و reopen کنم.

---

### پرامپت #۲ — اضافه یا جایگزینی طرح‌ها

> می‌خواهم طرح‌های رنگ‌آمیزی جدید به اپ در `C:\Users\user\negargari` اضافه/جایگزین کنم. تصاویر جدید در `<آدرس_پوشه>` به‌صورت JPG یا PNG هستند.
>
> لطفاً:
> ۱. از اسکریپت پیش‌پردازش موجود در `C:\Users\user\PaintAppScripts\process_designs.py` به‌عنوان مرجع استفاده کن، یا اگر لازم بود یک اسکریپت تازه با Python+Pillow بنویس. طرح‌های پردازش‌شده باید PNG با اندازه‌ی ۱۰۲۴×۱۰۲۴ و خطوط سیاه خالص روی سفید باشند (threshold روی ۱۲۸)، و thumbnail های ۲۵۶×۲۵۶. خروجی به `C:\Users\user\negargari\public\designs\design_NN.png` و `thumbs/thumb_NN.png` (شماره‌گذاری با صفر اضافه).
> ۲. `C:\Users\user\negargari\src\data\designs.ts` را به‌روز کن تا آرایه‌ی `DESIGNS` همه‌ی فایل‌های جدید را پوشش دهد. `length` در `Array.from` را تنظیم کن.
> ۳. فیلد `count` در `C:\Users\user\negargari\src\data\categories.ts` برای دسته‌ی `tazhib` (یا هر دسته‌ای که این‌ها به آن تعلق دارند) را به‌روز کن.
> ۴. Build و deploy کن (پرامپت #۱).
>
> طرح‌هایی که جایگزین می‌شوند با همان اسم فایل overwrite شوند. طرح‌های جدید شماره‌ی بعدی آزاد را بگیرند (مثلاً `design_15.png`).

---

### پرامپت #۳ — اضافه طرح به دسته‌ی جدید (نگارگری یا گل و مرغ)

> می‌خواهم طرح‌های واقعی به دسته‌ی فعلاً خالی `<negar یا gol>` در اپ کتاب رنگ‌آمیزی‌ام در `C:\Users\user\negargari` اضافه کنم. تصاویر جدید در `<آدرس_پوشه>` هستند.
>
> لطفاً:
> ۱. آن‌ها را به PNG خط‌خام ۱۰۲۴×۱۰۲۴ + thumbnail ۲۵۶×۲۵۶ پیش‌پردازش کن، با نام‌گذاری مثل `negar_01.png` (یا `gol_01.png`). در `public/designs/` و `public/designs/thumbs/` قرار بده.
> ۲. `src/data/designs.ts` را باز کن و آیتم‌های جدید را به آرایه‌ی DESIGNS برای دسته‌ی جدید اضافه کن. آیتم‌های تذهیب موجود را دست‌نخورده باقی بگذار. هر آیتم جدید نیاز به `id`، `category` (روی `'negar'` یا `'gol'` تنظیم شود)، `title`، `fullUrl`، `thumbUrl` دارد.
> ۳. `count` در `src/data/categories.ts` برای آن دسته را به‌روز کن.
> ۴. Build + deploy (طبق پرامپت #۱).

---

### پرامپت #۴ — تغییر عنوان یا توضیح یک دسته

> در اپ من در `C:\Users\user\negargari`، فایل `src/data/categories.ts` را باز کن و `title` (و/یا `sub`) دسته‌ای که `id` آن `<tazhib | negar | gol>` است را به `<عنوان_جدید>` و `<توضیح_جدید>` تغییر بده. بعد build + deploy کن طبق پرامپت #۱.

---

### پرامپت #۵ — اضافه یک دسته‌ی کاملاً جدید

> یک دسته‌ی چهارم به صفحه‌ی خانه‌ی اپ در `C:\Users\user\negargari` اضافه کن.
>
> جزئیات دسته:
> - id: `<شناسه_کوتاه_انگلیسی_کوچک>`
> - title (فارسی): `<عنوان>`
> - sub (فارسی): `<توضیح>`
> - locked: `<true | false>`
> - count: 0 (یا هرچند طرح بخواهی اضافه کنی)
> - motifKey: یکی از `motif1` تا `motif6` انتخاب کن
>
> لطفاً:
> ۱. در `src/data/categories.ts`، آیتم جدید را به CATEGORIES اضافه کن و union type CategoryId را گسترش بده.
> ۲. در `src/hooks/useUnlocked.ts`، منطق unlock خودکار دسته‌های جدید را handle می‌کند پس آنجا تغییری لازم نیست.
> ۳. Build + deploy.

---

### پرامپت #۶ — تغییر یک رنگ تم

> در اپ من در `C:\Users\user\negargari`، تم در `src/theme/classic.ts` و `tailwind.config.js` تعریف شده. می‌خواهم `<primary | accent | bg | ...>` را از مقدار فعلی به `<HEX_جدید>` تغییر دهم.
>
> لطفاً **هر دو فایل** را به‌طور هماهنگ به‌روز کن، همچنین `theme_color` در `vite.config.ts` را اگر primary تغییر کرده، و همچنین `<meta name="theme-color">` در `index.html`. بعد build + deploy کن.

---

### پرامپت #۷ — تغییر متن آنبوردینگ

> در اپ من در `C:\Users\user\negargari`، فایل `src/data/onboarding.ts` را باز کن. اسلاید با index `<0 | 1 | 2>` را ویرایش کن تا `title` آن `<عنوان_جدید>` و `text` آن `<متن_جدید>` شود. بعد build + deploy کن.

---

### پرامپت #۸ — اضافه آیتم جدید در تنظیمات

> در اپ من در `C:\Users\user\negargari`، فایل `src/screens/SettingsScreen.tsx` را باز کن. یک آیتم جدید به آرایه‌ی ITEMS اضافه کن:
> - icon: `<یکی از: star, share, sparkles, external, settings, heart>`
> - label: `<متن_فارسی_عنوان>`
> - sub: `<متن_خاکستری_کوچک_زیر_عنوان_(اختیاری)>`
> - action: `<شناسه_کوتاه_جدید>`
>
> همچنین یک `case` جدید به switch داخل `handle()` اضافه کن که `<چه_اتفاقی_در_کلیک>` را انجام دهد. بعد build + deploy کن.

---

### پرامپت #۹ — تغییر URL «سایت من»

> در اپ من در `C:\Users\user\negargari`، فایل `src/screens/SettingsScreen.tsx` را باز کن. `DEV_SITE_URL` را به `<URL_جدید>` تغییر بده و `sub` آیتم متناظر در ITEMS (آنکه action آن `'visit-site'` است) را به دامنه‌ی جدید تغییر بده. Build + deploy کن.

---

### پرامپت #۱۰ — اضافه رنگ به پالت

> در اپ من در `C:\Users\user\negargari`، فایل `src/theme/palette.ts` را باز کن. یک رنگ جدید به انتهای PERSIAN_PALETTE اضافه کن:
> - hex: `<#RRGGBB>`
> - name: `<نام_فارسی>`
>
> Build + deploy کن. رنگ خودکار در ردیف پالت صفحه‌ی رنگ‌آمیزی ظاهر می‌شود.

---

### پرامپت #۱۱ — تغییر نام اپ

> در اپ من در `C:\Users\user\negargari`، نام نمایشی اپ را از "رنگ‌آمیزی هنر نگارگری ایرانی" به `<نام_جدید>` تغییر بده. این یعنی به‌روز کردن:
> ۱. `vite.config.ts` → `manifest.name` و `manifest.short_name`
> ۲. `index.html` → تگ `<title>`
> ۳. `capacitor.config.ts` → `appName`
> ۴. هر متن قابل‌مشاهده در `src/screens/SplashScreen.tsx` و header ها.
>
> توجه: نام آیکن APK در launcher گوشی از package PWABuilder/TWA می‌آید — تغییرش نیاز به ساخت APK جدید دارد. عنوان web و نام داخل اپ در deploy بعدی به‌روز می‌شوند.

---

### پرامپت #۱۲ — افزایش نسخه + حذف کش

> در اپ من در `C:\Users\user\negargari`، نسخه را از `1.0` به `<نسخه_جدید>` تغییر بده در:
> ۱. فیلد `version` در `package.json`
> ۲. متن «درباره‌ی اپ» در `src/screens/SettingsScreen.tsx` (دنبال "نسخهٔ ۱.۰" بگرد)
> ۳. `vite.config.ts` — version کش workbox را افزایش بده تا کاربران build جدید را اجباری بگیرند
>
> Build + deploy کن.

---

### پرامپت #۱۳ — رفع باگ / بررسی مشکل

> چیزی در اپ من در `C:\Users\user\negargari` خراب است. علائم:
> `<توضیح_مشکل>`
> اسکرین‌شات (اگر هست): `<مسیر_اسکرین‌شات>`
>
> لطفاً بررسی کن، علت اصلی را پیدا کن، حلش کن و deploy کن. به من بگو چه تغییر دادی.

---

### پرامپت #۱۴ — اضافه یک اپ کاملاً جدید به مجموعه

> می‌خواهم یک mini-app دوم به پروژه‌ام اضافه کنم. باید به‌صورت یک دکمه روی landing page در `https://nimamoobed.github.io/` ظاهر شود.
>
> مفهوم اپ جدید: `<توضیح_اپ>`
>
> لطفاً:
> ۱. ساختار را برنامه‌ریزی کن (آیا یک پروژه‌ی Vite جدا در `C:\Users\user\<نام_جدید>` خواهد بود یا یک route دیگر داخل پروژه‌ی فعلی؟). گزینه‌ی ساده‌تر را به من توصیه کن.
> ۲. ساختار پوشه‌ی پیشنهادی را نشانم بده.
> ۳. بعد از تأیید من بساز.
>
> اگر پروژه‌ی جدیدی می‌سازی، روی یک repo جدید در GitHub Pages deploy کن، و یک کارت روی landing page user-site من (repo در `C:\Users\user\nimamoobed-site\index.html`) با لینک به آن اضافه کن.

---

### پرامپت #۱۵ — ساخت APK جدید برای کافه‌بازار

> اپ من در `https://nimamoobed.github.io/negragarigame/` deploy شده و آماده است. می‌خواهم یک APK جدید بسازم که در کافه‌بازار آپلود کنم. مراحل را قدم‌به‌قدم برایم بنویس:
> ۱. رفتن به pwabuilder.com
> ۲. کلیک‌های دقیق برای ساخت Android package
> ۳. با ZIP دانلودشده چه کنم
> ۴. assetlinks.json کجاست در صورتی که کلید امضایم تغییر کرده (و مراحل به‌روزرسانی آن در `C:\Users\user\nimamoobed-site\.well-known\assetlinks.json` اگر لازم باشد)
>
> همچنین به من یادآوری کن در صفحه‌ی آپلود کافه‌بازار چه چیزهایی پر کنم.

---

## ۶. روند آپدیت روی گوشی (بخش حوصله‌بر ولی حیاتی)

بعد از هر deploy:

۱. **اپ را کاملاً ببند** از task switcher
۲. **بازش کن** — احتمالاً نسخه‌ی **قدیم** را می‌بینی (service worker تازه نسخه‌ی جدید را در پشت‌صحنه دانلود کرد)
۳. **دوباره ببند**
۴. **بازش کن** — حالا نسخه‌ی جدید آمد

اگر بعد از ۲ بار باز/بسته هنوز قدیم است:
- تنظیمات → برنامه‌ها → رنگ‌آمیزی هنر نگارگری ایرانی → Storage → **Clear cache** (نه Clear Data — آن پیشرفت رنگ‌آمیزی را پاک می‌کند)
- اپ را باز کن

اگر هنوز قدیم است (خیلی نادر):
- APK را uninstall کن
- از ZIP اصلی APK در `C:\Users\user\Downloads\نگارگری - Google Play package.zip` دوباره نصب کن

---

## ۷. Backup ها و فایل‌های مهم

این‌ها را نگه دار — گم شدنشان دردسر می‌آورد:

| فایل | چرا مهم است |
|---|---|
| `C:\Users\user\Downloads\نگارگری - Google Play package.zip` | شامل APK + کلید امضا. اگر کلید امضا را گم کنی، **نمی‌توانی به‌عنوان همان اپ به بازار update بفرستی** — بازار آن را اپ کاملاً جدید می‌بیند. |
| `C:\Users\user\Downloads\pwabuilder_extract\signing.keystore` | همان — **حذف نکن**. |
| `C:\Users\user\Downloads\pwabuilder_extract\signing-key-info.txt` | رمز keystore اینجاست. |
| `D:\New folder (2)\` | ۱۴ JPG اصلی منبع. |

**پیشنهاد جدی**: همین الان فایل‌های امضا را روی USB یا cloud (Google Drive، Saved Messages تلگرام) backup بگیر. بدون این فایل‌ها، update گذاشتن در بازار غیرممکن می‌شود.

---

## ۸. مشکلات رایج (Gotchas)

- **GitHub Pages ۳۰–۹۰ ثانیه طول می‌کشد تا refresh شود** بعد از تمام شدن `npx gh-pages`. صبور باش قبل از تست.
- **Service worker تهاجمی cache می‌کند.** اولین reload بعد از deploy = اغلب هنوز قدیم. دومی = جدید.
- **نوار آدرس بالای اپ** وقتی ظاهر می‌شود که Chrome نتواند Digital Asset Links را تأیید کند. این وقتی پیش می‌آید که APK جدید با کلید امضای متفاوت بسازی. راه حل: SHA256 جدید را از ZIP PWABuilder در `C:\Users\user\nimamoobed-site\.well-known\assetlinks.json` کپی کن، بعد آن repo را commit + push کن.
- **خطاهای TypeScript حین `npm run build`** یعنی Vite از build کردن سر باز می‌زند. اگر چیزی شکست، `npm run dev` را اجرا کن — این بخشنده‌تر است و خطا را در console مرورگر نشان می‌دهد.
- **`base: '/negragarigame/'` در vite.config.ts** به نام repo گره خورده. اگر روزی repo را در GitHub rename کنی، این را هم به‌روز کن وگرنه asset ها 404 می‌دهند.

---

## ۹. چطور این را به Claude بعدی بدهی

وقتی در آینده یک session تازه‌ی Claude باز می‌کنی، با این پیام context کامل بدهی:

> لطفاً `C:\Users\user\negargari\MAINTENANCE.fa.md` را بخوان تا با پروژه‌ی اپ کتاب رنگ‌آمیزی من آشنا شوی. بعد می‌خواهم: `<توضیح_کار>`

همین کافی است. Claude راهنما را می‌خواند و هر چه لازم دارد می‌داند.

---

_آخرین به‌روزرسانی: ۲۰۲۶/۰۵/۲۷_
