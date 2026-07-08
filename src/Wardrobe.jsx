import { useState } from 'react';
import {
  EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK, BUNS,
  SHIRTS, PANTS, SOCKS, SHOES, NECKLACES, BRACELETS, EARRINGS, BELTS, RINGS, ARMWARMERS,
  HATS, HAIRCLIPS, DRESSES,
} from './data.js';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
  SHIRT_ASSETS, PANT_ASSETS, SOCK_ASSETS, SHOE_ASSETS,
  NECKLACE_ASSETS, BRACELET_ASSETS, EARRING_ASSETS, BELT_ASSETS, RING_ASSETS, ARMWARMER_ASSETS,
  HAT_ASSETS, HAIRCLIP_ASSETS, DRESS_ASSETS,
} from './assets.js';

// ── Thumbnail crop helpers ────────────────────────────────────────────────────
function thumbCss(cx, cy, zoom) {
  const x = ((0.5 - (cx / 100) * zoom) / (1 - zoom)) * 100;
  const y = ((0.5 - (cy / 100) * zoom) / (1 - zoom)) * 100;
  return { backgroundSize: `${zoom * 100}%`, backgroundPosition: `${x.toFixed(1)}% ${y.toFixed(1)}%` };
}

const THUMB = {
  base:      thumbCss(50, 50,  2),
  eyes:      thumbCss(49, 33,  7),
  eyebrows:  thumbCss(49, 29,  8),
  nose:      thumbCss(50, 41, 12),
  mouth:     thumbCss(50, 47, 10),
  bangs:     thumbCss(50, 18,  5),
  hairBack:  thumbCss(50, 15,  4),
  buns:      thumbCss(49, 15,  5),
  shirt:     thumbCss(47, 49,  5),
  pant:      thumbCss(49, 57,  8),
  belt:      thumbCss(49, 65, 15),
  sock:      thumbCss(48, 75,  7),
  shoe:      thumbCss(48, 84,  7),
  necklace:  thumbCss(50, 43, 15),
  bracelet:  thumbCss(41, 65, 15),
  earring:   thumbCss(49, 39, 12),
  ring:      thumbCss(38, 67, 25),
  armwarmer: thumbCss(50, 59,  7),
  hat:       thumbCss(48, 16,  6),
  hairclip:  thumbCss(59, 29, 15),
  dress:     thumbCss(50, 58,  4),
};

const LAYER_LABELS = {
  base:      'Base',
  eyes:      'Eyes',
  eyebrows:  'Eyebrows',
  mouth:     'Mouth',
  nose:      'Nose',
  buns:      'Buns',
  hairBack:  'Hair Back',
  bangs:     'Bangs',
  earring:   'Earrings',
  ring:      'Ring',
  sock:      'Socks',
  shoe:      'Shoes',
  pant:      'Bottoms',
  belt:      'Belt',
  shirt:     'Tops',
  necklace:  'Necklace',
  bracelet:  'Bracelet',
  armwarmer: 'Arm Warmers',
  hat:       'Hat',
  hairclip:  'Hair Clip',
  dress:     'Dress',
};

const WARDROBE_ASSET_MAP = {
  eyes:      EYES_ASSETS,
  eyebrows:  EYEBROWS_ASSETS,
  mouth:     MOUTH_ASSETS,
  nose:      NOSE_ASSETS,
  buns:      BUNS_ASSETS,
  hairBack:  HAIR_BACK_ASSETS,
  bangs:     BANGS_ASSETS,
  earring:   EARRING_ASSETS,
  ring:      RING_ASSETS,
  sock:      SOCK_ASSETS,
  shoe:      SHOE_ASSETS,
  pant:      PANT_ASSETS,
  belt:      BELT_ASSETS,
  shirt:     SHIRT_ASSETS,
  necklace:  NECKLACE_ASSETS,
  bracelet:  BRACELET_ASSETS,
  armwarmer: ARMWARMER_ASSETS,
  hat:       HAT_ASSETS,
  hairclip:  HAIRCLIP_ASSETS,
  dress:     DRESS_ASSETS,
};

// Lookup item name from data arrays for layer panel labels
const ITEMS_BY_TYPE = {
  eyes: EYES, eyebrows: EYEBROWS, mouth: MOUTH, nose: NOSE,
  bangs: BANGS, hairBack: HAIR_BACK, buns: BUNS,
  shirt: SHIRTS, pant: PANTS, belt: BELTS, sock: SOCKS, shoe: SHOES,
  necklace: NECKLACES, bracelet: BRACELETS, earring: EARRINGS, ring: RINGS, armwarmer: ARMWARMERS,
  hat: HATS, hairclip: HAIRCLIPS, dress: DRESSES,
};

function getItemName(type, id) {
  if (type === 'base') return 'Base';
  return ITEMS_BY_TYPE[type]?.find(i => i.id === id)?.name ?? type;
}

function getLayerThumbSrc(type, id) {
  if (type === 'base') return '/assets/base.png';
  if (id == null) return null;
  const a = WARDROBE_ASSET_MAP[type]?.[id];
  if (!a) return null;
  return a.iris || a.src || null;
}

// ── Layer panel (drag-to-reorder) — named export used by App ─────────────────
export function LayerPanel({ layers, onReorder, onRemove }) {
  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  // Display front-to-back (top = in front)
  const displayed = [...layers].reverse();

  function onDragStart(e, key) {
    setDragKey(key);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, key) {
    e.preventDefault();
    if (key !== dragKey) setOverKey(key);
  }

  function onDrop(e, key) {
    e.preventDefault();
    if (!dragKey || dragKey === key) { reset(); return; }
    const disp = [...layers].reverse();
    const from = disp.findIndex(l => l.key === dragKey);
    const to   = disp.findIndex(l => l.key === key);
    if (from === -1 || to === -1) { reset(); return; }
    disp.splice(from, 1);
    disp.splice(to, 0, layers.find(l => l.key === dragKey));
    onReorder(disp.reverse());
    reset();
  }

  function reset() { setDragKey(null); setOverKey(null); }

  return (
    <div className="layer-panel-card">
      <h3 className="panel-title">Layers</h3>
      <p className="layer-hint">↑ front · behind ↓</p>
      {displayed.length === 0 ? (
        <p className="layer-empty">No items equipped</p>
      ) : (
        <div className="layer-list">
          {displayed.map(({ key, type, id }) => {
            const src = getLayerThumbSrc(type, id);
            return (
              <div
                key={key}
                className={[
                  'layer-row',
                  dragKey === key ? 'dragging' : '',
                  overKey === key ? 'drag-over' : '',
                ].filter(Boolean).join(' ')}
                draggable
                onDragStart={e => onDragStart(e, key)}
                onDragOver={e => onDragOver(e, key)}
                onDrop={e => onDrop(e, key)}
                onDragEnd={reset}
                onDragLeave={() => setOverKey(null)}
              >
                <span className="drag-handle">⠿</span>
                {src && (
                  <div
                    className="layer-thumb"
                    style={{ backgroundImage: `url(${src})`, ...THUMB[type] }}
                  />
                )}
                <span className="layer-label">{getItemName(type, id)}</span>
                {type !== 'base' && (
                  <button
                    className="layer-remove-btn"
                    onClick={() => onRemove(key)}
                    title="Remove"
                  >×</button>
                )}
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
function Section({ label, thumbKey, items, equippedIds, onSelect, getThumbSrc }) {
  return (
    <div className="wardrobe-section">
      <h3>{label}</h3>
      <div className="item-thumb-grid">
        <button
          className={`thumb-none-btn${equippedIds.size === 0 ? ' selected' : ''}`}
          onClick={() => onSelect(null)}
          title="None"
        >✕</button>
        {items.map(item => (
          <ThumbBtn
            key={item.id}
            src={getThumbSrc(item.id)}
            thumbKey={thumbKey}
            name={item.name}
            selected={equippedIds.has(item.id)}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main wardrobe component ───────────────────────────────────────────────────
export default function Wardrobe({ layers, onEquip }) {
  const eqIds = type => new Set(layers.filter(l => l.type === type).map(l => l.id));
  const ts    = (type, id) => getLayerThumbSrc(type, id);

  return (
    <div className="wardrobe-panel">
      <Section label="Eyes"      thumbKey="eyes"     items={EYES}
        equippedIds={eqIds('eyes')}     onSelect={id => onEquip('eyes',     id)}
        getThumbSrc={id => ts('eyes',     id)} />
      <Section label="Eyebrows"  thumbKey="eyebrows" items={EYEBROWS}
        equippedIds={eqIds('eyebrows')} onSelect={id => onEquip('eyebrows', id)}
        getThumbSrc={id => ts('eyebrows', id)} />
      <Section label="Nose"      thumbKey="nose"     items={NOSE}
        equippedIds={eqIds('nose')}     onSelect={id => onEquip('nose',     id)}
        getThumbSrc={id => ts('nose',     id)} />
      <Section label="Mouth"     thumbKey="mouth"    items={MOUTH}
        equippedIds={eqIds('mouth')}    onSelect={id => onEquip('mouth',    id)}
        getThumbSrc={id => ts('mouth',    id)} />
      <Section label="Bangs"     thumbKey="bangs"    items={BANGS}
        equippedIds={eqIds('bangs')}    onSelect={id => onEquip('bangs',    id)}
        getThumbSrc={id => ts('bangs',    id)} />
      <Section label="Buns"      thumbKey="buns"     items={BUNS}
        equippedIds={eqIds('buns')}     onSelect={id => onEquip('buns',     id)}
        getThumbSrc={id => ts('buns',     id)} />
      <Section label="Hair Back" thumbKey="hairBack" items={HAIR_BACK}
        equippedIds={eqIds('hairBack')} onSelect={id => onEquip('hairBack', id)}
        getThumbSrc={id => ts('hairBack', id)} />
      <Section label="Hat"       thumbKey="hat"      items={HATS}
        equippedIds={eqIds('hat')}      onSelect={id => onEquip('hat',      id)}
        getThumbSrc={id => ts('hat',      id)} />
      <Section label="Hair Clip" thumbKey="hairclip" items={HAIRCLIPS}
        equippedIds={eqIds('hairclip')} onSelect={id => onEquip('hairclip', id)}
        getThumbSrc={id => ts('hairclip', id)} />
      <Section label="Earrings"  thumbKey="earring"  items={EARRINGS}
        equippedIds={eqIds('earring')}  onSelect={id => onEquip('earring',  id)}
        getThumbSrc={id => ts('earring',  id)} />
      <Section label="Ring"      thumbKey="ring"     items={RINGS}
        equippedIds={eqIds('ring')}     onSelect={id => onEquip('ring',     id)}
        getThumbSrc={id => ts('ring',     id)} />
      <Section label="Necklace"  thumbKey="necklace" items={NECKLACES}
        equippedIds={eqIds('necklace')} onSelect={id => onEquip('necklace', id)}
        getThumbSrc={id => ts('necklace', id)} />
      <Section label="Bracelet"  thumbKey="bracelet" items={BRACELETS}
        equippedIds={eqIds('bracelet')} onSelect={id => onEquip('bracelet', id)}
        getThumbSrc={id => ts('bracelet', id)} />
      <Section label="Dress"      thumbKey="dress"      items={DRESSES}
        equippedIds={eqIds('dress')}      onSelect={id => onEquip('dress',      id)}
        getThumbSrc={id => ts('dress',      id)} />
      <Section label="Tops"       thumbKey="shirt"      items={SHIRTS}
        equippedIds={eqIds('shirt')}      onSelect={id => onEquip('shirt',      id)}
        getThumbSrc={id => ts('shirt',      id)} />
      <Section label="Belt"       thumbKey="belt"       items={BELTS}
        equippedIds={eqIds('belt')}       onSelect={id => onEquip('belt',       id)}
        getThumbSrc={id => ts('belt',       id)} />
      <Section label="Bottoms"    thumbKey="pant"       items={PANTS}
        equippedIds={eqIds('pant')}       onSelect={id => onEquip('pant',       id)}
        getThumbSrc={id => ts('pant',       id)} />
      <Section label="Arm Warmers" thumbKey="armwarmer" items={ARMWARMERS}
        equippedIds={eqIds('armwarmer')}  onSelect={id => onEquip('armwarmer',  id)}
        getThumbSrc={id => ts('armwarmer',  id)} />
      <Section label="Socks"      thumbKey="sock"       items={SOCKS}
        equippedIds={eqIds('sock')}       onSelect={id => onEquip('sock',       id)}
        getThumbSrc={id => ts('sock',       id)} />
      <Section label="Shoes"      thumbKey="shoe"       items={SHOES}
        equippedIds={eqIds('shoe')}       onSelect={id => onEquip('shoe',       id)}
        getThumbSrc={id => ts('shoe',       id)} />
    </div>
  );
}
