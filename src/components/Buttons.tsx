// PrimaryButton + GhostButton — دکمه‌های اصلی اپ

import { type ReactNode } from 'react';
import { T } from '../theme/classic';

interface BtnProps {
  children:    ReactNode;
  onClick?:    () => void;
  fullWidth?:  boolean;
  icon?:       ReactNode;
  variant?:    'primary' | 'accent';
  disabled?:   boolean;
}

export function PrimaryButton({ children, onClick, fullWidth, icon, variant = 'primary', disabled }: BtnProps) {
  const bg = variant === 'primary' ? T.primary : T.accent;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width:       fullWidth ? '100%' : 'auto',
        padding:     '12px 20px',
        background:  disabled ? T.inkMute : bg,
        color:       '#fff',
        border:      'none',
        borderRadius: 12,
        fontSize:    15,
        fontWeight:  700,
        fontFamily:  'Vazirmatn, sans-serif',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        display:     'inline-flex',
        alignItems:  'center',
        justifyContent: 'center',
        gap:         8,
        boxShadow:   disabled ? 'none' : `0 4px 12px ${T.primary}33`,
        opacity:     disabled ? 0.7 : 1,
        transition:  'transform .1s, opacity .15s',
      }}
      onPointerDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={e   => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, fullWidth, icon, disabled }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width:       fullWidth ? '100%' : 'auto',
        padding:     '11px 18px',
        background:  'transparent',
        color:       T.primary,
        border:      `1.5px solid ${T.borderDeep}`,
        borderRadius: 12,
        fontSize:    14,
        fontWeight:  600,
        fontFamily:  'Vazirmatn, sans-serif',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        display:     'inline-flex',
        alignItems:  'center',
        justifyContent: 'center',
        gap:         8,
        opacity:     disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
