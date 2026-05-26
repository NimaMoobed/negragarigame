// Icon — همه‌ی آیکن‌های اپ به‌صورت inline SVG
// Ported from handoff motifs.jsx > Icon

export type IconName =
  | 'lock' | 'check' | 'back' | 'next' | 'share'
  | 'brush' | 'bucket' | 'eraser' | 'pipette'
  | 'undo' | 'redo' | 'save' | 'zoom'
  | 'gallery' | 'settings' | 'home' | 'close'
  | 'star' | 'heart' | 'sparkles' | 'download'
  | 'qr' | 'flower' | 'leaf' | 'crown' | 'menu' | 'plus'
  | 'cafe-bazaar';

interface IconProps {
  name:         IconName;
  size?:        number;
  color?:       string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'lock':      return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'check':     return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'back':      return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'next':      return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'share':     return <svg {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></svg>;
    case 'brush':     return <svg {...p}><path d="M14 4l6 6-9 9-4 1 1-4z"/><path d="M11 7l6 6"/></svg>;
    case 'bucket':    return <svg {...p}><path d="M5 11l7-7 7 7-7 7-5-5"/><path d="M5 11h14"/><circle cx="20" cy="17" r="2"/></svg>;
    case 'eraser':    return <svg {...p}><path d="M3 17l8-8 6 6-8 8H5z"/><path d="M14 6l4 4"/></svg>;
    case 'pipette':   return <svg {...p}><path d="M14 4l6 6-9 9H5v-6z"/><path d="M11 7l6 6"/></svg>;
    case 'undo':      return <svg {...p}><path d="M9 8l-5 4 5 4"/><path d="M4 12h10a6 6 0 0 1 0 12h-3"/></svg>;
    case 'redo':      return <svg {...p}><path d="M15 8l5 4-5 4"/><path d="M20 12H10a6 6 0 0 0 0 12h3"/></svg>;
    case 'save':      return <svg {...p}><path d="M5 5h11l3 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M7 5v5h8V5M7 21v-7h10v7"/></svg>;
    case 'zoom':      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case 'gallery':   return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 17l5-4 5 4 3-2 5 3"/></svg>;
    case 'settings':  return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
    case 'home':      return <svg {...p}><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>;
    case 'close':     return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'star':      return <svg {...p}><path d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>;
    case 'heart':     return <svg {...p}><path d="M12 21s-7-4.5-9-9c-1.3-3 .3-7 4-7 2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.7 0 5.3 4 4 7-2 4.5-9 9-9 9z"/></svg>;
    case 'sparkles':  return <svg {...p}><path d="M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5z"/><path d="M19 14l.8 2 2 .8-2 .8L19 20l-.8-2-2-.8 2-.8z"/></svg>;
    case 'download':  return <svg {...p}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case 'qr':        return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v3M14 21h7"/></svg>;
    case 'flower':    return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 9V3M12 15v6M9 12H3M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    case 'leaf':      return <svg {...p}><path d="M4 20c0-10 6-16 16-16 0 10-6 16-16 16z"/><path d="M4 20L14 10"/></svg>;
    case 'crown':     return <svg {...p}><path d="M3 18h18M3 8l4 5 5-7 5 7 4-5v10H3z"/></svg>;
    case 'menu':      return <svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'plus':      return <svg {...p}><path d="M12 4v16M4 12h16"/></svg>;
    case 'cafe-bazaar':
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 4l8 4-8 4-8-4 8-4zm9 6.5v4.2l-8 4-8-4v-4.2l8 4 8-4z"/></svg>;
    default:          return null;
  }
}
