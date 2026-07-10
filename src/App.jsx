import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import CharacterPNG from './CharacterPNG.jsx';
import Wardrobe, { LayerPanel } from './Wardrobe.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
} from './assets.js';
import {
  EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK, BUNS,
  SHIRTS, PANTS, SOCKS, SHOES, NECKLACES, BRACELETS, EARRINGS, BELTS, RINGS, ARMWARMERS,
  HATS, HAIRCLIPS, DRESSES, MARKS, BELLIES,
} from './data.js';
import './App.css';

// Types where only one instance is ever shown (replacing, not stacking)
const SINGLETON_TYPES = new Set(['base', 'eyes', 'eyebrows', 'mouth', 'nose']);

// Back-to-front render priority (lower = further behind)
const LAYER_ORDER = {
  buns:      0,
  hairBack:  1,
  base:      2,
  eyes:      3,  nose: 3, mouth: 3, eyebrows: 3,
  bangs:     4,
  sock:      5,
  shoe:      6,
  earring:   7,  necklace: 7, bracelet: 7, ring: 7, armwarmer: 7, belt: 7,
  belly:     7.5,
  pant:      8,
  shirt:     9,  hat: 9, hairclip: 9, dress: 9,
  marks:     3.5,
};

function insertOrdered(arr, newItem) {
  const order = LAYER_ORDER[newItem.type] ?? 99;
  const idx = arr.findIndex(l => (LAYER_ORDER[l.type] ?? 99) > order);
  if (idx === -1) return [...arr, newItem];
  const next = [...arr];
  next.splice(idx, 0, newItem);
  return next;
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
      .toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Human skin tones: warm orange-brown hue range, full lightness range
function randomSkinColor() {
  const h = 10 + Math.random() * 25;
  const s = 30 + Math.random() * 45;
  const l = 20 + Math.random() * 60;
  return hslToHex(h, s, l);
}

function randomHairColor() {
  const h = Math.random() * 360;
  const s = 35 + Math.random() * 55;
  const l = 15 + Math.random() * 50;
  return hslToHex(h, s, l);
}

function randomEyeColor() {
  const h = Math.random() * 360;
  const s = 45 + Math.random() * 45;
  const l = 30 + Math.random() * 35;
  return hslToHex(h, s, l);
}

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
  const [outfitHue,    setOutfitHue]    = useState(0);
  const [outfitBright, setOutfitBright] = useState(100);
  const [outfitSat,    setOutfitSat]    = useState(100);

  // Single source of truth: ordered array of equipped items (index 0 = behind)
  // Each entry: { key: string (stable), type: string, id: number }
  const [layers, setLayers] = useState([
    { key: 'base', type: 'base', id: 0 },
  ]);
  const nextKey = useRef(1);

  const handleEquip = useCallback((type, id) => {
    if (id === null) {
      setLayers(prev => prev.filter(l => l.type !== type));
      return;
    }
    if (SINGLETON_TYPES.has(type)) {
      setLayers(prev => {
        const without = prev.filter(l => l.type !== type);
        const existing = prev.find(l => l.type === type);
        if (existing?.id === id) return without; // toggle off
        return insertOrdered(without, { key: `k${nextKey.current++}`, type, id });
      });
    } else {
      setLayers(prev => {
        const existingIdx = prev.findLastIndex(l => l.type === type && l.id === id);
        if (existingIdx !== -1) return prev.filter((_, i) => i !== existingIdx);
        return insertOrdered(prev, { key: `k${nextKey.current++}`, type, id });
      });
    }
  }, []);

  const handleRemove = useCallback((key) => {
    setLayers(prev => prev.filter(l => l.key !== key));
  }, []);

  const handleReset = useCallback(() => {
    setSkinColor('#f5c5a3');
    setHairColor('#5a2e1a');
    setEyeColor('#3b82f6');
    setOutfitHue(0);
    setOutfitBright(100);
    setOutfitSat(100);
    setLayers([{ key: 'base', type: 'base', id: 0 }]);
    nextKey.current = 1;
    drawRef.current?.clear();
  }, []);

  const handleRandomize = useCallback(() => {
    setSkinColor(randomSkinColor());
    setHairColor(randomHairColor());
    setEyeColor(randomEyeColor());

    let k = nextKey.current;
    const newLayers = [{ key: 'base', type: 'base', id: 0 }];
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const maybe = (prob, type, arr) => {
      if (Math.random() < prob)
        newLayers.push({ key: `k${k++}`, type, id: pick(arr).id });
    };

    maybe(1.0,  'hairBack',  HAIR_BACK);
    maybe(1.0,  'eyes',      EYES);
    maybe(1.0,  'eyebrows',  EYEBROWS);
    maybe(1.0,  'nose',      NOSE);
    maybe(1.0,  'mouth',     MOUTH);
    maybe(1.0,  'bangs',     BANGS);
    maybe(0.4,  'buns',      BUNS);

    if (Math.random() < 0.3) {
      maybe(1.0, 'dress', DRESSES);
    } else {
      maybe(0.85, 'shirt', SHIRTS);
      maybe(0.85, 'pant',  PANTS);
    }
    maybe(0.4,  'belt',      BELTS);
    maybe(0.6,  'sock',      SOCKS);
    maybe(0.7,  'shoe',      SHOES);
    maybe(0.25, 'armwarmer', ARMWARMERS);
    maybe(0.45, 'earring',   EARRINGS);
    maybe(0.35, 'necklace',  NECKLACES);
    maybe(0.3,  'bracelet',  BRACELETS);
    maybe(0.3,  'ring',      RINGS);
    maybe(0.25, 'hat',       HATS);
    maybe(0.4,  'hairclip',  HAIRCLIPS);
    maybe(0.2,  'marks',     MARKS);
    maybe(0.15, 'belly',     BELLIES);

    newLayers.sort((a, b) => (LAYER_ORDER[a.type] ?? 99) - (LAYER_ORDER[b.type] ?? 99));
    nextKey.current = k;
    setLayers(newLayers);
  }, []);

  // Drawing
  const drawRef   = useRef(null);
  const [drawEnabled, setDrawEnabled] = useState(false);
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
          <button className="randomize-btn" onClick={handleRandomize}>
            ✦ Randomize
          </button>
          <button className="reset-btn" onClick={handleReset}>
            ✕ Clear
          </button>
          <div className="panel-card colors-card">
            <h2 className="panel-title">Colors</h2>
            <ColorSwatch label="Skin" color={skinColor} onChange={setSkinColor} />
            <ColorSwatch label="Hair" color={hairColor} onChange={setHairColor} />
            <ColorSwatch label="Eyes" color={eyeColor}  onChange={setEyeColor}  />
            <h3 className="draw-subtitle" style={{ marginTop: 10 }}>Outfit</h3>
            <div className="slider-row">
              <span className="slider-label">Hue</span>
              <input type="range" min="0" max="360" value={outfitHue}
                onChange={e => setOutfitHue(+e.target.value)} />
            </div>
            <div className="slider-row">
              <span className="slider-label">Bright</span>
              <input type="range" min="30" max="170" value={outfitBright}
                onChange={e => setOutfitBright(+e.target.value)} />
            </div>
            <div className="slider-row">
              <span className="slider-label">Sat</span>
              <input type="range" min="0" max="200" value={outfitSat}
                onChange={e => setOutfitSat(+e.target.value)} />
            </div>
          </div>

          <div className="panel-card">
            <div className="draw-panel-header">
              <h2 className="panel-title">Draw</h2>
              <button
                className={`draw-toggle-btn ${drawEnabled ? 'active' : ''}`}
                onClick={() => setDrawEnabled(e => !e)}
              >{drawEnabled ? 'ON' : 'OFF'}</button>
            </div>
            <div className="draw-tools">
              <button
                className={`tool-btn ${drawTool === 'brush' ? 'active' : ''}`}
                onClick={() => { setDrawTool('brush'); setDrawEnabled(true); }}
              >Brush</button>
              <button
                className={`tool-btn ${drawTool === 'eraser' ? 'active' : ''}`}
                onClick={() => { setDrawTool('eraser'); setDrawEnabled(true); }}
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
            outfitHue={outfitHue} outfitBright={outfitBright} outfitSat={outfitSat}
            layers={layers}
            drawRef={drawRef} drawTool={drawTool} drawEnabled={drawEnabled}
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
