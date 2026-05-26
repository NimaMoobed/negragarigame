// Decorative ornaments — Corner brackets, tessellation, diamond, divider

interface CornerBracketProps {
  size?:        number;
  color?:       string;
  flip?:        boolean;
  strokeWidth?: number;
}

export function CornerBracket({ size = 28, color = '#C49543', flip = false, strokeWidth = 1.2 }: CornerBracketProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth={strokeWidth}
         style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M2 14 C2 7, 7 2, 14 2" strokeLinecap="round"/>
      <path d="M6 14 C6 9, 9 6, 14 6" strokeLinecap="round"/>
      <circle cx="14" cy="2" r="1.2" fill={color} stroke="none"/>
      <path d="M2 14 L2 18 M2 14 L6 14" strokeLinecap="round"/>
    </svg>
  );
}

export function Tessellation({ color = '#C49543', strokeWidth = 1 }: { color?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 12" style={{ width: '100%', height: 12 }} fill="none" stroke={color} strokeWidth={strokeWidth}>
      <path d="M0 6 L8 2 L16 6 L24 2 L32 6 L40 2 L48 6 L56 2 L64 6 L72 2 L80 6 L88 2 L96 6 L100 4"/>
      <path d="M0 6 L8 10 L16 6 L24 10 L32 6 L40 10 L48 6 L56 10 L64 6 L72 10 L80 6 L88 10 L96 6 L100 8"/>
    </svg>
  );
}

export function Diamond({ size = 8, color = '#C49543' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color}>
      <path d="M4 0 L8 4 L4 8 L0 4 Z"/>
    </svg>
  );
}

export function Divider({ color = '#C49543', mute = 0.5 }: { color?: string; mute?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: mute }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <Diamond size={6} color={color}/>
      <svg width="40" height="10" viewBox="0 0 40 10" fill="none" stroke={color} strokeWidth="1">
        <path d="M0 5 C8 1, 14 9, 20 5 C26 1, 32 9, 40 5"/>
      </svg>
      <Diamond size={6} color={color}/>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}
