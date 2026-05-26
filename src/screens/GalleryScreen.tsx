// GalleryScreen — کارهای ذخیره‌شدهٔ کاربر (stub اولیه)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { FooterTabs } from './HomeScreen';
import { DESIGNS } from '../data/designs';
import { getValue } from '../lib/storage';
import { Icon } from '../components/Icon';

export function GalleryScreen() {
  const nav = useNavigate();
  const [saved, setSaved] = useState<Array<{ id: string; title: string; dataURL: string }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const items: Array<{ id: string; title: string; dataURL: string }> = [];
      for (const d of DESIGNS) {
        const v = await getValue(`design-${d.id}`);
        if (v) items.push({ id: d.id, title: d.title, dataURL: v });
      }
      setSaved(items);
      setLoaded(true);
    })();
  }, []);

  return (
    <ScreenBg>
      <AppBar title="کارهای من" />

      {!loaded && (
        <div style={{ padding: 32, textAlign: 'center', color: T.inkMute }}>در حال بارگذاری ...</div>
      )}

      {loaded && saved.length === 0 && (
        <div style={{ padding: 48, textAlign: 'center', color: T.inkMute, lineHeight: 1.8 }}>
          <Icon name="gallery" size={48} color={T.inkMute} />
          <div style={{ marginTop: 12 }}>
            هنوز کاری ذخیره نکرده‌اید.<br/>
            از صفحه‌ی خانه یک طرح را شروع کنید.
          </div>
        </div>
      )}

      {loaded && saved.length > 0 && (
        <div style={{
          padding: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {saved.map(s => (
            <div
              key={s.id}
              onClick={() => nav(`/coloring/${s.id}`)}
              style={{
                background: T.surface,
                borderRadius: T.radius,
                border: `1.5px solid ${T.accent}`,
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                boxShadow: T.shadow,
              }}
            >
              <img
                src={s.dataURL}
                alt={s.title}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      )}

      <FooterTabs active="gallery" />
    </ScreenBg>
  );
}
