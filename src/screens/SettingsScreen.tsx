// SettingsScreen — تنظیمات اپ

import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { FooterTabs } from './HomeScreen';
import { Icon, type IconName } from '../components/Icon';

interface Item {
  icon:   IconName;
  label:  string;
  sub?:   string;
  action: 'about' | 'review' | 'share' | 'visit-site';
}

const ITEMS: Item[] = [
  { icon: 'star',         label: 'امتیاز به اپ در کافه‌بازار', action: 'review' },
  { icon: 'share',        label: 'معرفی اپ به دوستان',         action: 'share'  },
  { icon: 'external',     label: 'سایت من',                     sub: 'nimamoobed.github.io', action: 'visit-site' },
  { icon: 'sparkles',     label: 'دربارهٔ اپ',                  action: 'about'  },
];

const APP_PACKAGE_ID  = 'app.negargari.iranian';
const APP_STORE_URL   = `https://cafebazaar.ir/app/${APP_PACKAGE_ID}`;
const DEV_SITE_URL    = 'https://nimamoobed.github.io/';

export function SettingsScreen() {
  const nav = useNavigate();

  const handle = (action: Item['action']) => {
    switch (action) {
      case 'review':
        try { window.open(`bazaar://details?id=${APP_PACKAGE_ID}`, '_system'); }
        catch { window.location.href = APP_STORE_URL; }
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'رنگ‌آمیزی هنر نگارگری ایرانی',
            text:  'این اپ زیبای رنگ‌آمیزی را امتحان کن',
            url:   APP_STORE_URL,
          }).catch(() => {});
        } else {
          // fallback: copy link
          navigator.clipboard?.writeText(APP_STORE_URL).catch(() => {});
          alert('لینک اپ کپی شد:\n' + APP_STORE_URL);
        }
        break;
      case 'visit-site':
        window.open(DEV_SITE_URL, '_blank', 'noopener,noreferrer');
        break;
      case 'about':
        alert('رنگ‌آمیزی هنر نگارگری ایرانی\n\nنسخهٔ ۱.۰\nساخته شده با عشق برای هنر ایرانی 🌿');
        break;
    }
  };

  return (
    <ScreenBg>
      <AppBar title="تنظیمات" onBack={() => nav('/home')} />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ITEMS.map(it => (
          <div
            key={it.label}
            onClick={() => handle(it.action)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 16,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: T.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name={it.icon} size={20} color={T.primary} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, color: T.ink, fontWeight: 600 }}>{it.label}</div>
              {it.sub && (
                <div style={{ fontSize: 12, color: T.inkMute, marginTop: 2, direction: 'ltr', textAlign: 'right' }}>{it.sub}</div>
              )}
            </div>
            <Icon name="back" size={18} color={T.inkMute} />
          </div>
        ))}
      </div>

      <FooterTabs active="settings" />
    </ScreenBg>
  );
}
