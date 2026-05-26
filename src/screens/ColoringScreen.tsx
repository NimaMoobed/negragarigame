// ColoringScreen — قلب اپ
// شامل: کانواس + toolbar بالا + palette + brush slider پایین
// AutoSave: debounce 800ms → ذخیره در storage تحت کلید `design-<id>`

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { Icon, type IconName } from '../components/Icon';
import { PERSIAN_PALETTE } from '../theme/palette';
import { getDesignById } from '../data/designs';
import { ColoringCanvas, type ColoringCanvasHandle, type Tool } from '../canvas/ColoringCanvas';
import { getValue, setValue } from '../lib/storage';

const TOOLS: Array<{ id: Tool; icon: IconName; label: string }> = [
  { id: 'fill',    icon: 'bucket',  label: 'سطل رنگ' },
  { id: 'brush',   icon: 'brush',   label: 'قلم‌مو'   },
  { id: 'eraser',  icon: 'eraser',  label: 'پاک‌کن'  },
  { id: 'pipette', icon: 'pipette', label: 'قطره‌چکان' },
];

export function ColoringScreen() {
  const nav = useNavigate();
  const { designId } = useParams<{ designId: string }>();
  const design = designId ? getDesignById(designId) : undefined;

  const canvasRef = useRef<ColoringCanvasHandle>(null);
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
      // wait a beat for design to load
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

  const onShare = () => {
    nav(`/share/${designId}`);
  };

  if (!design) {
    return (
      <ScreenBg>
        <div style={{ padding: 32, textAlign: 'center', color: T.inkMute }}>
          طرح یافت نشد.
        </div>
      </ScreenBg>
    );
  }

  return (
    <ScreenBg>
      {/* Top toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px',
        paddingTop: 'calc(10px + env(safe-area-inset-top))',
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        gap: 8,
      }}>
        <button onClick={() => nav(-1)} style={iconBtn(T.surfaceAlt)}>
          <Icon name="next" size={20} color={T.ink} />
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{
                ...iconBtn(tool === t.id ? T.primary : T.surfaceAlt),
                width: 46, height: 46,
              }}
            >
              <Icon name={t.icon} size={22} color={tool === t.id ? '#fff' : T.ink} />
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => canvasRef.current?.undo()}
            style={iconBtn(T.surfaceAlt)}
          >
            <Icon name="undo" size={20} color={T.ink} />
          </button>
          <button
            onClick={() => canvasRef.current?.redo()}
            style={iconBtn(T.surfaceAlt)}
          >
            <Icon name="redo" size={20} color={T.ink} />
          </button>
          <button onClick={onShare} style={iconBtn(T.primary)}>
            <Icon name="share" size={20} color="#fff" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T.bgDeep,
        padding: 12,
        overflow: 'hidden',
        minHeight: 'calc(100vh - 240px)',
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

      {/* Bottom: brush size + palette */}
      <div style={{
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        padding: '10px 14px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
      }}>
        {/* Brush size (only for brush/eraser) */}
        {(tool === 'brush' || tool === 'eraser') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.inkSoft, minWidth: 72 }}>اندازه قلم</span>
            <input
              type="range"
              min={4}
              max={60}
              value={brushSize}
              onChange={e => setBrushSize(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: T.primary }}
            />
            <div style={{
              width:  Math.min(40, brushSize),
              height: Math.min(40, brushSize),
              borderRadius: '50%',
              background: tool === 'eraser' ? '#fff' : color,
              border: `2px solid ${T.border}`,
              flexShrink: 0,
            }}/>
          </div>
        )}

        {/* Palette */}
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '4px 0',
        }}>
          {PERSIAN_PALETTE.map(c => (
            <button
              key={c.hex}
              onClick={() => { setColor(c.hex); if (tool === 'eraser') setTool('fill'); }}
              title={c.name}
              style={{
                width: 42, height: 42, borderRadius: '50%',
                background: c.hex,
                border: color === c.hex ? `3px solid ${T.primary}` : `3px solid rgba(0,0,0,0.1)`,
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: color === c.hex ? `0 0 0 2px ${T.bg}` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </ScreenBg>
  );
}

function iconBtn(bg: string): React.CSSProperties {
  return {
    width: 40, height: 40,
    borderRadius: 10,
    background: bg,
    border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  };
}
