// Onboarding — ۳ اسلاید معرفی. فقط در اولین اجرا نمایش داده می‌شود.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { PrimaryButton } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { Motif } from '../components/Motif';
import { ONBOARDING } from '../data/onboarding';
import { setValue } from '../lib/storage';

export function OnboardingScreen() {
  const nav = useNavigate();
  const [slide, setSlide] = useState(0);
  const s = ONBOARDING[slide];

  const finish = async () => {
    await setValue('onboarded', '1');
    nav('/home', { replace: true });
  };

  const next = () => {
    if (slide < ONBOARDING.length - 1) setSlide(slide + 1);
    else finish();
  };

  return (
    <ScreenBg withPattern>
      <div style={{
        height: '100vh', minHeight: 600,
        display: 'flex', flexDirection: 'column',
        padding: '40px 28px 32px',
      }}>
        {/* Skip */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={finish}
            style={{ background: 'transparent', border: 'none', color: T.inkSoft, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >رد کردن</button>
        </div>

        {/* Hero */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          <div style={{
            width: 220, height: 220, borderRadius: 110,
            background: T.surfaceAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{ width: 150, height: 150 }}>
              <Motif name={s.motifKey} color={T.primary} />
            </div>
            <svg viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} fill="none" stroke={T.accent} strokeWidth="1">
              <circle cx="110" cy="110" r="108" strokeDasharray="2 4" />
            </svg>
          </div>

          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, lineHeight: 1.4, marginBottom: 14 }}>{s.title}</div>
            <div style={{ fontSize: 14.5, color: T.inkSoft, lineHeight: 1.85 }}>{s.text}</div>
          </div>
        </div>

        {/* Dots + Next button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {ONBOARDING.map((_, i) => (
              <div key={i} style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slide ? T.primary : T.border,
                transition: 'width .3s',
              }} />
            ))}
          </div>
          <PrimaryButton
            onClick={next}
            icon={slide < ONBOARDING.length - 1 ? <Icon name="back" size={18} color="#fff" /> : null}
          >
            {slide < ONBOARDING.length - 1 ? 'بعدی' : 'شروع کنیم'}
          </PrimaryButton>
        </div>
      </div>
    </ScreenBg>
  );
}
