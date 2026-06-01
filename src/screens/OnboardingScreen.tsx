// Onboarding — ۳ اسلاید معرفی. فقط در اولین اجرا نمایش داده می‌شود.
// تصاویر hero هر اسلاید همان آیکن‌های ۳ دسته‌ی صفحه‌ی خانه هستند.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { PrimaryButton } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { CornerBracket } from '../components/Ornaments';
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

        {/* Hero — rounded card with the slide's image */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          <div style={{
            width: 240, height: 280,
            borderRadius: T.radius,
            background: T.surface,
            border: `1.5px solid ${T.accent}`,
            boxShadow: T.shadow,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src={s.imageUrl}
              alt={s.title}
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
            {/* Ornate corner brackets — same flourish as OrnateCard */}
            <div style={{ position: 'absolute', top: 6, left:  6 }}><CornerBracket color={T.accent} size={22} flip /></div>
            <div style={{ position: 'absolute', top: 6, right: 6 }}><CornerBracket color={T.accent} size={22}        /></div>
            <div style={{ position: 'absolute', bottom: 6, left:  6, transform: 'rotate(-90deg)' }}><CornerBracket color={T.accent} size={22} flip /></div>
            <div style={{ position: 'absolute', bottom: 6, right: 6, transform: 'rotate(90deg)'  }}><CornerBracket color={T.accent} size={22}        /></div>
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
