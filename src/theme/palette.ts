// PERSIAN_PALETTE — ۱۲ رنگ سنتی ایرانی برای ابزار رنگ‌آمیزی
// Ported from handoff themes.jsx > PERSIAN_PALETTE

export interface PaletteColor {
  hex: string;
  name: string;
}

export const PERSIAN_PALETTE: PaletteColor[] = [
  { hex: '#1E3A6B', name: 'لاجوردی'    },
  { hex: '#2C5396', name: 'آبی فیروزه' },
  { hex: '#0F7A6E', name: 'سبز اسلیمی' },
  { hex: '#3D7A2E', name: 'سبز برگ'    },
  { hex: '#B0392C', name: 'شنگرف'      },
  { hex: '#8C2A21', name: 'عُنّابی'     },
  { hex: '#D17A2B', name: 'حنایی'      },
  { hex: '#C49543', name: 'طلایی'      },
  { hex: '#E3C77D', name: 'زرنیخ'      },
  { hex: '#F0DCB0', name: 'کرم'        },
  { hex: '#704020', name: 'قهوه‌ای'    },
  { hex: '#2A1F12', name: 'مشکی'       },
];

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
