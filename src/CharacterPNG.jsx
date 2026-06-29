// Add a new hair style: HAIR[n] = { back: '/assets/hairbackN.png', front: '/assets/bangN.png' }
const HAIR = {
  0: { back: '/assets/hairback1.png', front: '/assets/bang1.png' },
};

// Add a new eye shape: EYES[n] = { iris: '/assets/eyeN.png', brows: '/assets/eyebrowN.png' }
const EYES = {
  0: { iris: '/assets/eye1.png', brows: '/assets/eyebrow1.png' },
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// Standard tint — scale=2 compensates for ~50% gray base drawing
// black outlines stay black (0 × anything = 0), highlights clamp to color
function MatrixFilter({ id, color, scale = 2 }) {
  const [r, g, b] = hexToRgb(color);
  const s = scale;
  const m = `${s*r} 0 0 0 0  ${s*g} 0 0 0 0  ${s*b} 0 0 0 0  0 0 0 1 0`;
  return (
    <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feColorMatrix type="matrix" values={m} />
    </filter>
  );
}

// Eye tint — table lookup: black lashes→black, gray iris→eyeColor, white sclera→white
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

function Layer({ src, filterId }) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'fill',
        filter: filterId ? `url(#${filterId})` : undefined,
      }}
    />
  );
}

const SIZE = 480;

export default function CharacterPNG({ skinColor, hairColor, eyeColor, hairStyle, eyeShape }) {
  const hair = HAIR[hairStyle];
  const eyes = EYES[eyeShape];

  const ids = {
    skin: `skin-${skinColor.replace('#', '')}`,
    hair: `hair-${hairColor.replace('#', '')}`,
    eye:  `eye-${eyeColor.replace('#', '')}`,
  };

  return (
    <div
      className="character-group"
      style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}
    >
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <MatrixFilter id={ids.skin} color={skinColor} />
          <MatrixFilter id={ids.hair} color={hairColor} />
          <EyeFilter    id={ids.eye}  color={eyeColor} />
        </defs>
      </svg>

      {/* 1 — hair back (selected style, behind body) */}
      {hair && <Layer src={hair.back} filterId={ids.hair} />}

      {/* 2 — body base (always shown) */}
      <Layer src="/assets/base.png" filterId={ids.skin} />

      {/* 3 — eyes (selected shape) */}
      {eyes && <Layer src={eyes.iris} filterId={ids.eye} />}

      {/* 4 — eyebrows (match hair color, same shape set as eyes) */}
      {eyes && <Layer src={eyes.brows} filterId={ids.hair} />}

      {/* 5 — mouth (always shown, skin-shadow tint) */}
      <Layer src="/assets/mouth1.png" filterId={ids.skin} />

      {/* 6 — nose (always shown) */}
      <Layer src="/assets/nose.png" filterId={ids.skin} />

      {/* 7 — bangs / front hair (selected style, on top) */}
      {hair && <Layer src={hair.front} filterId={ids.hair} />}
    </div>
  );
}
