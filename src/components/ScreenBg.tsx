// ScreenBg — پس‌زمینه‌ی استاندارد همه‌ی صفحات (rtl + کاغذ کرم)

import { type ReactNode } from 'react';
import { T } from '../theme/classic';

interface Props {
  children:     ReactNode;
  withPattern?: boolean;
}

export function ScreenBg({ children, withPattern = false }: Props) {
  return (
    <div
      className="relative h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar"
      style={{
        background:    T.bg,
        fontFamily:    '"Vazirmatn", system-ui, sans-serif',
        direction:     'rtl',
        color:         T.ink,
      }}
    >
      {withPattern && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity:         0.05,
            backgroundImage: `radial-gradient(${T.accentDeep} 1px, transparent 1px)`,
            backgroundSize:  '16px 16px',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
