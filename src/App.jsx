import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import CharacterPNG from './CharacterPNG.jsx';
import Wardrobe from './Wardrobe.jsx';
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

  return (
    <div className="app">
      <main className="main-content">
        {/* Left: Color controls */}
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
          />
        </div>

        {/* Right: Wardrobe */}
        <Wardrobe
          eyes={eyes}       onEyes={setEyes}
          eyebrows={eyebrows} onEyebrows={setEyebrows}
          mouth={mouth}     onMouth={setMouth}
          nose={nose}       onNose={setNose}
          bangs={bangs}     onBangs={setBangs}
          hairBack={hairBack} onHairBack={setHairBack}
        />
      </main>
    </div>
  );
}

