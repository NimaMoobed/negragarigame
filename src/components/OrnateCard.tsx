// OrnateCard — کارت با ۴ corner bracket طلایی

import { type ReactNode, type CSSProperties } from 'react';
import { T } from '../theme/classic';
import { CornerBracket } from './Ornaments';

interface Props {
  children: ReactNode;
  padding?: number;
  onClick?: () => void;
  style?:   CSSProperties;
  className?: string;
}

export function OrnateCard({ children, padding = 12, onClick, style, className }: Props) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position:     'relative',
        background:   T.surface,
        border:       `1.5px solid ${T.accent}`,
        borderRadius: T.radius,
        padding,
        boxShadow:    T.shadow,
        cursor:       onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', top: 6, left:  6 }}><CornerBracket color={T.accent} size={20} flip /></div>
      <div style={{ position: 'absolute', top: 6, right: 6 }}><CornerBracket color={T.accent} size={20}        /></div>
      <div style={{ position: 'absolute', bottom: 6, left:  6, transform: 'rotate(-90deg)' }}><CornerBracket color={T.accent} size={20} flip /></div>
      <div style={{ position: 'absolute', bottom: 6, right: 6, transform: 'rotate(90deg)'  }}><CornerBracket color={T.accent} size={20}        /></div>
      {children}
    </div>
  );
}
