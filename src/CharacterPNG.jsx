import DrawingCanvas from './DrawingCanvas.jsx';
import {
  EYES_ASSETS, EYEBROWS_ASSETS, MOUTH_ASSETS, NOSE_ASSETS,
  BANGS_ASSETS, HAIR_BACK_ASSETS, BUNS_ASSETS,
  SHIRT_ASSETS, PANT_ASSETS, SOCK_ASSETS, SHOE_ASSETS,
  NECKLACE_ASSETS, BRACELET_ASSETS, EARRING_ASSETS, HAT_ASSETS,
} from './assets.js';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// Standard tint — scale=2 maps 50%-gray base to the full target color
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

// Eye iris tint — black lashes stay black, gray iris → eyeColor, white stays white
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

// Forces every non-transparent pixel to pure white
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
  eyes, eyebrows, mouth, nose, bangs, hairBack,
  buns,
  shirt, pant, sock, socksOver, shoe,
  necklace, bracelet, earring, hat,
  drawRef, drawTool, drawColor, brushSize, maskSrcs,
}) {
  const ids = {
    skin: `skin-${skinColor.replace('#', '')}`,
    hair: `hair-${hairColor.replace('#', '')}`,
    eye:  `eye-${eyeColor.replace('#', '')}`,
  };

  const eyeSet      = eyes      != null ? EYES_ASSETS[eyes]            : null;
  const eyebrowSrc  = eyebrows  != null ? EYEBROWS_ASSETS[eyebrows]    : null;
  const mouthSrc    = mouth     != null ? MOUTH_ASSETS[mouth]          : null;
  const noseSrc     = nose      != null ? NOSE_ASSETS[nose]            : null;
  const bangsSrc    = bangs     != null ? BANGS_ASSETS[bangs]          : null;
  const hairBackSrc = hairBack  != null ? HAIR_BACK_ASSETS[hairBack]   : null;
  const bunsSrc     = buns      != null ? BUNS_ASSETS[buns]            : null;
  const shirtSrc    = shirt     != null ? SHIRT_ASSETS[shirt]          : null;
  const pantSrc     = pant      != null ? PANT_ASSETS[pant]            : null;
  const sockSrc     = sock      != null ? SOCK_ASSETS[sock]            : null;
  const shoeSrc     = shoe      != null ? SHOE_ASSETS[shoe]            : null;
  const necklaceSrc = necklace  != null ? NECKLACE_ASSETS[necklace]    : null;
  const braceletSrc = bracelet  != null ? BRACELET_ASSETS[bracelet]    : null;
  const earringSrc  = earring   != null ? EARRING_ASSETS[earring]      : null;
  const hatSrc      = hat       != null ? HAT_ASSETS[hat]              : null;

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

      {/* Layer order (bottom → top):
          buns → hairBack → base → sclera → iris → brows → mouth → nose →
          earrings → [sock under] → shoe → [sock over] → pant → shirt →
          necklace → bracelet → bangs → hat → drawing canvas            */}

      {bunsSrc      && <Layer src={bunsSrc}        filterId={ids.hair}   />}
      {hairBackSrc  && <Layer src={hairBackSrc}    filterId={ids.hair}   />}
                       <Layer src="/assets/base.png" filterId={ids.skin} />
      {eyeSet?.sclera && <Layer src={eyeSet.sclera} filterId={WHITEN_ID} />}
      {eyeSet?.iris   && <Layer src={eyeSet.iris}   filterId={ids.eye}   />}
      {eyebrowSrc   && <Layer src={eyebrowSrc}     filterId={ids.hair}   />}
      {mouthSrc     && <Layer src={mouthSrc}       filterId={ids.skin}   />}
      {noseSrc      && <Layer src={noseSrc}        filterId={ids.skin}   />}
      {earringSrc   && <Layer src={earringSrc}                           />}
      {!socksOver && sockSrc && <Layer src={sockSrc}                     />}
      {shoeSrc      && <Layer src={shoeSrc}                              />}
      {socksOver  && sockSrc && <Layer src={sockSrc}                     />}
      {pantSrc      && <Layer src={pantSrc}                              />}
      {shirtSrc     && <Layer src={shirtSrc}                             />}
      {necklaceSrc  && <Layer src={necklaceSrc}                          />}
      {braceletSrc  && <Layer src={braceletSrc}                          />}
      {bangsSrc     && <Layer src={bangsSrc}       filterId={ids.hair}   />}
      {hatSrc       && <Layer src={hatSrc}                               />}

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
