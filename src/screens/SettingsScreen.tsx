// SettingsScreen — تنظیمات اپ + کنترل موسیقی
// همه‌ی alert() ها با مودال‌های اختصاصی جایگزین شده‌اند تا origin سایت لو نرود.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { FooterTabs } from './HomeScreen';
import { Icon, type IconName } from '../components/Icon';
import { InfoSheet } from '../modals/InfoSheet';
import { Toast } from '../components/Toast';
import { useMusic } from '../hooks/useMusic';

interface Item {
  icon:   IconName;
  label:  string;
  sub?:   string;
  action: 'about' | 'review' | 'share' | 'visit-site' | 'music';
}

const ITEMS: Item[] = [
  { icon: 'music',        label: 'موسیقی پس‌زمینه',              action: 'music' },
  { icon: 'star',         label: 'امتیاز به اپ در کافه‌بازار', action: 'review' },
  { icon: 'share',        label: 'معرفی اپ به دوستان',         action: 'share'  },
  { icon: 'external',     label: 'سایت من',                     sub: 'khosraviyani.ir',      action: 'visit-site' },
  { icon: 'sparkles',     label: 'دربارهٔ اپ',                  action: 'about'  },
];

const APP_PACKAGE_ID  = 'app.negargari.iranian';
const APP_STORE_URL   = `https://cafebazaar.ir/app/${APP_PACKAGE_ID}`;
const DEV_SITE_URL    = 'http://khosraviyani.ir/';

type Sheet = 'about' | 'music' | null;

export function SettingsScreen() {
  const nav = useNavigate();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<string | null>(null);

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
          navigator.clipboard?.writeText(APP_STORE_URL).catch(() => {});
          setToast('لینک اپ کپی شد');
        }
        break;
      case 'visit-site':
        window.open(DEV_SITE_URL, '_blank', 'noopener,noreferrer');
        break;
      case 'about':
        setSheet('about');
        break;
      case 'music':
        setSheet('music');
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

      {sheet === 'about' && (
        <InfoSheet
          icon="sparkles"
          title="رنگ‌آمیزی هنر نگارگری ایرانی"
          body={
            <>
              نسخهٔ ۱.۰
              <br/><br/>
              مجموعه‌ای از طرح‌های اصیل ایرانی برای رنگ‌آمیزی — تذهیب، نگارگری و گل‌و‌مرغ.
              <br/><br/>
              ساخته شده با عشق برای هنر ایرانی 🌿
            </>
          }
          onClose={() => setSheet(null)}
        />
      )}

      {sheet === 'music' && <MusicSheet onClose={() => setSheet(null)} />}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </ScreenBg>
  );
}

// ─── Music control bottom sheet ───────────────────────────────

function MusicSheet({ onClose }: { onClose: () => void }) {
  const m = useMusic();

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(20, 15, 5, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        direction: 'rtl', fontFamily: '"Vazirmatn", sans-serif',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: T.surface,
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          padding: '10px 24px 28px',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
          boxShadow: '0 -16px 50px rgba(0,0,0,0.25)',
          border: `1.5px solid ${T.accent}`,
        }}
      >
        <div style={{ width: 48, height: 5, borderRadius: 3, background: T.border, margin: '0 auto 18px' }}/>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <Icon name="music" size={40} color={T.primary} />
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginTop: 8 }}>موسیقی پس‌زمینه</div>
        </div>

        {!m.hasTracks ? (
          <div style={{
            background: T.bgDeep,
            border: `1px dashed ${T.accent}`,
            borderRadius: 14,
            padding: 18,
            fontSize: 13,
            lineHeight: 1.85,
            color: T.inkSoft,
            textAlign: 'right',
          }}>
            هنوز موسیقی به اپ اضافه نشده.
          </div>
        ) : (
          <>
            <div style={{
              background: T.bgDeep,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{m.track?.title ?? '—'}</div>
              {m.track?.artist && (
                <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>{m.track.artist}</div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 }}>
              <button onClick={m.prev} style={controlBtn()}>
                <Icon name="next" size={22} color={T.ink} />
              </button>
              <button onClick={m.toggle} style={controlBtn(T.primary)}>
                <Icon name={m.playing ? 'music-off' : 'music'} size={26} color="#fff" />
              </button>
              <button onClick={m.next} style={controlBtn()}>
                <Icon name="back" size={22} color={T.ink} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: T.inkMute, minWidth: 36 }}>بلندی</span>
              <input
                type="range"
                min={0} max={100} defaultValue={50}
                onChange={e => m.setVolume(parseInt(e.target.value, 10) / 100)}
                style={{ flex: 1, accentColor: T.primary }}
              />
            </div>
          </>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 18,
            padding: '11px 18px',
            background: 'transparent',
            color: T.inkMute,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            fontSize: 14, fontWeight: 600,
            fontFamily: 'Vazirmatn, sans-serif',
            cursor: 'pointer',
          }}
        >بستن</button>
      </div>
    </div>
  );
}

function controlBtn(bg: string = T.surfaceAlt): React.CSSProperties {
  return {
    width: 56, height: 56,
    borderRadius: '50%',
    background: bg,
    border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: bg === T.primary ? `0 4px 14px ${T.primary}44` : 'none',
  };
}
