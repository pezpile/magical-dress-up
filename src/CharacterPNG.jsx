import { Fragment } from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
  SHIRT_ASSETS, PANT_ASSETS, SOCK_ASSETS, SHOE_ASSETS,
  NECKLACE_ASSETS, BRACELET_ASSETS, EARRING_ASSETS, BELT_ASSETS, RING_ASSETS,
  HAT_ASSETS, HAIRCLIP_ASSETS,
} from './assets.js';

const ASSET_MAP = {
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

const HAIR_TYPES = new Set(['buns', 'hairBack', 'bangs', 'eyebrows']);
const SKIN_TYPES = new Set(['mouth', 'nose']);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function MatrixFilter({ id, color, scale = 2 }) {
  const [r, g, b] = hexToRgb(color);
  const s = scale;
  return (
    <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feColorMatrix type="matrix"
        values={`${s*r} 0 0 0 0  ${s*g} 0 0 0 0  ${s*b} 0 0 0 0  0 0 0 1 0`} />
    </filter>
  );
}

function EyeFilter({ id, color }) {
  const [r, g, b] = hexToRgb(color);
  return (
    <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feComponentTransfer>
        <feFuncR type="table" tableValues={`0 ${r} 1`} />
        <feFuncG type="table" tableValues={`0 ${g} 1`} />
        <feFuncB type="table" tableValues={`0 ${b} 1`} />
      </feComponentTransfer>
    </filter>
  );
}

const WHITEN_ID = 'whiten-sclera';
function WhitenFilter() {
  return (
    <filter id={WHITEN_ID} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
    </filter>
  );
}

function Layer({ src, filterId }) {
  return (
    <img src={src} alt="" style={{
      position: 'absolute', top: 0, left: 0,
      width: '100%', height: '100%',
      objectFit: 'fill',
      filter: filterId ? `url(#${filterId})` : undefined,
    }} />
  );
}

export default function CharacterPNG({
  skinColor, hairColor, eyeColor,
  layers,
  drawRef, drawTool, drawColor, brushSize, maskSrcs,
}) {
  const ids = {
    skin: `skin-${skinColor.replace('#', '')}`,
    hair: `hair-${hairColor.replace('#', '')}`,
    eye:  `eye-${eyeColor.replace('#', '')}`,
  };

  return (
    <div className="character-group">
      <svg aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <MatrixFilter id={ids.skin} color={skinColor} />
          <MatrixFilter id={ids.hair} color={hairColor} />
          <EyeFilter    id={ids.eye}  color={eyeColor}  />
          <WhitenFilter />
        </defs>
      </svg>

      {layers.map(({ key, type, id }) => {
        if (type === 'base') {
          return <Layer key={key} src="/assets/base.png" filterId={ids.skin} />;
        }
        if (type === 'eyes') {
          const eyeSet = EYES_ASSETS[id];
          if (!eyeSet) return null;
          return (
            <Fragment key={key}>
              <Layer src={eyeSet.sclera} filterId={WHITEN_ID} />
              <Layer src={eyeSet.iris}   filterId={ids.eye}   />
            </Fragment>
          );
        }
        const asset = ASSET_MAP[type]?.[id];
        if (!asset) return null;
        const filterId = HAIR_TYPES.has(type) ? ids.hair
                       : SKIN_TYPES.has(type) ? ids.skin
                       : undefined;
        return <Layer key={key} src={asset.src} filterId={filterId} />;
      })}

      <DrawingCanvas
        ref={drawRef}
        tool={drawTool}
        color={drawColor}
        size={brushSize}
        maskSrcs={maskSrcs}
      />
    </div>
  );
}
