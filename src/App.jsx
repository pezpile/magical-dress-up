import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import CharacterPNG from './CharacterPNG.jsx';
import Wardrobe from './Wardrobe.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
} from './assets.js';
import './App.css';

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

// Default render order: index 0 renders first (behind), last renders in front
const DEFAULT_LAYER_ORDER = [
  'buns', 'hairBack', 'earring', 'sock', 'shoe', 'pant', 'shirt', 'necklace', 'bracelet', 'bangs', 'hat',
];

export default function App() {
  // Colors
  const [skinColor, setSkinColor] = useState('#f5c5a3');
  const [hairColor, setHairColor] = useState('#5a2e1a');
  const [eyeColor,  setEyeColor]  = useState('#3b82f6');

  // Fixed face features (not user-reorderable)
  const [eyes,     setEyes]     = useState(0);
  const [eyebrows, setEyebrows] = useState(0);
  const [mouth,    setMouth]    = useState(0);
  const [nose,     setNose]     = useState(0);

  // Outfit items — null = not equipped
  const [equipped, setEquipped] = useState({
    buns:     null,
    hairBack: 0,
    bangs:    0,
    earring:  null,
    sock:     null,
    shoe:     null,
    pant:     null,
    shirt:    null,
    necklace: null,
    bracelet: null,
    hat:      null,
  });

  // User-controlled render order (index 0 = behind, last = in front)
  const [layerOrder, setLayerOrder] = useState(DEFAULT_LAYER_ORDER);

  const handleEquip = useCallback((type, id) => {
    setEquipped(prev => ({ ...prev, [type]: id }));
  }, []);

  // Drawing
  const drawRef   = useRef(null);
  const [drawTool,  setDrawTool]  = useState('brush');
  const [drawColor, setDrawColor] = useState('#e87cd4');
  const [brushSize, setBrushSize] = useState(12);
  const [drawLayer, setDrawLayer] = useState('free');

  const maskSrcs = useMemo(() => {
    if (drawLayer === 'hair') {
      return [
        equipped.buns     != null ? BUNS_ASSETS[equipped.buns]?.src         : null,
        equipped.hairBack != null ? HAIR_BACK_ASSETS[equipped.hairBack]?.src : null,
        equipped.bangs    != null ? BANGS_ASSETS[equipped.bangs]?.src        : null,
        eyebrows          != null ? EYEBROWS_ASSETS[eyebrows]?.src           : null,
      ].filter(Boolean);
    }
    if (drawLayer === 'skin') {
      return [
        '/assets/base.png',
        mouth != null ? MOUTH_ASSETS[mouth]?.src : null,
        nose  != null ? NOSE_ASSETS[nose]?.src   : null,
      ].filter(Boolean);
    }
    if (drawLayer === 'eyes') {
      const eyeSet = eyes != null ? EYES_ASSETS[eyes] : null;
      return eyeSet ? [eyeSet.sclera, eyeSet.iris] : [];
    }
    return [];
  }, [drawLayer, equipped, eyebrows, mouth, nose, eyes]);

  return (
    <div className="app">
      <main className="main-content">
        {/* Left: Color + Draw controls */}
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

        {/* Center: Character stage */}
        <div className="character-stage">
          <div className="stage-sparkles" aria-hidden="true">
            {['✦','✧','✦','✧','✦','✧'].map((s, i) => (
              <span key={i} className={`sparkle sparkle-${i}`}>{s}</span>
            ))}
          </div>
          <CharacterPNG
            skinColor={skinColor} hairColor={hairColor} eyeColor={eyeColor}
            eyes={eyes} eyebrows={eyebrows} mouth={mouth} nose={nose}
            equipped={equipped} layerOrder={layerOrder}
            drawRef={drawRef} drawTool={drawTool}
            drawColor={drawColor} brushSize={brushSize}
            maskSrcs={maskSrcs}
          />
        </div>

        {/* Right: Wardrobe */}
        <Wardrobe
          eyes={eyes}         onEyes={setEyes}
          eyebrows={eyebrows} onEyebrows={setEyebrows}
          mouth={mouth}       onMouth={setMouth}
          nose={nose}         onNose={setNose}
          equipped={equipped} onEquip={handleEquip}
          layerOrder={layerOrder} onReorderLayers={setLayerOrder}
        />
      </main>
    </div>
  );
}
