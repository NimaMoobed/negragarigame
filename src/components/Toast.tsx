// Toast — پیام کوتاه شناور (جایگزین alert برای پیام‌های یک‌خطی)

import { useEffect } from 'react';

interface Props {
  message:  string;
  onClose:  () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 2000 }: Props) {
  useEffect(() => {
    const id = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(id);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(28px + env(safe-area-inset-bottom))',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(42, 31, 18, 0.92)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 24,
      fontSize: 14,
      fontFamily: '"Vazirmatn", sans-serif',
      direction: 'rtl',
      zIndex: 200,
      maxWidth: '85%',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      animation: 'toast-in .2s ease-out',
    }}>
      {message}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
