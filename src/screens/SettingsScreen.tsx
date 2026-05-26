// SettingsScreen — تنظیمات اپ (stub)

import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { FooterTabs } from './HomeScreen';
import { Icon, type IconName } from '../components/Icon';

const ITEMS: Array<{ icon: IconName; label: string; action: 'about' | 'review' | 'share' }> = [
  { icon: 'star',         label: 'امتیاز به اپ در کافه‌بازار', action: 'review' },
  { icon: 'share',        label: 'معرفی اپ به دوستان',         action: 'share'  },
  { icon: 'sparkles',     label: 'دربارهٔ اپ',                  action: 'about'  },
];

export function SettingsScreen() {
  const nav = useNavigate();

  const handle = (action: string) => {
    switch (action) {
      case 'review':
        window.open('bazaar://details?id=app.negargari.iranian', '_system');
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'رنگ‌آمیزی هنر نگارگری ایرانی',
            text:  'این اپ زیبای رنگ‌آمیزی را امتحان کن',
            url:   'https://cafebazaar.ir/app/app.negargari.iranian',
          }).catch(() => {});
        }
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
            }}>
              <Icon name={it.icon} size={20} color={T.primary} />
            </div>
            <div style={{ flex: 1, fontSize: 15, color: T.ink, fontWeight: 600 }}>{it.label}</div>
            <Icon name="back" size={18} color={T.inkMute} />
          </div>
        ))}
      </div>

      <FooterTabs active="settings" />
    </ScreenBg>
  );
}
