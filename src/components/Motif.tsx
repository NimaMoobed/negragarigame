// Motif — ۶ نقش placeholder (پورت از motifs.jsx)
// Used for: category preview, onboarding hero, splash logo

interface MotifProps {
  color?: string;
  fill?:  string;
}

const baseStyle = { width: '100%', height: '100%' } as const;

export const Motif1 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50 10 C42 22, 38 32, 38 42 C38 52, 44 58, 50 60 C56 58, 62 52, 62 42 C62 32, 58 22, 50 10 Z"/>
    <path d="M50 60 C40 60, 30 65, 28 78 C26 86, 32 90, 38 88 C42 86, 46 82, 50 78 C54 82, 58 86, 62 88 C68 90, 74 86, 72 78 C70 65, 60 60, 50 60 Z"/>
    <circle cx="50" cy="50" r="4"/>
    <path d="M50 30 L50 50"/>
    <path d="M44 42 C46 45, 48 47, 50 48 C52 47, 54 45, 56 42"/>
  </svg>
);

export const Motif2 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50 12 C46 20, 40 24, 32 26 C26 28, 22 32, 22 40 C22 50, 30 56, 38 58 C42 60, 46 62, 50 64 C54 62, 58 60, 62 58 C70 56, 78 50, 78 40 C78 32, 74 28, 68 26 C60 24, 54 20, 50 12 Z"/>
    <path d="M50 64 L50 88"/>
    <path d="M50 72 C44 74, 38 78, 36 84"/>
    <path d="M50 72 C56 74, 62 78, 64 84"/>
    <circle cx="50" cy="38" r="6"/>
    <path d="M50 32 L50 44 M44 38 L56 38"/>
  </svg>
);

export const Motif3 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50 8 C44 14, 42 22, 44 30 L50 36 L56 30 C58 22, 56 14, 50 8 Z"/>
    <path d="M30 30 C24 38, 24 50, 32 58 L42 54 L40 42 C38 36, 34 32, 30 30 Z"/>
    <path d="M70 30 C76 38, 76 50, 68 58 L58 54 L60 42 C62 36, 66 32, 70 30 Z"/>
    <path d="M50 36 C42 40, 38 48, 40 58 C42 68, 48 74, 50 78 C52 74, 58 68, 60 58 C62 48, 58 40, 50 36 Z"/>
    <path d="M30 70 C36 74, 44 76, 50 76 C56 76, 64 74, 70 70 C72 78, 68 86, 60 90 L50 92 L40 90 C32 86, 28 78, 30 70 Z"/>
    <circle cx="50" cy="56" r="3"/>
  </svg>
);

export const Motif4 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <circle cx="50" cy="50" r="32"/>
    <circle cx="50" cy="50" r="20"/>
    <circle cx="50" cy="50" r="8"/>
    <path d="M50 18 L50 30 M82 50 L70 50 M50 82 L50 70 M18 50 L30 50"/>
    <path d="M27 27 L36 36 M73 27 L64 36 M73 73 L64 64 M27 73 L36 64"/>
    <path d="M50 30 C46 36, 46 44, 50 50 C54 44, 54 36, 50 30 Z"/>
    <path d="M50 70 C46 64, 46 56, 50 50 C54 56, 54 64, 50 70 Z"/>
    <path d="M30 50 C36 46, 44 46, 50 50 C44 54, 36 54, 30 50 Z"/>
    <path d="M70 50 C64 46, 56 46, 50 50 C56 54, 64 54, 70 50 Z"/>
  </svg>
);

export const Motif5 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50 88 C30 86, 20 70, 24 50 C28 32, 42 18, 56 14 C68 12, 78 18, 78 30 C78 42, 68 50, 56 50 C46 50, 40 56, 42 66 C44 76, 52 82, 60 80"/>
    <path d="M50 78 C38 76, 32 66, 34 54 C36 42, 46 32, 56 30 C62 28, 68 32, 66 40 C64 46, 56 50, 50 52"/>
    <circle cx="54" cy="36" r="3"/>
    <path d="M50 60 L52 70 M48 64 L46 72"/>
  </svg>
);

export const Motif6 = ({ color = '#222', fill = 'transparent' }: MotifProps) => (
  <svg viewBox="0 0 100 100" style={baseStyle} fill={fill} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50 12 L42 28 L50 36 L58 28 Z"/>
    <path d="M50 36 L36 44 L40 60 L50 56 L60 60 L64 44 Z"/>
    <path d="M50 56 C40 60, 32 70, 32 82 L50 84 L68 82 C68 70, 60 60, 50 56 Z"/>
    <path d="M30 50 C22 52, 18 60, 22 68 L34 64"/>
    <path d="M70 50 C78 52, 82 60, 78 68 L66 64"/>
    <circle cx="50" cy="48" r="3"/>
    <circle cx="50" cy="72" r="2"/>
  </svg>
);

const MOTIF_MAP = {
  motif1: Motif1,
  motif2: Motif2,
  motif3: Motif3,
  motif4: Motif4,
  motif5: Motif5,
  motif6: Motif6,
} as const;

export type MotifKey = keyof typeof MOTIF_MAP;

export function Motif({ name, color, fill }: { name: MotifKey } & MotifProps) {
  const M = MOTIF_MAP[name];
  return <M color={color} fill={fill} />;
}
