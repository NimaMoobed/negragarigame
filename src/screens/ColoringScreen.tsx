// ColoringScreen — قلب اپ
// Layout (طراحی جدید):
//   - Header کوچک: back | undo | redo | clear | share
//   - بوم (flex 1)
//   - Tool row: fill / brush / eraser / pipette  + brush-size slider (when brush/eraser)
//   - Palette row: ۱۲ رنگ سنتی + دکمه‌ی color-wheel برای رنگ آزاد

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { Icon, type IconName } from '../components/Icon';
import { PERSIAN_PALETTE } from '../theme/palette';
import { getDesignById } from '../data/designs';
import { ColoringCanvas, type ColoringCanvasHandle, type Tool } from '../canvas/ColoringCanvas';
import { getValue, setValue } from '../lib/storage';
import { useMusic } from '../hooks/useMusic';

const TOOLS: Array<{ id: Tool; icon: IconName; label: string }> = [
  { id: 'fill',    icon: 'bucket',  label: 'سطل رنگ'    },
  { id: 'brush',   icon: 'brush',   label: 'قلم آزاد'   },
  { id: 'eraser',  icon: 'eraser',  label: 'پاک‌کن'     },
  { id: 'pipette', icon: 'pipette', label: 'قطره‌چکان' },
];

export function ColoringScreen() {
  const nav = useNavigate();
  const { designId } = useParams<{ designId: string }>();
  const design = designId ? getDesignById(designId) : undefined;

  const canvasRef = useRef<ColoringCanvasHandle>(null);
  const m = useMusic();
  const [tool, setTool] = useState<Tool>('fill');
  const [color, setColor] = useState<string>(PERSIAN_PALETTE[0].hex);
  const [brushSize, setBrushSize] = useState<number>(14);
  const saveTimer = useRef<number | null>(null);

  const storageKey = design ? `design-${design.id}` : null;

  // Restore saved progress
  useEffect(() => {
    if (!storageKey) return;
    let cancelled = false;
    (async () => {
      await new Promise(r => setTimeout(r, 300));
      const saved = await getValue(storageKey);
      if (!cancelled && saved && canvasRef.current) {
        await canvasRef.current.loadSaved(saved);
      }
    })();
    return () => { cancelled = true; };
  }, [storageKey]);

  const onCanvasChange = () => {
    if (!storageKey) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (canvasRef.current) {
        setValue(storageKey, canvasRef.current.toDataURL());
      }
    }, 800);
  };

  if (!design) {
    return (
      <ScreenBg>
        <div style={{ padding: 32, textAlign: 'center', color: T.inkMute }}>طرح یافت نشد.</div>
      </ScreenBg>
    );
  }

  // Whether the currently-selected color is one of the preset palette swatches
  const isCustomColor = !PERSIAN_PALETTE.some(c => c.hex.toUpperCase() === color.toUpperCase());

  return (
    <ScreenBg>
      {/* ═══════════ HEADER (compact: 5 buttons) ═══════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px',
        paddingTop: 'calc(10px + env(safe-area-inset-top))',
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        gap: 6,
      }}>
        <button onClick={() => nav(-1)} style={iconBtn(T.surfaceAlt)} aria-label="بازگشت">
          <Icon name="next" size={20} color={T.ink} />
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => canvasRef.current?.undo()} style={iconBtn(T.surfaceAlt)} aria-label="برگشت">
            <Icon name="undo" size={20} color={T.ink} />
          </button>
          <button onClick={() => canvasRef.current?.redo()} style={iconBtn(T.surfaceAlt)} aria-label="دوباره">
            <Icon name="redo" size={20} color={T.ink} />
          </button>
          <button
            onClick={() => {
              if (confirm('همه‌ی رنگ‌ها از این طرح پاک شود؟')) canvasRef.current?.clear();
            }}
            style={iconBtn(T.surfaceAlt)}
            aria-label="پاک کردن"
          >
            <Icon name="trash" size={20} color={T.danger} />
          </button>
          <button
            onClick={() => {
              if (!m.hasTracks) {
                alert('هنوز موسیقی به اپ اضافه نشده است.\nاز تنظیمات راهنمای اضافه‌کردن را ببین.');
                return;
              }
              m.toggle();
            }}
            style={iconBtn(m.playing ? T.primary : T.surfaceAlt)}
            aria-label="موسیقی"
            title={m.hasTracks ? (m.playing ? 'توقف' : 'پخش موسیقی') : 'موسیقی اضافه نشده'}
          >
            <Icon name={m.playing ? 'music' : 'music-off'} size={20} color={m.playing ? '#fff' : T.ink} />
          </button>
          <button onClick={() => nav(`/share/${designId}`)} style={iconBtn(T.primary)} aria-label="اشتراک">
            <Icon name="share" size={20} color="#fff" />
          </button>
        </div>
      </div>

      {/* ═══════════ CANVAS ═══════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T.bgDeep,
        padding: 12,
        overflow: 'hidden',
        minHeight: 'calc(100vh - 280px)',
      }}>
        <ColoringCanvas
          ref={canvasRef}
          designUrl={design.fullUrl}
          tool={tool}
          color={color}
          brushSize={brushSize}
          onColorPicked={hex => { setColor(hex); setTool('fill'); }}
          onChange={onCanvasChange}
        />
      </div>

      {/* ═══════════ TOOLS ROW ═══════════ */}
      <div style={{
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        padding: '8px 14px 4px',
        display: 'flex', justifyContent: 'space-around', gap: 6,
      }}>
        {TOOLS.map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            style={toolBtn(tool === t.id)}
            aria-label={t.label}
            title={t.label}
          >
            <Icon name={t.icon} size={22} color={tool === t.id ? '#fff' : T.ink} />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: tool === t.id ? '#fff' : T.inkSoft,
              marginTop: 2,
            }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════ BRUSH SIZE (when brush/eraser) ═══════════ */}
      {(tool === 'brush' || tool === 'eraser') && (
        <div style={{
          background: T.surface,
          padding: '0 16px 8px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 12, color: T.inkSoft, minWidth: 64 }}>اندازه</span>
          <input
            type="range"
            min={4}
            max={60}
            value={brushSize}
            onChange={e => setBrushSize(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: T.primary }}
          />
          <div style={{
            width:  Math.min(36, brushSize),
            height: Math.min(36, brushSize),
            borderRadius: '50%',
            background: tool === 'eraser' ? '#fff' : color,
            border: `2px solid ${T.border}`,
            flexShrink: 0,
          }}/>
        </div>
      )}

      {/* ═══════════ PALETTE + COLOR WHEEL ═══════════ */}
      <div style={{
        background: T.surface,
        padding: '8px 14px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {/* Color wheel — custom color picker */}
        <label
          style={{ position: 'relative', width: 42, height: 42, flexShrink: 0, cursor: 'pointer' }}
          title="انتخاب رنگ آزاد"
        >
          <input
            type="color"
            value={color}
            onChange={e => {
              setColor(e.target.value.toUpperCase());
              if (tool === 'eraser') setTool('fill');
            }}
            style={{
              position: 'absolute', inset: 0,
              opacity: 0, cursor: 'pointer',
              width: '100%', height: '100%',
            }}
          />
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: `conic-gradient(
              #e74c3c, #f39c12, #f1c40f, #2ecc71, #1abc9c, #3498db,
              #9b59b6, #e91e63, #e74c3c
            )`,
            border: isCustomColor ? `3px solid ${T.primary}` : `3px solid rgba(0,0,0,0.12)`,
            boxShadow: 'inset 0 0 0 2px #fff',
            transform: isCustomColor ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform .12s',
          }}/>
          {/* Show inner dot in current custom color */}
          {isCustomColor && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 16, height: 16, borderRadius: '50%',
              background: color,
              transform: 'translate(-50%, -50%)',
              border: '2px solid #fff',
              pointerEvents: 'none',
            }}/>
          )}
        </label>

        {/* Persian palette */}
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 8,
          overflowX: 'auto', flex: 1,
          padding: '2px 0',
          WebkitOverflowScrolling: 'touch',
        }}>
          {PERSIAN_PALETTE.map(c => {
            const active = color.toUpperCase() === c.hex.toUpperCase();
            return (
              <button
                key={c.hex}
                onClick={() => { setColor(c.hex); if (tool === 'eraser') setTool('fill'); }}
                title={c.name}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: c.hex,
                  border: active ? `3px solid ${T.primary}` : `3px solid rgba(0,0,0,0.1)`,
                  flexShrink: 0,
                  cursor: 'pointer',
                  boxShadow: active ? `0 0 0 2px ${T.bg}` : 'none',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform .12s',
                }}
              />
            );
          })}
        </div>
      </div>
    </ScreenBg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function iconBtn(bg: string): React.CSSProperties {
  return {
    width: 38, height: 38,
    borderRadius: 10,
    background: bg,
    border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  };
}

function toolBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    minWidth: 0,
    background: active ? T.primary : T.surfaceAlt,
    border: 'none',
    borderRadius: 12,
    padding: '8px 4px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: active ? `0 2px 8px ${T.primary}44` : 'none',
    transition: 'all .12s',
  };
}
