// DesignListScreen — لیست طرح‌های یک دسته (گرید thumbnail)
// طرح‌های locked: true همراه با badge قفل نمایش داده می‌شوند و کلیک روی آن‌ها
// مودال «به‌زودی» باز می‌کند (پرداخت درون‌برنامه‌ای آینده).

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { Icon } from '../components/Icon';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { getCategoryById } from '../data/categories';
import { getDesignsByCategory, type Design } from '../data/designs';

export function DesignListScreen() {
  const nav = useNavigate();
  const { catId } = useParams<{ catId: string }>();
  const cat = catId ? getCategoryById(catId) : undefined;
  const designs = cat ? getDesignsByCategory(cat.id) : [];
  const [premiumDesign, setPremiumDesign] = useState<Design | null>(null);

  const onDesignTap = (d: Design) => {
    if (d.locked) setPremiumDesign(d);
    else nav(`/coloring/${d.id}`);
  };

  return (
    <ScreenBg>
      <AppBar
        title={cat?.title ?? 'طرح‌ها'}
        sub={cat?.sub}
        onBack={() => nav(-1)}
      />

      {!cat && (
        <div style={{ padding: 32, textAlign: 'center', color: T.inkMute }}>
          دسته یافت نشد.
        </div>
      )}

      {cat && designs.length === 0 && (
        <div style={{ padding: 48, textAlign: 'center', color: T.inkMute, lineHeight: 1.8 }}>
          هنوز طرحی برای این دسته اضافه نشده است.<br/>
          به‌زودی!
        </div>
      )}

      {cat && designs.length > 0 && (
        <div
          style={{
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}
        >
          {designs.map(d => (
            <DesignCard key={d.id} design={d} onTap={() => onDesignTap(d)} />
          ))}
        </div>
      )}

      {premiumDesign && (
        <PremiumModal design={premiumDesign} onClose={() => setPremiumDesign(null)} />
      )}
    </ScreenBg>
  );
}

// ─── Design card ──────────────────────────────────────────────

function DesignCard({ design, onTap }: { design: Design; onTap: () => void }) {
  return (
    <div
      onClick={onTap}
      style={{
        position: 'relative',
        background: T.surface,
        borderRadius: T.radius,
        border: `1.5px solid ${T.accent}`,
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        boxShadow: T.shadow,
        transition: 'transform .1s',
      }}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
      onPointerUp={e   => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img
        src={design.thumbUrl}
        alt={design.title}
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          filter: design.locked ? 'grayscale(0.6) opacity(0.7)' : 'none',
        }}
      />
      {design.locked && (
        <>
          {/* Soft overlay tint */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, transparent 50%, ${T.accent}22 100%)`,
            pointerEvents: 'none',
          }}/>
          {/* Lock badge */}
          <div style={{
            position: 'absolute',
            top: 8, left: 8,
            background: T.accent, color: '#fff',
            padding: '4px 10px',
            borderRadius: 99,
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 4,
            boxShadow: `0 2px 6px ${T.accent}66`,
          }}>
            <Icon name="lock" size={11} color="#fff" />
            ویژه
          </div>
        </>
      )}
    </div>
  );
}

// ─── Premium "coming soon" modal ──────────────────────────────

function PremiumModal({ design, onClose }: { design: Design; onClose: () => void }) {
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
          padding: '10px 24px 32px',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
          boxShadow: '0 -16px 50px rgba(0,0,0,0.25)',
          border: `1.5px solid ${T.accent}`,
        }}
      >
        <div style={{ width: 48, height: 5, borderRadius: 3, background: T.border, margin: '0 auto 18px' }}/>

        {/* Locked design preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 140, height: 140, borderRadius: 18,
            background: T.surfaceAlt,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${T.border}`,
          }}>
            <img
              src={design.thumbUrl}
              alt={design.title}
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                filter: 'grayscale(0.7) opacity(0.6)',
              }}
            />
            <div style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 44, height: 44, borderRadius: 22,
              background: T.accent, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${T.accent}66`,
            }}>
              <Icon name="lock" size={22} color="#fff" />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink }}>طرح ویژه</div>
          <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 10, lineHeight: 1.85, padding: '0 4px' }}>
            این طرح در نسخه‌ی پولی اپ در دسترس قرار می‌گیرد.
            <br/>
            به‌زودی با خرید درون‌برنامه‌ای می‌توانی همه‌ی طرح‌های ویژه را باز کنی.
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton fullWidth onClick={onClose}
            icon={<Icon name="sparkles" size={18} color="#fff" />}>
            باشد، فهمیدم
          </PrimaryButton>
          <GhostButton fullWidth onClick={onClose}>
            دیدن طرح‌های رایگان
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
