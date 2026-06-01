// InfoSheet — bottom sheet مودال برای جایگزینی alert() / confirm()
// alert/confirm سیستمی در WebView اندروید آدرس origin را نشان می‌دهد ("X says..."),
// که نباید لو برود. این مودال کاملاً اختصاصی است.

import { type ReactNode } from 'react';
import { T } from '../theme/classic';
import { Icon, type IconName } from '../components/Icon';
import { PrimaryButton, GhostButton } from '../components/Buttons';

interface Props {
  icon?:        IconName;
  title:        string;
  body?:        ReactNode;
  /** متن دکمه‌ی اصلی. اگر cancelText نباشد، فقط همین دکمه را نشان می‌دهد. */
  confirmText?: string;
  cancelText?:  string;
  onConfirm?:   () => void;
  onClose:      () => void;
  /** اگر danger=true، دکمه‌ی اصلی قرمز می‌شود (مثل پاک‌کردن). */
  danger?:      boolean;
}

export function InfoSheet({
  icon, title, body,
  confirmText = 'باشد',
  cancelText,
  onConfirm,
  onClose,
  danger,
}: Props) {
  const primaryHandler = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
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
          padding: '10px 24px 28px',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
          boxShadow: '0 -16px 50px rgba(0,0,0,0.25)',
          border: `1.5px solid ${T.accent}`,
        }}
      >
        <div style={{ width: 48, height: 5, borderRadius: 3, background: T.border, margin: '0 auto 18px' }}/>

        {icon && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: danger ? `${T.danger}22` : T.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={icon} size={30} color={danger ? T.danger : T.primary} />
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, lineHeight: 1.4 }}>{title}</div>
          {body && (
            <div style={{
              fontSize: 14, color: T.inkSoft,
              marginTop: 12, lineHeight: 1.85,
              textAlign: 'center',
            }}>
              {body}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton
            fullWidth
            onClick={primaryHandler}
            variant={danger ? 'danger' : 'primary'}
          >
            {confirmText}
          </PrimaryButton>
          {cancelText && (
            <GhostButton fullWidth onClick={onClose}>{cancelText}</GhostButton>
          )}
        </div>
      </div>
    </div>
  );
}
