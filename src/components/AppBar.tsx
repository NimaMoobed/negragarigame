// AppBar — نوار بالای صفحه (RTL، با دکمه‌ی بازگشت و عنوان وسط)

import { type ReactNode } from 'react';
import { T } from '../theme/classic';
import { Icon } from './Icon';
import { Tessellation } from './Ornaments';

interface Props {
  title?:       string;
  sub?:         string;
  onBack?:      () => void;
  onMenu?:      () => void;
  rightIcon?:   ReactNode;
  transparent?: boolean;
  large?:       boolean;
}

export function AppBar({ title, sub, onBack, onMenu, rightIcon, transparent = false, large = false }: Props) {
  return (
    <div
      style={{
        background:    transparent ? 'transparent' : T.surface,
        padding:       large ? '14px 16px 22px' : '12px 16px',
        direction:     'rtl',
        position:      'relative',
        borderBottom:  transparent ? 'none' : `1px solid ${T.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 36 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: T.surfaceAlt, color: T.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {/* RTL: next-glyph (>) points right → برگشت */}
            <Icon name="next" size={20} color={T.ink} />
          </button>
        )}
        <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
          {!large && title && (
            <>
              <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{title}</div>
              {sub && <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>{sub}</div>}
            </>
          )}
        </div>
        {onMenu && (
          <button
            onClick={onMenu}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: T.surfaceAlt, color: T.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Icon name="menu" size={20} color={T.ink} />
          </button>
        )}
        {rightIcon}
      </div>

      {large && title && (
        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <div style={{
            fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1.2,
            fontFamily: '"Vazirmatn", sans-serif',
          }}>{title}</div>
          {sub && <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>{sub}</div>}
        </div>
      )}

      {!transparent && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 6, opacity: 0.7 }}>
          <Tessellation color={T.accent} strokeWidth={0.8} />
        </div>
      )}
    </div>
  );
}
