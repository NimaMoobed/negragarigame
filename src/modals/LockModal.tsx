// LockModal — مودال قفل برای دسته‌های پولی
// منطق:
//   - دکمه‌ی "ثبت نظر در کافه‌بازار" → window.open('bazaar://...')
//   - دکمه‌ی "ریویو دادم، باز کن" → unlockAll() و بستن مودال (اعتماد به کاربر)

import { T } from '../theme/classic';
import { Icon } from '../components/Icon';
import { Motif } from '../components/Motif';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import type { Category } from '../data/categories';

const BAZAAR_URL = 'bazaar://details?id=app.negargari.iranian';

interface Props {
  category: Category;
  onClose:  () => void;
  onUnlock: () => void;       // به‌دست useUnlocked().unlockAll
}

export function LockModal({ category, onClose, onUnlock }: Props) {
  const review = () => {
    // در اپ اندروید (Capacitor) این لینک برنامه‌ی کافه‌بازار را باز می‌کند.
    // در مرورگر معمولی شکست می‌خورد ولی خطا نمی‌دهد.
    try { window.open(BAZAAR_URL, '_system'); }
    catch { window.location.href = BAZAAR_URL; }
  };

  const confirmReview = async () => {
    await onUnlock();
    onClose();
  };

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
          width: '100%',
          maxWidth: 520,
          background: T.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '10px 24px 32px',
          boxShadow: '0 -16px 50px rgba(0,0,0,0.25)',
          border: `1.5px solid ${T.accent}`,
        }}
      >
        {/* Handle */}
        <div style={{ width: 48, height: 5, borderRadius: 3, background: T.border, margin: '0 auto 18px' }}/>

        {/* Lock icon w/ category preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 92, height: 92, borderRadius: 24,
            background: T.surfaceAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', border: `1px solid ${T.border}`,
          }}>
            <div style={{ width: 60, height: 60, opacity: 0.35 }}>
              <Motif name={category.motifKey} color={T.ink} />
            </div>
            <div style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 36, height: 36, borderRadius: 18,
              background: T.accent, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${T.accent}66`,
            }}>
              <Icon name="lock" size={18} color="#fff" />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink }}>دستهٔ «{category.title}» قفل است</div>
          <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 10, lineHeight: 1.8, padding: '0 4px' }}>
            برای باز کردن این بخش کافیست در کافه‌بازار یک نظر دربارهٔ اپ ثبت کنید. حمایت شما به ما انرژی می‌دهد 🌿
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton fullWidth onClick={review} icon={<Icon name="star" size={18} color="#fff" />}>
            ثبت نظر در کافه‌بازار
          </PrimaryButton>
          <GhostButton fullWidth onClick={confirmReview}>
            ریویو دادم، باز کن
          </GhostButton>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: T.inkMute, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', padding: 4 }}
          >بعداً</button>
        </div>
      </div>
    </div>
  );
}
