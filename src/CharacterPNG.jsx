// Eye sets: each entry pairs a sclera (fixed white) with an iris (color-tinted)
// Add new eye styles here: EYES_ASSETS[n] = { sclera: '...', iris: '...' }
const EYES_ASSETS = {
  0: { sclera: '/assets/sclera1.png', iris: '/assets/eye1.png' },
};

// Other feature asset maps
const EYEBROWS_ASSETS = { 0: '/assets/eyebrow1.png' };
const MOUTH_ASSETS    = { 0: '/assets/mouth1.png'   };
const NOSE_ASSETS     = { 0: '/assets/nose.png'     };
const BANGS_ASSETS    = { 0: '/assets/bang1.png', 1: '/assets/bang2.png' };
const HAIR_BACK_ASSETS = { 0: '/assets/hairback1.png' };

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

// Eye iris tint — table: black lashes→black, gray iris→eyeColor, white→white
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

// Sclera filter — forces every non-transparent pixel to pure white
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
}) {
  const ids = {
    skin: `skin-${skinColor.replace('#', '')}`,
    hair: `hair-${hairColor.replace('#', '')}`,
    eye:  `eye-${eyeColor.replace('#', '')}`,
  };

  const eyeSet     = eyes      != null ? EYES_ASSETS[eyes]          : null;
  const eyebrowSrc = eyebrows  != null ? EYEBROWS_ASSETS[eyebrows]  : null;
  const mouthSrc   = mouth     != null ? MOUTH_ASSETS[mouth]        : null;
  const noseSrc    = nose      != null ? NOSE_ASSETS[nose]          : null;
  const bangsSrc   = bangs     != null ? BANGS_ASSETS[bangs]        : null;
  const hairBackSrc = hairBack != null ? HAIR_BACK_ASSETS[hairBack] : null;

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

      {/* Layer order: hair back → base → sclera → iris → brows → mouth → nose → bangs */}
      {hairBackSrc  && <Layer src={hairBackSrc}   filterId={ids.hair}   />}
                       <Layer src="/assets/base.png" filterId={ids.skin} />
      {eyeSet?.sclera && <Layer src={eyeSet.sclera} filterId={WHITEN_ID} />}
      {eyeSet?.iris   && <Layer src={eyeSet.iris}   filterId={ids.eye}   />}
      {eyebrowSrc   && <Layer src={eyebrowSrc}    filterId={ids.hair}   />}
      {mouthSrc     && <Layer src={mouthSrc}      filterId={ids.skin}   />}
      {noseSrc      && <Layer src={noseSrc}       filterId={ids.skin}   />}
      {bangsSrc     && <Layer src={bangsSrc}      filterId={ids.hair}   />}
    </div>
  );
}
