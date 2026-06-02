// ColorPickerModal — رنگ‌انتخاب‌کن اختصاصی (به‌جای input type=color سیستمی Chrome)
// چون input type=color در WebView اندروید dialog انگلیسی نشان می‌دهد، یک ماژول کامل فارسی می‌سازیم.

import { useEffect, useRef, useState } from 'react';
import { T } from '../theme/classic';
import { PrimaryButton, GhostButton } from '../components/Buttons';

interface Props {
  initialColor: string;       // e.g. "#0F7A6E"
  onClose:      () => void;
  onSelect:     (hex: string) => void;
}

interface HSV { h: number; s: number; v: number; }

const SV_SIZE = 240;

export function ColorPickerModal({ initialColor, onClose, onSelect }: Props) {
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(initialColor));
  const svRef  = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);

  // Draw the saturation/value 2D area each time hue changes
  useEffect(() => {
    drawSvCanvas(svRef.current, hsv.h);
  }, [hsv.h]);

  useEffect(() => {
    drawHueBar(hueRef.current);
  }, []);

  const currentHex = hsvToHex(hsv);

  const handleSvPointer = (e: React.PointerEvent) => {
    const canvas = svRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top)  / rect.height));
    setHsv(prev => ({ h: prev.h, s: x, v: 1 - y }));
  };

  const handleHuePointer = (e: React.PointerEvent) => {
    const canvas = hueRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHsv(prev => ({ h: x * 360, s: prev.s, v: prev.v }));
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

        <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, textAlign: 'center', marginBottom: 16 }}>
          انتخاب رنگ آزاد
        </div>

        {/* Saturation × Value picker */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1.4 / 1', maxWidth: SV_SIZE * 1.4, margin: '0 auto', touchAction: 'none' }}>
          <canvas
            ref={svRef}
            width={336} height={240}
            onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); handleSvPointer(e); }}
            onPointerMove={e => { if (e.buttons) handleSvPointer(e); }}
            style={{ width: '100%', height: '100%', borderRadius: 12, cursor: 'crosshair', display: 'block' }}
          />
          {/* Crosshair */}
          <div style={{
            position: 'absolute',
            left:  `calc(${hsv.s * 100}% - 8px)`,
            top:   `calc(${(1 - hsv.v) * 100}% - 8px)`,
            width: 16, height: 16,
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}/>
        </div>

        {/* Hue slider */}
        <div style={{ position: 'relative', width: '100%', marginTop: 16, touchAction: 'none' }}>
          <canvas
            ref={hueRef}
            width={360} height={20}
            onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); handleHuePointer(e); }}
            onPointerMove={e => { if (e.buttons) handleHuePointer(e); }}
            style={{ width: '100%', height: 22, borderRadius: 11, cursor: 'crosshair', display: 'block' }}
          />
          {/* Hue thumb */}
          <div style={{
            position: 'absolute',
            left: `calc(${(hsv.h / 360) * 100}% - 10px)`,
            top: -3,
            width: 20, height: 28,
            borderRadius: 6,
            background: '#fff',
            border: `2px solid ${currentHex}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}/>
        </div>

        {/* Preview + hex */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, marginBottom: 18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: currentHex,
            border: `2px solid ${T.border}`,
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.5)',
            flexShrink: 0,
          }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 2 }}>رنگ انتخاب‌شده</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, fontFamily: 'monospace', letterSpacing: 1, direction: 'ltr', textAlign: 'right' }}>
              {currentHex.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton fullWidth onClick={() => { onSelect(currentHex); onClose(); }}>
            انتخاب
          </PrimaryButton>
          <GhostButton fullWidth onClick={onClose}>
            انصراف
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

// ─── Color conversion utilities ─────────────────────────────

function hexToHsv(hex: string): HSV {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: hue, s, v: max };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)      { r = c; g = x; }
  else if (h < 120){ r = x; g = c; }
  else if (h < 180){ g = c; b = x; }
  else if (h < 240){ g = x; b = c; }
  else if (h < 300){ r = x; b = c; }
  else             { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hsvToHex({ h, s, v }: HSV): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Canvas drawing ─────────────────────────────────────────

function drawSvCanvas(canvas: HTMLCanvasElement | null, hue: number) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width, h = canvas.height;
  // Base color from hue at full saturation/value
  const { r, g, b } = hsvToRgb(hue, 1, 1);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);

  // White gradient left → right (saturation)
  const satGrad = ctx.createLinearGradient(0, 0, w, 0);
  satGrad.addColorStop(0, 'rgba(255,255,255,1)');
  satGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = satGrad;
  ctx.fillRect(0, 0, w, h);

  // Black gradient top → bottom (value)
  const valGrad = ctx.createLinearGradient(0, 0, 0, h);
  valGrad.addColorStop(0, 'rgba(0,0,0,0)');
  valGrad.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = valGrad;
  ctx.fillRect(0, 0, w, h);
}

function drawHueBar(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  for (let i = 0; i <= 6; i++) {
    const hue = i * 60;
    const { r, g, b } = hsvToRgb(hue, 1, 1);
    grad.addColorStop(i / 6, `rgb(${r},${g},${b})`);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}
