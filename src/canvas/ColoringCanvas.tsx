// ColoringCanvas — Flood Fill + قلم‌مو + Undo/Redo + پینچ‌زوم/پن دو-انگشتی
//
// منطق تعامل:
//   - یک انگشت → ابزار جاری (fill/brush/eraser/pipette) را اعمال می‌کند
//   - دو انگشت → حالت زوم/پن (هرگونه استروک جاری متوقف می‌شود؛ تغییری به بوم اعمال نمی‌شود)
//   - بازگشت به یک انگشت → دوباره نقاشی (ولی نه ادامه‌ی استروک قبلی)

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { floodFill, BOUNDARY_THRESHOLD } from './floodFill';
import { hexToRgb } from '../theme/palette';

export type Tool = 'fill' | 'brush' | 'eraser' | 'pipette';

interface Props {
  designUrl:     string;
  tool:          Tool;
  color:         string;
  brushSize:     number;
  onColorPicked?: (hex: string) => void;
  onChange?:     () => void;
}

export interface ColoringCanvasHandle {
  undo:        () => void;
  redo:        () => void;
  clear:       () => void;
  resetZoom:   () => void;
  canUndo:     () => boolean;
  canRedo:     () => boolean;
  toDataURL:   () => string;
  loadSaved:   (dataURL: string) => Promise<void>;
}

const SIZE = 1024;
const MAX_HISTORY = 50;
const MIN_SCALE = 1;
const MAX_SCALE = 5;

interface PinchStart {
  dist:  number;
  midX:  number;
  midY:  number;
  scale: number;
  tx:    number;
  ty:    number;
}

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, Props>(function ColoringCanvas(
  { designUrl, tool, color, brushSize, onColorPicked, onChange },
  ref,
) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const pristineRef  = useRef<ImageData | null>(null);
  const lastPtRef    = useRef<{ x: number; y: number } | null>(null);

  // pointers tracked across the canvas — pointerId → last client position
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  // id of the pointer currently "painting" (only valid when exactly one finger is down)
  const paintingPidRef = useRef<number | null>(null);
  const pinchStartRef  = useRef<PinchStart | null>(null);

  const toolRef      = useRef<Tool>(tool);
  const colorRef     = useRef<string>(color);
  const brushSizeRef = useRef<number>(brushSize);
  toolRef.current = tool;
  colorRef.current = color;
  brushSizeRef.current = brushSize;

  // Transform state (applied via CSS to the canvas itself)
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // ─── Load design ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;
    (async () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, SIZE, SIZE);

      let img: HTMLImageElement;
      try {
        img = await loadImage(designUrl);
      } catch (err) {
        console.error('Failed to load design image:', designUrl, err);
        return;
      }
      if (cancelled) return;

      const s = Math.min(SIZE / img.width, SIZE / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);

      // NOTE: no hard threshold at load — preserves the original artistic tonality.
      // floodFill uses wall-detection + color tolerance to fill cleanly.

      pristineRef.current  = ctx.getImageData(0, 0, SIZE, SIZE);
      undoStackRef.current = [];
      redoStackRef.current = [];
    })();

    return () => { cancelled = true; };
  }, [designUrl]);

  // ─── Imperative API ──────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    undo: () => {
      const ctx = canvasRef.current!.getContext('2d')!;
      const stack = undoStackRef.current;
      if (stack.length === 0) return;
      redoStackRef.current.push(ctx.getImageData(0, 0, SIZE, SIZE));
      ctx.putImageData(stack.pop()!, 0, 0);
      onChange?.();
    },
    redo: () => {
      const ctx = canvasRef.current!.getContext('2d')!;
      const stack = redoStackRef.current;
      if (stack.length === 0) return;
      undoStackRef.current.push(ctx.getImageData(0, 0, SIZE, SIZE));
      ctx.putImageData(stack.pop()!, 0, 0);
      onChange?.();
    },
    clear: () => {
      const ctx = canvasRef.current!.getContext('2d')!;
      const pristine = pristineRef.current;
      if (!pristine) return;
      pushUndo(ctx);
      ctx.putImageData(pristine, 0, 0);
      onChange?.();
    },
    resetZoom: () => {
      setScale(1); setTx(0); setTy(0);
    },
    canUndo: () => undoStackRef.current.length > 0,
    canRedo: () => redoStackRef.current.length > 0,
    toDataURL: () => canvasRef.current!.toDataURL('image/png'),
    loadSaved: async (dataURL) => {
      const ctx = canvasRef.current!.getContext('2d')!;
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

  function toCanvasCoords(clientX: number, clientY: number) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (SIZE / rect.width),
      y: (clientY - rect.top)  * (SIZE / rect.height),
    };
  }

  function activeRGB() {
    if (toolRef.current === 'eraser') return { r: 255, g: 255, b: 255 };
    return hexToRgb(colorRef.current);
  }

  function pinchInfoFromPointers() {
    const pts = Array.from(activePointersRef.current.values());
    if (pts.length !== 2) return null;
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    return {
      dist: Math.hypot(dx, dy),
      midX: (pts[0].x + pts[1].x) / 2,
      midY: (pts[0].y + pts[1].y) / 2,
    };
  }

  // ─── Pointer handlers ────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (pristineRef.current === null) return;
    e.preventDefault();

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* fine */ }

    const count = activePointersRef.current.size;

    if (count === 1) {
      // Single finger — start painting
      paintingPidRef.current = e.pointerId;
      startPaintStroke(e.clientX, e.clientY);
    } else if (count === 2) {
      // Second finger — enter pinch/pan mode, cancel painting
      paintingPidRef.current = null;
      lastPtRef.current = null;
      const info = pinchInfoFromPointers()!;
      pinchStartRef.current = {
        dist:  info.dist,
        midX:  info.midX,
        midY:  info.midY,
        scale,
        tx,
        ty,
      };
    }
    // 3+ fingers: ignored (kept in the map but no effect)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const count = activePointersRef.current.size;

    if (count >= 2 && pinchStartRef.current) {
      const info = pinchInfoFromPointers();
      if (!info) return;
      const start = pinchStartRef.current;
      const factor = info.dist / start.dist;
      const newScale = clamp(start.scale * factor, MIN_SCALE, MAX_SCALE);
      const newTx = start.tx + (info.midX - start.midX);
      const newTy = start.ty + (info.midY - start.midY);
      setScale(newScale);
      // When scale is back to 1, snap pan back to 0 so canvas re-centers
      if (newScale <= MIN_SCALE + 0.001) { setTx(0); setTy(0); }
      else { setTx(newTx); setTy(newTy); }
      return;
    }

    if (count === 1 && e.pointerId === paintingPidRef.current) {
      continuePaintStroke(e.clientX, e.clientY);
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.delete(e.pointerId);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* fine */ }

    if (e.pointerId === paintingPidRef.current) {
      paintingPidRef.current = null;
      lastPtRef.current = null;
      onChange?.();
    }

    // If we drop below 2 fingers, exit pinch (don't auto-resume painting with the
    // remaining finger to avoid confusing strokes)
    if (activePointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
  }

  // ─── Paint strokes ───────────────────────────────────────────
  function startPaintStroke(clientX: number, clientY: number) {
    const ctx = canvasRef.current!.getContext('2d', { willReadFrequently: true })!;
    const p = toCanvasCoords(clientX, clientY);
    const t = toolRef.current;

    if (t === 'pipette') {
      const px = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
      const hex = `#${[px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`;
      onColorPicked?.(hex.toUpperCase());
      paintingPidRef.current = null;
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

  function continuePaintStroke(clientX: number, clientY: number) {
    const t = toolRef.current;
    if (t === 'fill' || t === 'pipette') return;
    const ctx = canvasRef.current!.getContext('2d', { willReadFrequently: true })!;
    const p = toCanvasCoords(clientX, clientY);
    if (lastPtRef.current) strokeLine(ctx, lastPtRef.current, p);
    else stampAt(ctx, p.x, p.y);
    lastPtRef.current = p;
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
        width:           '100%',
        height:          '100%',
        maxWidth:        '100%',
        maxHeight:       '100%',
        aspectRatio:     '1 / 1',
        background:      '#fff',
        borderRadius:    8,
        boxShadow:       '0 4px 20px rgba(0,0,0,0.15)',
        touchAction:     'none',
        cursor:          tool === 'pipette' ? 'crosshair' : 'pointer',
        transform:       `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: 'center center',
        transition:      pinchStartRef.current ? 'none' : 'transform 0.12s ease-out',
        willChange:      'transform',
      }}
    />
  );
});

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// thresholdLineArt was removed — we now preserve the original tonality of the
// designs. The flood-fill algorithm in floodFill.ts handles soft/gray boundaries
// via the WALL_THRESHOLD + color-tolerance predicate.
