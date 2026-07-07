import { useState } from 'react';
import {
  EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK, BUNS,
  SHIRTS, PANTS, SOCKS, SHOES, NECKLACES, BRACELETS, EARRINGS, BELTS, RINGS,
  HATS, HAIRCLIPS,
} from './data.js';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
  SHIRT_ASSETS, PANT_ASSETS, SOCK_ASSETS, SHOE_ASSETS,
  NECKLACE_ASSETS, BRACELET_ASSETS, EARRING_ASSETS, BELT_ASSETS, RING_ASSETS,
  HAT_ASSETS, HAIRCLIP_ASSETS,
} from './assets.js';

// ── Thumbnail crop helpers ────────────────────────────────────────────────────
function thumbCss(cx, cy, zoom) {
  const x = ((0.5 - (cx / 100) * zoom) / (1 - zoom)) * 100;
  const y = ((0.5 - (cy / 100) * zoom) / (1 - zoom)) * 100;
  return { backgroundSize: `${zoom * 100}%`, backgroundPosition: `${x.toFixed(1)}% ${y.toFixed(1)}%` };
}

const THUMB = {
  base:     thumbCss(50, 50,  2),
  eyes:     thumbCss(49, 33,  7),
  eyebrows: thumbCss(49, 29,  8),
  nose:     thumbCss(50, 41, 12),
  mouth:    thumbCss(50, 47, 10),
  bangs:    thumbCss(50, 18,  5),
  hairBack: thumbCss(50, 15,  4),
  buns:     thumbCss(49, 15,  5),
  shirt:    thumbCss(47, 49,  5),
  pant:     thumbCss(49, 57,  8),
  belt:     thumbCss(49, 65, 15),
  sock:     thumbCss(48, 75,  7),
  shoe:     thumbCss(48, 84,  7),
  necklace: thumbCss(50, 43, 15),
  bracelet: thumbCss(41, 65, 15),
  earring:  thumbCss(49, 39, 12),
  ring:     thumbCss(38, 67, 25),
  hat:      thumbCss(48, 16,  6),
  hairclip: thumbCss(59, 29, 15),
};

const LAYER_LABELS = {
  base:     'Base',
  eyes:     'Eyes',
  eyebrows: 'Eyebrows',
  mouth:    'Mouth',
  nose:     'Nose',
  buns:     'Buns',
  hairBack: 'Hair Back',
  bangs:    'Bangs',
  earring:  'Earrings',
  ring:     'Ring',
  sock:     'Socks',
  shoe:     'Shoes',
  pant:     'Bottoms',
  belt:     'Belt',
  shirt:    'Tops',
  necklace: 'Necklace',
  bracelet: 'Bracelet',
  hat:      'Hat',
  hairclip: 'Hair Clip',
};

const WARDROBE_ASSET_MAP = {
  eyes:     EYES_ASSETS,
  eyebrows: EYEBROWS_ASSETS,
  mouth:    MOUTH_ASSETS,
  nose:     NOSE_ASSETS,
  buns:     BUNS_ASSETS,
  hairBack: HAIR_BACK_ASSETS,
  bangs:    BANGS_ASSETS,
  earring:  EARRING_ASSETS,
  ring:     RING_ASSETS,
  sock:     SOCK_ASSETS,
  shoe:     SHOE_ASSETS,
  pant:     PANT_ASSETS,
  belt:     BELT_ASSETS,
  shirt:    SHIRT_ASSETS,
  necklace: NECKLACE_ASSETS,
  bracelet: BRACELET_ASSETS,
  hat:      HAT_ASSETS,
  hairclip: HAIRCLIP_ASSETS,
};

// Returns the display thumbnail src for a given layer type + equipped id.
// Eyes use .iris (the colored layer), base is hardcoded, others use .src.
function getLayerThumbSrc(type, id) {
  if (type === 'base') return '/assets/base.png';
  if (id == null) return null;
  const a = WARDROBE_ASSET_MAP[type]?.[id];
  if (!a) return null;
  return a.iris || a.src || null;
}

// ── Layer panel (drag-to-reorder) ────────────────────────────────────────────
function LayerPanel({ layerOrder, equipped, onReorder }) {
  const [dragType, setDragType] = useState(null);
  const [overType, setOverType] = useState(null);

  // Display front-to-back (top of list = in front). Always show base.
  const displayed = [...layerOrder].reverse().filter(t => equipped[t] != null);

  function onDragStart(e, type) {
    setDragType(type);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, type) {
    e.preventDefault();
    if (type !== dragType) setOverType(type);
  }

  function onDrop(e, type) {
    e.preventDefault();
    if (!dragType || dragType === type) { reset(); return; }
    const disp = [...layerOrder].reverse();
    const from = disp.indexOf(dragType);
    const to   = disp.indexOf(type);
    if (from === -1 || to === -1) { reset(); return; }
    disp.splice(from, 1);
    disp.splice(to, 0, dragType);
    onReorder(disp.reverse());
    reset();
  }

  function reset() { setDragType(null); setOverType(null); }

  return (
    <div className="wardrobe-section layer-panel">
      <h3>Layers <span className="layer-hint">↑ front · behind ↓</span></h3>
      {displayed.length === 0 ? (
        <p className="layer-empty">Equip items below to manage layers</p>
      ) : (
        <div className="layer-list">
          {displayed.map(type => {
            const src = getLayerThumbSrc(type, equipped[type]);
            return (
              <div
                key={type}
                className={[
                  'layer-row',
                  dragType === type ? 'dragging' : '',
                  overType === type ? 'drag-over' : '',
                ].filter(Boolean).join(' ')}
                draggable
                onDragStart={e => onDragStart(e, type)}
                onDragOver={e => onDragOver(e, type)}
                onDrop={e => onDrop(e, type)}
                onDragEnd={reset}
                onDragLeave={() => setOverType(null)}
              >
                <span className="drag-handle">⠿</span>
                {src && (
                  <div
                    className="layer-thumb"
                    style={{ backgroundImage: `url(${src})`, ...THUMB[type] }}
                  />
                )}
                <span className="layer-label">{LAYER_LABELS[type]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Thumbnail item button ─────────────────────────────────────────────────────
function ThumbBtn({ src, thumbKey, name, selected, onClick }) {
  return (
    <button
      className={`thumb-item-btn${selected ? ' selected' : ''}`}
      onClick={onClick}
      title={name}
    >
      <div
        className="thumb-crop"
        style={{
          backgroundImage: src ? `url(${src})` : 'none',
          ...(THUMB[thumbKey] || {}),
        }}
      />
      <span className="thumb-name">{name}</span>
    </button>
  );
}

// ── Generic wardrobe section ──────────────────────────────────────────────────
function Section({ label, thumbKey, items, selected, onSelect, getThumbSrc }) {
  return (
    <div className="wardrobe-section">
      <h3>{label}</h3>
      <div className="item-thumb-grid">
        <button
          className={`thumb-none-btn${selected === null ? ' selected' : ''}`}
          onClick={() => onSelect(null)}
          title="None"
        >✕</button>
        {items.map(item => (
          <ThumbBtn
            key={item.id}
            src={getThumbSrc(item.id)}
            thumbKey={thumbKey}
            name={item.name}
            selected={selected === item.id}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main wardrobe component ───────────────────────────────────────────────────
export default function Wardrobe({ equipped, onEquip, layerOrder, onReorderLayers }) {
  // Toggle: clicking selected item unequips it
  const eq = (type, id) => onEquip(type, equipped[type] === id ? null : id);

  const thumbSrc = (type, id) => getLayerThumbSrc(type, id);

  return (
    <div className="wardrobe-panel">
      <LayerPanel layerOrder={layerOrder} equipped={equipped} onReorder={onReorderLayers} />

      <Section label="Eyes"      thumbKey="eyes"     items={EYES}
        getThumbSrc={id => thumbSrc('eyes',     id)}
        selected={equipped.eyes}     onSelect={id => eq('eyes',     id)} />
      <Section label="Eyebrows"  thumbKey="eyebrows" items={EYEBROWS}
        getThumbSrc={id => thumbSrc('eyebrows', id)}
        selected={equipped.eyebrows} onSelect={id => eq('eyebrows', id)} />
      <Section label="Nose"      thumbKey="nose"     items={NOSE}
        getThumbSrc={id => thumbSrc('nose',     id)}
        selected={equipped.nose}     onSelect={id => eq('nose',     id)} />
      <Section label="Mouth"     thumbKey="mouth"    items={MOUTH}
        getThumbSrc={id => thumbSrc('mouth',    id)}
        selected={equipped.mouth}    onSelect={id => eq('mouth',    id)} />
      <Section label="Bangs"     thumbKey="bangs"    items={BANGS}
        getThumbSrc={id => thumbSrc('bangs',    id)}
        selected={equipped.bangs}    onSelect={id => eq('bangs',    id)} />
      <Section label="Buns"      thumbKey="buns"     items={BUNS}
        getThumbSrc={id => thumbSrc('buns',     id)}
        selected={equipped.buns}     onSelect={id => eq('buns',     id)} />
      <Section label="Hair Back" thumbKey="hairBack" items={HAIR_BACK}
        getThumbSrc={id => thumbSrc('hairBack', id)}
        selected={equipped.hairBack} onSelect={id => eq('hairBack', id)} />
      <Section label="Hat"       thumbKey="hat"      items={HATS}
        getThumbSrc={id => thumbSrc('hat',      id)}
        selected={equipped.hat}      onSelect={id => eq('hat',      id)} />
      <Section label="Earrings"  thumbKey="earring"  items={EARRINGS}
        getThumbSrc={id => thumbSrc('earring',  id)}
        selected={equipped.earring}  onSelect={id => eq('earring',  id)} />
      <Section label="Ring"      thumbKey="ring"     items={RINGS}
        getThumbSrc={id => thumbSrc('ring',     id)}
        selected={equipped.ring}     onSelect={id => eq('ring',     id)} />
      <Section label="Necklace"  thumbKey="necklace" items={NECKLACES}
        getThumbSrc={id => thumbSrc('necklace', id)}
        selected={equipped.necklace} onSelect={id => eq('necklace', id)} />
      <Section label="Bracelet"  thumbKey="bracelet" items={BRACELETS}
        getThumbSrc={id => thumbSrc('bracelet', id)}
        selected={equipped.bracelet} onSelect={id => eq('bracelet', id)} />
      <Section label="Tops"      thumbKey="shirt"    items={SHIRTS}
        getThumbSrc={id => thumbSrc('shirt',    id)}
        selected={equipped.shirt}    onSelect={id => eq('shirt',    id)} />
      <Section label="Bottoms"   thumbKey="pant"     items={PANTS}
        getThumbSrc={id => thumbSrc('pant',     id)}
        selected={equipped.pant}     onSelect={id => eq('pant',     id)} />
      <Section label="Belt"      thumbKey="belt"     items={BELTS}
        getThumbSrc={id => thumbSrc('belt',     id)}
        selected={equipped.belt}     onSelect={id => eq('belt',     id)} />
      <Section label="Socks"     thumbKey="sock"     items={SOCKS}
        getThumbSrc={id => thumbSrc('sock',     id)}
        selected={equipped.sock}     onSelect={id => eq('sock',     id)} />
      <Section label="Shoes"     thumbKey="shoe"     items={SHOES}
        getThumbSrc={id => thumbSrc('shoe',     id)}
        selected={equipped.shoe}     onSelect={id => eq('shoe',     id)} />
      <Section label="Hair Clip" thumbKey="hairclip" items={HAIRCLIPS}
        getThumbSrc={id => thumbSrc('hairclip', id)}
        selected={equipped.hairclip} onSelect={id => eq('hairclip', id)} />
    </div>
  );
}
