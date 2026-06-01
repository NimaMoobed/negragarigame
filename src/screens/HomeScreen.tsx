// HomeScreen — صفحه اصلی با ۳ دسته + footer tabs
// روی کارت قفل کلیک شد → LockModal باز شود (مدیریت در همین کامپوننت).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { Icon } from '../components/Icon';
import { Motif } from '../components/Motif';
import { Divider } from '../components/Ornaments';
import { LockModal } from '../modals/LockModal';
import { CATEGORIES, type Category } from '../data/categories';
import { useUnlocked } from '../hooks/useUnlocked';

export function HomeScreen() {
  const nav = useNavigate();
  const { isUnlocked, unlockAll, loaded } = useUnlocked();
  const [lockedCat, setLockedCat] = useState<Category | null>(null);

  if (!loaded) return null;

  const onCategoryTap = (cat: Category) => {
    if (isUnlocked(cat.id)) {
      nav(`/category/${cat.id}`);
    } else {
      setLockedCat(cat);
    }
  };

  return (
    <ScreenBg withPattern>
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        {/* Header */}
        <div style={{ padding: '20px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: T.inkSoft }}>درود بر شما 🌿</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginTop: 2, lineHeight: 1.2 }}>کدام طرح را رنگ کنیم؟</div>
          </div>
          <button
            onClick={() => nav('/gallery')}
            style={{
              width: 44, height: 44, borderRadius: 14,
              border: `1px solid ${T.border}`, background: T.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Icon name="gallery" size={20} color={T.ink} />
          </button>
        </div>

        <div style={{ padding: '4px 28px 18px' }}><Divider color={T.accent} /></div>

        {/* Categories */}
        <div style={{ padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              locked={!isUnlocked(cat.id)}
              onClick={() => onCategoryTap(cat)}
            />
          ))}
        </div>

        {/* Footer tabs */}
        <FooterTabs active="home" />
      </div>

      {lockedCat && (
        <LockModal
          category={lockedCat}
          onClose={() => setLockedCat(null)}
          onUnlock={unlockAll}
        />
      )}
    </ScreenBg>
  );
}

// ─────────────────────────────────────────────────────

function CategoryCard({ cat, locked, onClick }: { cat: Category; locked: boolean; onClick: () => void }) {
  const h = 132;
  return (
    <div onClick={onClick} style={{
      position: 'relative', display: 'flex', alignItems: 'stretch',
      background: T.surface,
      borderRadius: T.radius,
      border: `1px solid ${T.accent}`,
      boxShadow: T.shadow,
      overflow: 'hidden', cursor: 'pointer',
      minHeight: h,
    }}>
      {/* Motif preview */}
      <div style={{
        width: h + 12, flexShrink: 0,
        background: T.bgDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {cat.iconUrl ? (
          (cat.iconFit ?? 'contain') === 'cover' ? (
            // Fill entire preview area (great for full-colour artwork)
            <img
              src={cat.iconUrl}
              alt={cat.title}
              draggable={false}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          ) : (
            // Fit-with-padding (great for line-art with transparent background)
            <img
              src={cat.iconUrl}
              alt={cat.title}
              draggable={false}
              style={{
                width: '88%', height: '88%',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />
          )
        ) : (
          <div style={{ width: '70%', height: '70%' }}>
            <Motif name={cat.motifKey} color={T.primary} />
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 6,
          border: `1px dashed ${T.accent}`,
          borderRadius: T.radius - 6,
          opacity: 0.5,
        }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>{cat.title}</div>
          {locked && (
            <div style={{
              padding: '3px 8px', borderRadius: 99,
              fontSize: 10, fontWeight: 700,
              background: T.accentSoft, color: T.accentDeep,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Icon name="lock" size={11} color={T.accentDeep} />
              قفل
            </div>
          )}
        </div>
        <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.5 }}>{cat.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <div style={{ fontSize: 11.5, color: T.inkMute, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="flower" size={13} color={T.inkMute} />
            {cat.count} طرح
          </div>
        </div>
      </div>

      {/* Chevron (RTL: back-glyph < points left → ادامه) */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, color: locked ? T.inkMute : T.primary }}>
        <Icon name="back" size={20} color={locked ? T.inkMute : T.primary} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────

// FooterTabs renders two things:
//   1) A spacer (in normal flow) so screen content has room above the fixed bar
//   2) The actual fixed bar pinned to the bottom of the viewport
// This guarantees the tab bar is ALWAYS at the bottom of the screen, never floats
// up when content is short.
export function FooterTabs({ active }: { active: 'home' | 'gallery' | 'settings' }) {
  const nav = useNavigate();
  const tabs: Array<{ i: 'home' | 'gallery' | 'settings'; label: string; to: string }> = [
    { i: 'home',     label: 'خانه',       to: '/home' },
    { i: 'gallery',  label: 'کارهای من',  to: '/gallery' },
    { i: 'settings', label: 'تنظیمات',    to: '/settings' },
  ];

  return (
    <>
      {/* Spacer in normal flow: ~68px tab + safe-area inset */}
      <div style={{ height: 'calc(68px + env(safe-area-inset-bottom))' }} aria-hidden />

      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 30,
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        padding: '10px 24px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        display: 'flex', justifyContent: 'space-around',
        direction: 'rtl',
        fontFamily: '"Vazirmatn", sans-serif',
      }}>
        {tabs.map(t => (
          <div
            key={t.i}
            onClick={() => active !== t.i && nav(t.to)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active === t.i ? T.primary : T.inkMute,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            <Icon name={t.i} size={22} color={active === t.i ? T.primary : T.inkMute} />
            <div style={{ fontSize: 11, fontWeight: active === t.i ? 700 : 500 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
