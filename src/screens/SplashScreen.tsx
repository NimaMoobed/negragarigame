// Splash — لوگو + شعار، بعد از ~1.5 ثانیه به Onboarding یا Home می‌رود
// (بسته به اینکه قبلاً onboarding دیده شده یا نه)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { CornerBracket, Divider } from '../components/Ornaments';
import { Icon } from '../components/Icon';
import { Motif3 } from '../components/Motif';
import { getValue } from '../lib/storage';

export function SplashScreen() {
  const nav = useNavigate();

  useEffect(() => {
    const start = Date.now();
    (async () => {
      const onboarded = await getValue('onboarded');
      // حداقل ۱.۲ ثانیه نمایش بدهیم، حتی اگر storage فوری جواب داد
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 1200 - elapsed);
      setTimeout(() => {
        nav(onboarded === '1' ? '/home' : '/onboarding', { replace: true });
      }, wait);
    })();
  }, [nav]);

  return (
    <ScreenBg withPattern>
      <div style={{
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 24,
        textAlign: 'center',
      }}>
        {/* Logo box */}
        <div style={{
          width: 140, height: 140, borderRadius: 36,
          background: `linear-gradient(145deg, ${T.primary}, ${T.primaryDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 16px 50px ${T.primary}44, inset 0 1px 0 ${T.accent}55`,
          border: `1.5px solid ${T.accent}`,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 8, left:  8 }}><CornerBracket color={T.accent} size={22} flip /></div>
          <div style={{ position: 'absolute', top: 8, right: 8 }}><CornerBracket color={T.accent} size={22}        /></div>
          <div style={{ position: 'absolute', bottom: 8, left:  8, transform: 'rotate(-90deg)' }}><CornerBracket color={T.accent} size={22} flip /></div>
          <div style={{ position: 'absolute', bottom: 8, right: 8, transform: 'rotate(90deg)'  }}><CornerBracket color={T.accent} size={22}        /></div>
          <div style={{ width: 78, height: 78 }}>
            <Motif3 color={T.accent} fill="transparent" />
          </div>
        </div>

        {/* Title */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1.2 }}>رنگ‌آمیزی</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.primary, marginTop: 4, lineHeight: 1.2 }}>هنر نگارگری ایرانی</div>
        </div>

        <div style={{ width: 220, marginTop: 16 }}>
          <Divider color={T.accent} mute={0.6} />
        </div>

        <div style={{
          marginTop: 'auto',
          paddingTop: 80,
          color: T.inkMute,
          fontSize: 12,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="sparkles" size={14} color={T.accent} />
          ساخته شده با عشق برای هنر ایرانی
        </div>
      </div>
    </ScreenBg>
  );
}
