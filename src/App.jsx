import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import CharacterPNG from './CharacterPNG.jsx';
import Wardrobe, { LayerPanel } from './Wardrobe.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
} from './assets.js';
import './App.css';

// Types where only one instance is ever shown (replacing, not stacking)
const SINGLETON_TYPES = new Set(['base', 'eyes', 'eyebrows', 'mouth', 'nose']);

function ColorSwatch({ label, color, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="color-swatch-wrap" ref={ref}>
      <span className="swatch-label">{label}</span>
      <button
        className="swatch-btn"
        style={{ background: color }}
        onClick={() => setOpen(o => !o)}
        aria-label={`Pick ${label} color`}
      />
      {open && (
        <div className="color-popover">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

const DRAW_LAYERS = [
  { id: 'free', label: 'Free' },
  { id: 'hair', label: 'Hair' },
  { id: 'skin', label: 'Skin' },
  { id: 'eyes', label: 'Eyes' },
];

export default function App() {
  const [skinColor, setSkinColor] = useState('#f5c5a3');
  const [hairColor, setHairColor] = useState('#5a2e1a');
  const [eyeColor,  setEyeColor]  = useState('#3b82f6');

  // Single source of truth: ordered array of equipped items (index 0 = behind)
  // Each entry: { key: string (stable), type: string, id: number }
  const [layers, setLayers] = useState([
    { key: 'base', type: 'base', id: 0 },
  ]);
  const nextKey = useRef(1);

  const handleEquip = useCallback((type, id) => {
    if (id === null) {
      // ✕ button: remove all of this type
      setLayers(prev => prev.filter(l => l.type !== type));
      return;
    }
    if (SINGLETON_TYPES.has(type)) {
      setLayers(prev => {
        const without = prev.filter(l => l.type !== type);
        const existing = prev.find(l => l.type === type);
        if (existing?.id === id) return without; // toggle off
        return [...without, { key: `k${nextKey.current++}`, type, id }];
      });
    } else {
      setLayers(prev => {
        const existingIdx = prev.findLastIndex(l => l.type === type && l.id === id);
        if (existingIdx !== -1) return prev.filter((_, i) => i !== existingIdx);
        return [...prev, { key: `k${nextKey.current++}`, type, id }];
      });
    }
  }, []);

  const handleRemove = useCallback((key) => {
    setLayers(prev => prev.filter(l => l.key !== key));
  }, []);

  // Drawing
  const drawRef   = useRef(null);
  const [drawTool,  setDrawTool]  = useState('brush');
  const [drawColor, setDrawColor] = useState('#e87cd4');
  const [brushSize, setBrushSize] = useState(12);
  const [drawLayer, setDrawLayer] = useState('free');

  const maskSrcs = useMemo(() => {
    if (drawLayer === 'hair') {
      return layers
        .filter(l => ['buns', 'hairBack', 'bangs', 'eyebrows'].includes(l.type))
        .map(l => ({ buns: BUNS_ASSETS, hairBack: HAIR_BACK_ASSETS,
                     bangs: BANGS_ASSETS, eyebrows: EYEBROWS_ASSETS }[l.type]?.[l.id]?.src)
        )
        .filter(Boolean);
    }
    if (drawLayer === 'skin') {
      return [
        layers.some(l => l.type === 'base') ? '/assets/base.png' : null,
        ...layers.filter(l => l.type === 'mouth').map(l => MOUTH_ASSETS[l.id]?.src),
        ...layers.filter(l => l.type === 'nose').map(l => NOSE_ASSETS[l.id]?.src),
      ].filter(Boolean);
    }
    if (drawLayer === 'eyes') {
      const eyeLayer = layers.find(l => l.type === 'eyes');
      if (!eyeLayer) return [];
      const eyeSet = EYES_ASSETS[eyeLayer.id];
      return eyeSet ? [eyeSet.sclera, eyeSet.iris] : [];
    }
    return [];
  }, [drawLayer, layers]);

  return (
    <div className="app">
      <main className="main-content">

        {/* Outer left: Colors + Draw */}
        <div className="color-panel">
          <div className="panel-card">
            <h2 className="panel-title">Colors</h2>
            <ColorSwatch label="Skin" color={skinColor} onChange={setSkinColor} />
            <ColorSwatch label="Hair" color={hairColor} onChange={setHairColor} />
            <ColorSwatch label="Eyes" color={eyeColor}  onChange={setEyeColor}  />
          </div>

          <div className="panel-card">
            <h2 className="panel-title">Draw</h2>
            <div className="draw-tools">
              <button
                className={`tool-btn ${drawTool === 'brush' ? 'active' : ''}`}
                onClick={() => setDrawTool('brush')}
              >Brush</button>
              <button
                className={`tool-btn ${drawTool === 'eraser' ? 'active' : ''}`}
                onClick={() => setDrawTool('eraser')}
              >Erase</button>
            </div>
            <h3 className="draw-subtitle">Clip to layer</h3>
            <div className="layer-selector">
              {DRAW_LAYERS.map(l => (
                <button
                  key={l.id}
                  className={`layer-btn ${drawLayer === l.id ? 'active' : ''}`}
                  onClick={() => setDrawLayer(l.id)}
                >{l.label}</button>
              ))}
            </div>
            <ColorSwatch label="Color" color={drawColor} onChange={setDrawColor} />
            <div className="brush-size-row">
              <span className="brush-size-label">Size</span>
              <input
                type="range" min="3" max="50"
                value={brushSize}
                onChange={e => setBrushSize(+e.target.value)}
              />
            </div>
            <div className="draw-actions">
              <button className="draw-action-btn" onClick={() => drawRef.current?.undo()}>↩ Undo</button>
              <button className="draw-action-btn" onClick={() => drawRef.current?.redo()}>↪ Redo</button>
              <button className="draw-action-btn" onClick={() => drawRef.current?.clear()}>✕ Clear</button>
            </div>
          </div>
        </div>

        {/* Inner left: Layers */}
        <div className="layer-column">
          <LayerPanel layers={layers} onReorder={setLayers} onRemove={handleRemove} />
        </div>

        {/* Center: Character */}
        <div className="character-stage">
          <div className="stage-sparkles" aria-hidden="true">
            {['✦','✧','✦','✧','✦','✧'].map((s, i) => (
              <span key={i} className={`sparkle sparkle-${i}`}>{s}</span>
            ))}
          </div>
          <CharacterPNG
            skinColor={skinColor} hairColor={hairColor} eyeColor={eyeColor}
            layers={layers}
            drawRef={drawRef} drawTool={drawTool}
            drawColor={drawColor} brushSize={brushSize}
            maskSrcs={maskSrcs}
          />
        </div>

        {/* Right: Wardrobe */}
        <Wardrobe layers={layers} onEquip={handleEquip} />
      </main>
    </div>
  );
}
