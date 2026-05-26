// DesignListScreen — لیست طرح‌های یک دسته (گرید thumbnail)

import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { getCategoryById } from '../data/categories';
import { getDesignsByCategory } from '../data/designs';

export function DesignListScreen() {
  const nav = useNavigate();
  const { catId } = useParams<{ catId: string }>();
  const cat = catId ? getCategoryById(catId) : undefined;
  const designs = cat ? getDesignsByCategory(cat.id) : [];

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
            <div
              key={d.id}
              onClick={() => nav(`/coloring/${d.id}`)}
              style={{
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
                src={d.thumbUrl}
                alt={d.title}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
              />
            </div>
          ))}
        </div>
      )}
    </ScreenBg>
  );
}
