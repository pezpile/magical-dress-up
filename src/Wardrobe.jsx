import { useState } from 'react';
import {
  EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK, BUNS,
  SHIRTS, PANTS, SOCKS, SHOES, NECKLACES, BRACELETS, EARRINGS, HATS,
} from './data.js';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
  SHIRT_ASSETS, PANT_ASSETS, SOCK_ASSETS, SHOE_ASSETS,
  NECKLACE_ASSETS, BRACELET_ASSETS, EARRING_ASSETS, HAT_ASSETS,
} from './assets.js';

// ── Thumbnail crop helpers ────────────────────────────────────────────────────
// For each item type, we store focal point (cx%, cy%) + zoom.
// The CSS formula centers the focal point in the thumbnail box.
function thumbCss(cx, cy, zoom) {
  const x = ((0.5 - (cx / 100) * zoom) / (1 - zoom)) * 100;
  const y = ((0.5 - (cy / 100) * zoom) / (1 - zoom)) * 100;
  return { backgroundSize: `${zoom * 100}%`, backgroundPosition: `${x.toFixed(1)}% ${y.toFixed(1)}%` };
}

const THUMB = {
  bangs:    thumbCss(50, 18,  5),
  hairBack: thumbCss(50, 15,  4),
  buns:     thumbCss(49, 15,  5),
  eyes:     thumbCss(49, 33,  7),
  eyebrows: thumbCss(49, 29,  8),
  nose:     thumbCss(50, 41, 12),
  mouth:    thumbCss(50, 47, 10),
  shirt:    thumbCss(47, 49,  5),
  pant:     thumbCss(49, 57,  8),
  sock:     thumbCss(48, 75,  7),
  shoe:     thumbCss(48, 81,  7),
  necklace: thumbCss(50, 43, 15),
  bracelet: thumbCss(41, 65, 15),
  earring:  thumbCss(49, 39, 12),
  hat:      thumbCss(48, 16,  6),
};

// Labels shown in the layer panel
const LAYER_LABELS = {
  buns: 'Buns', hairBack: 'Hair Back', bangs: 'Bangs',
  earring: 'Earrings', sock: 'Socks', shoe: 'Shoes',
  pant: 'Bottoms', shirt: 'Tops',
  necklace: 'Necklace', bracelet: 'Bracelet', hat: 'Hat',
};

// Asset map per layer type (matches CharacterPNG's ASSET_MAP)
const WARDROBE_ASSET_MAP = {
  buns:     BUNS_ASSETS,
  hairBack: HAIR_BACK_ASSETS,
  bangs:    BANGS_ASSETS,
  earring:  EARRING_ASSETS,
  sock:     SOCK_ASSETS,
  shoe:     SHOE_ASSETS,
  pant:     PANT_ASSETS,
  shirt:    SHIRT_ASSETS,
  necklace: NECKLACE_ASSETS,
  bracelet: BRACELET_ASSETS,
  hat:      HAT_ASSETS,
};

function getThumbSrc(assetMap, id) {
  const a = assetMap?.[id];
  if (!a) return null;
  return a.src || a.iris || a.sclera || null;
}

// ── Layer panel (drag-to-reorder) ────────────────────────────────────────────
function LayerPanel({ layerOrder, equipped, onReorder }) {
  const [dragType, setDragType] = useState(null);
  const [overType, setOverType] = useState(null);

  // Show only equipped items, displayed front-to-back (top = in front)
  const displayed = [...layerOrder].reverse().filter(t => equipped[t] != null);

  if (displayed.length === 0) {
    return (
      <div className="wardrobe-section layer-panel">
        <h3>Layers</h3>
        <p className="layer-empty">Equip items below to manage layers</p>
      </div>
    );
  }

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
      <div className="layer-list">
        {displayed.map(type => {
          const src = getThumbSrc(WARDROBE_ASSET_MAP[type], equipped[type]);
          const isDragging = dragType === type;
          const isOver     = overType === type;
          return (
            <div
              key={type}
              className={`layer-row${isDragging ? ' dragging' : ''}${isOver ? ' drag-over' : ''}`}
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
function Section({ label, thumbKey, items, assetMap, selected, onSelect, getThumb }) {
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
            src={getThumb ? getThumb(item.id) : getThumbSrc(assetMap, item.id)}
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
export default function Wardrobe({
  eyes, onEyes, eyebrows, onEyebrows, mouth, onMouth, nose, onNose,
  equipped, onEquip,
  layerOrder, onReorderLayers,
}) {
  const eq = (type, id) => onEquip(type, equipped[type] === id ? null : id);

  return (
    <div className="wardrobe-panel">
      <LayerPanel layerOrder={layerOrder} equipped={equipped} onReorder={onReorderLayers} />

      <Section label="Eyes"      thumbKey="eyes"     items={EYES}      assetMap={EYES_ASSETS}
        getThumb={id => EYES_ASSETS[id]?.iris}
        selected={eyes}     onSelect={onEyes}     />
      <Section label="Eyebrows"  thumbKey="eyebrows" items={EYEBROWS}  assetMap={EYEBROWS_ASSETS}
        selected={eyebrows} onSelect={onEyebrows} />
      <Section label="Nose"      thumbKey="nose"     items={NOSE}      assetMap={NOSE_ASSETS}
        selected={nose}     onSelect={onNose}     />
      <Section label="Mouth"     thumbKey="mouth"    items={MOUTH}     assetMap={MOUTH_ASSETS}
        selected={mouth}    onSelect={onMouth}    />
      <Section label="Bangs"     thumbKey="bangs"    items={BANGS}     assetMap={BANGS_ASSETS}
        selected={equipped.bangs}    onSelect={id => eq('bangs', id)}    />
      <Section label="Buns"      thumbKey="buns"     items={BUNS}      assetMap={BUNS_ASSETS}
        selected={equipped.buns}     onSelect={id => eq('buns', id)}     />
      <Section label="Hair Back" thumbKey="hairBack" items={HAIR_BACK} assetMap={HAIR_BACK_ASSETS}
        selected={equipped.hairBack} onSelect={id => eq('hairBack', id)} />
      <Section label="Hat"       thumbKey="hat"      items={HATS}      assetMap={HAT_ASSETS}
        selected={equipped.hat}      onSelect={id => eq('hat', id)}      />
      <Section label="Earrings"  thumbKey="earring"  items={EARRINGS}  assetMap={EARRING_ASSETS}
        selected={equipped.earring}  onSelect={id => eq('earring', id)}  />
      <Section label="Necklace"  thumbKey="necklace" items={NECKLACES} assetMap={NECKLACE_ASSETS}
        selected={equipped.necklace} onSelect={id => eq('necklace', id)} />
      <Section label="Bracelet"  thumbKey="bracelet" items={BRACELETS} assetMap={BRACELET_ASSETS}
        selected={equipped.bracelet} onSelect={id => eq('bracelet', id)} />
      <Section label="Tops"      thumbKey="shirt"    items={SHIRTS}    assetMap={SHIRT_ASSETS}
        selected={equipped.shirt}    onSelect={id => eq('shirt', id)}    />
      <Section label="Bottoms"   thumbKey="pant"     items={PANTS}     assetMap={PANT_ASSETS}
        selected={equipped.pant}     onSelect={id => eq('pant', id)}     />
      <Section label="Socks"     thumbKey="sock"     items={SOCKS}     assetMap={SOCK_ASSETS}
        selected={equipped.sock}     onSelect={id => eq('sock', id)}     />
      <Section label="Shoes"     thumbKey="shoe"     items={SHOES}     assetMap={SHOE_ASSETS}
        selected={equipped.shoe}     onSelect={id => eq('shoe', id)}     />
    </div>
  );
}
