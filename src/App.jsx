import { useState, useRef, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import CharacterPNG from './CharacterPNG.jsx';
import Wardrobe from './Wardrobe.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS,
  NOSE_ASSETS, BANGS_ASSETS, HAIR_BACK_ASSETS,
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

const LAYERS = [
  { id: 'free', label: 'Free' },
  { id: 'hair', label: 'Hair' },
  { id: 'skin', label: 'Skin' },
  { id: 'eyes', label: 'Eyes' },
];

export default function App() {
  const [skinColor, setSkinColor] = useState('#f5c5a3');
  const [hairColor, setHairColor] = useState('#5a2e1a');
  const [eyeColor,  setEyeColor]  = useState('#3b82f6');

  const [eyes,     setEyes]     = useState(0);
  const [eyebrows, setEyebrows] = useState(0);
  const [mouth,    setMouth]    = useState(0);
  const [nose,     setNose]     = useState(0);
  const [bangs,    setBangs]    = useState(0);
  const [hairBack, setHairBack] = useState(0);

  const drawRef   = useRef(null);
  const [drawTool,  setDrawTool]  = useState('brush');
  const [drawColor, setDrawColor] = useState('#e87cd4');
  const [brushSize, setBrushSize] = useState(12);
  const [drawLayer, setDrawLayer] = useState('free');

  // Compute PNG mask sources for the selected layer
  const maskSrcs = useMemo(() => {
    if (drawLayer === 'hair') {
      const srcs = [];
      if (hairBack != null) srcs.push(HAIR_BACK_ASSETS[hairBack]);
      if (bangs    != null) srcs.push(BANGS_ASSETS[bangs]);
      if (eyebrows != null) srcs.push(EYEBROWS_ASSETS[eyebrows]);
      return srcs.filter(Boolean);
    }
    if (drawLayer === 'skin') {
      const srcs = ['/assets/base.png'];
      if (mouth != null) srcs.push(MOUTH_ASSETS[mouth]);
      if (nose  != null) srcs.push(NOSE_ASSETS[nose]);
      return srcs.filter(Boolean);
    }
    if (drawLayer === 'eyes') {
      const eyeSet = eyes != null ? EYES_ASSETS[eyes] : null;
      if (!eyeSet) return [];
      return [eyeSet.sclera, eyeSet.iris];
    }
    return []; // 'free' — no mask
  }, [drawLayer, hairBack, bangs, eyebrows, mouth, nose, eyes]);

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
              {LAYERS.map(l => (
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
            skinColor={skinColor}
            hairColor={hairColor}
            eyeColor={eyeColor}
            eyes={eyes}
            eyebrows={eyebrows}
            mouth={mouth}
            nose={nose}
            bangs={bangs}
            hairBack={hairBack}
            drawRef={drawRef}
            drawTool={drawTool}
            drawColor={drawColor}
            brushSize={brushSize}
            maskSrcs={maskSrcs}
          />
        </div>

        {/* Right: Wardrobe */}
        <Wardrobe
          eyes={eyes}         onEyes={setEyes}
          eyebrows={eyebrows} onEyebrows={setEyebrows}
          mouth={mouth}       onMouth={setMouth}
          nose={nose}         onNose={setNose}
          bangs={bangs}       onBangs={setBangs}
          hairBack={hairBack} onHairBack={setHairBack}
        />
      </main>
    </div>
  );
}
