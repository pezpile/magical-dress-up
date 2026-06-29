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

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ Magical Dress-Up ✨</h1>
      </header>

      <main className="main-content">
        {/* Left: Color controls */}
        <div className="color-panel">
          <div className="panel-card">
            <h2 className="panel-title">Colors</h2>
            <ColorSwatch label="Skin" color={skinColor} onChange={setSkinColor} />
            <ColorSwatch label="Hair" color={hairColor} onChange={setHairColor} />
            <ColorSwatch label="Eyes" color={eyeColor}  onChange={setEyeColor}  />
          </div>

          <div className="panel-card tips-card">
            <p className="tip">Click the colored circles to open a color wheel!</p>
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
