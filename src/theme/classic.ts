// Classic theme — کلاسیک سنتی (سبز اسلیمی + لاجوردی)
// Ported from handoff themes.jsx > THEMES.classic

export const T = {
  name:        'کلاسیک سنتی',
  nameEn:      'Classic',
  bg:          '#F6EFDD',
  bgDeep:      '#EFE5CB',
  surface:     '#FFFCF3',
  surfaceAlt:  '#F0E5C7',
  primary:     '#0F7A6E',
  primaryDeep: '#0A5950',
  primaryGlow: '#1FA193',
  accent:      '#1E3A6B',
  accentDeep:  '#142A52',
  accentSoft:  '#C8D2E5',
  danger:      '#B0392C',
  ink:         '#2A1F12',
  inkSoft:     '#5B4A2E',
  inkMute:     '#8C7651',
  border:      'rgba(30, 58, 107, 0.25)',
  borderDeep:  'rgba(30, 58, 107, 0.4)',
  shadow:      '0 8px 28px rgba(15, 122, 110, 0.18)',
  radius:      20,
  chrome:      'ornate' as const,
} as const;

export type Theme = typeof T;
