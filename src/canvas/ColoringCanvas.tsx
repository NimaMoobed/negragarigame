// ColoringCanvas — کامپوننت کانواس رنگ‌آمیزی با Flood Fill + قلم‌مو + Undo/Redo

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { floodFill, BOUNDARY_THRESHOLD } from './floodFill';
import { hexToRgb } from '../theme/palette';

export type Tool = 'fill' | 'brush' | 'eraser' | 'pipette';

interface Props {
  designUrl:     string;
  tool:          Tool;
  color:         string;     // hex
  brushSize:     number;
  onColorPicked?: (hex: string) => void;
  onChange?:     () => void;   // فراخوانی بعد از هر تغییر برای autoSave
}

export interface ColoringCanvasHandle {
  undo:        () => void;
  redo:        () => void;
  clear:       () => void;
  canUndo:     () => boolean;
  canRedo:     () => boolean;
  toDataURL:   () => string;
  loadSaved:   (dataURL: string) => Promise<void>;
}

const SIZE = 1024;
const MAX_HISTORY = 50;

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, Props>(function ColoringCanvas(
  { designUrl, tool, color, brushSize, onColorPicked, onChange },
  ref,
) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const pristineRef  = useRef<ImageData | null>(null);   // طرح خط‌خامِ اولیه
  const lastPtRef    = useRef<{ x: number; y: number } | null>(null);
  const activePidRef = useRef<number | null>(null);
  const toolRef      = useRef<Tool>(tool);
  const colorRef     = useRef<string>(color);
  const brushSizeRef = useRef<number>(brushSize);

  // به‌روزرسانی ref ها (تا handler ها همیشه نسخه‌ی فعلی را ببینند)
  toolRef.current = tool;
  colorRef.current = color;
  brushSizeRef.current = brushSize;

  // Load design when URL changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;
    (async () => {
      // White fill
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, SIZE, SIZE);

      const img = await loadImage(designUrl);
      if (cancelled) return;

      // Fit image into canvas keeping aspect ratio
      const scale = Math.min(SIZE / img.width, SIZE / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);

      // Threshold so line-art is pure B/W (defensive)
      thresholdLineArt(ctx);

      pristineRef.current  = ctx.getImageData(0, 0, SIZE, SIZE);
      undoStackRef.current = [];
      redoStackRef.current = [];
    })();

    return () => { cancelled = true; };
  }, [designUrl]);

  useImperativeHandle(ref, () => ({
    undo: () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const stack = undoStackRef.current;
      if (stack.length === 0) return;
      redoStackRef.current.push(ctx.getImageData(0, 0, SIZE, SIZE));
      ctx.putImageData(stack.pop()!, 0, 0);
      onChange?.();
    },
    redo: () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const stack = redoStackRef.current;
      if (stack.length === 0) return;
      undoStackRef.current.push(ctx.getImageData(0, 0, SIZE, SIZE));
      ctx.putImageData(stack.pop()!, 0, 0);
      onChange?.();
    },
    clear: () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const pristine = pristineRef.current;
      if (!pristine) return;
      pushUndo(ctx);
      ctx.putImageData(pristine, 0, 0);
      onChange?.();
    },
    canUndo: () => undoStackRef.current.length > 0,
    canRedo: () => redoStackRef.current.length > 0,
    toDataURL: () => canvasRef.current!.toDataURL('image/png'),
    loadSaved: async (dataURL) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = await loadImage(dataURL);
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
    },
  }), [onChange]);

  function pushUndo(ctx: CanvasRenderingContext2D) {
    undoStackRef.current.push(ctx.getImageData(0, 0, SIZE, SIZE));
    if (undoStackRef.current.length > MAX_HISTORY) undoStackRef.current.shift();
    redoStackRef.current = [];
  }

  function toCanvasCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (SIZE / rect.width),
      y: (e.clientY - rect.top)  * (SIZE / rect.height),
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (activePidRef.current !== null) return;
    activePidRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const p = toCanvasCoords(e);
    const t = toolRef.current;

    if (t === 'pipette') {
      const px = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
      const hex = `#${[px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`;
      onColorPicked?.(hex.toUpperCase());
      activePidRef.current = null;
      return;
    }

    pushUndo(ctx);

    if (t === 'fill') {
      const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
      const c = activeRGB();
      floodFill(imgData.data, SIZE, SIZE, p.x, p.y, c.r, c.g, c.b);
      ctx.putImageData(imgData, 0, 0);
      lastPtRef.current = null;
      onChange?.();
    } else {
      stampAt(ctx, p.x, p.y);
      lastPtRef.current = p;
      onChange?.();
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerId !== activePidRef.current) return;
    const t = toolRef.current;
    if (t === 'fill' || t === 'pipette') return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const p = toCanvasCoords(e);
    if (lastPtRef.current) strokeLine(ctx, lastPtRef.current, p);
    else stampAt(ctx, p.x, p.y);
    lastPtRef.current = p;
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerId !== activePidRef.current) return;
    activePidRef.current = null;
    lastPtRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    onChange?.();
  }

  function activeRGB() {
    if (toolRef.current === 'eraser') return { r: 255, g: 255, b: 255 };
    return hexToRgb(colorRef.current);
  }

  function strokeLine(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }) {
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const spacing = Math.max(1, brushSizeRef.current * 0.4);
    const steps = Math.max(1, Math.ceil(dist / spacing));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      stampAt(ctx, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }
  }

  function stampAt(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const r = Math.max(1, brushSizeRef.current);
    const xmin = Math.max(0, Math.floor(cx - r));
    const xmax = Math.min(SIZE - 1, Math.ceil(cx + r));
    const ymin = Math.max(0, Math.floor(cy - r));
    const ymax = Math.min(SIZE - 1, Math.ceil(cy + r));
    const w = xmax - xmin + 1;
    const h = ymax - ymin + 1;
    if (w <= 0 || h <= 0) return;

    const img = ctx.getImageData(xmin, ymin, w, h);
    const d = img.data;
    const c = activeRGB();
    const r2 = r * r;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (xmin + x) - cx;
        const dy = (ymin + y) - cy;
        if (dx * dx + dy * dy > r2) continue;
        const idx = (y * w + x) * 4;
        // Preserve line-art
        if (d[idx] < BOUNDARY_THRESHOLD && d[idx + 1] < BOUNDARY_THRESHOLD && d[idx + 2] < BOUNDARY_THRESHOLD) continue;
        d[idx]     = c.r;
        d[idx + 1] = c.g;
        d[idx + 2] = c.b;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, xmin, ymin);
  }

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        width:        '100%',
        height:       '100%',
        maxWidth:     '100%',
        maxHeight:    '100%',
        aspectRatio:  '1 / 1',
        background:   '#fff',
        borderRadius: 8,
        boxShadow:    '0 4px 20px rgba(0,0,0,0.15)',
        touchAction:  'none',
        cursor:       tool === 'pipette' ? 'crosshair' : 'pointer',
      }}
    />
  );
});

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function thresholdLineArt(ctx: CanvasRenderingContext2D) {
  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = (d[i] + d[i + 1] + d[i + 2]) / 3;
    const v = gray < 128 ? 0 : 255;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
