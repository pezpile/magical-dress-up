import React from 'react';

const OL = '#2d1a10'; // warm dark brown outline
const OW = 3;         // base outline width

// ── HEART BLUSH ──────────────────────────────────────────────────────────────
function HeartBlush({ cx, cy, size = 13, fill = 'rgba(255,105,145,0.42)', rotate = 0 }) {
  const h = size;
  const d = `M ${cx} ${cy + h * 0.5}
    C ${cx} ${cy + h * 0.2} ${cx - h * 0.72} ${cy - h * 0.05} ${cx - h * 0.5} ${cy - h * 0.38}
    C ${cx - h * 0.18} ${cy - h * 0.72} ${cx} ${cy - h * 0.38} ${cx} ${cy - h * 0.18}
    C ${cx} ${cy - h * 0.38} ${cx + h * 0.18} ${cy - h * 0.72} ${cx + h * 0.5} ${cy - h * 0.38}
    C ${cx + h * 0.72} ${cy - h * 0.05} ${cx} ${cy + h * 0.2} ${cx} ${cy + h * 0.5} Z`;
  return <path d={d} fill={fill} transform={`rotate(${rotate},${cx},${cy})`} />;
}

// ── HAIR ─────────────────────────────────────────────────────────────────────
// Bumpy helper: overlapping circles along the crown for an organic fluff look
function HairBumps({ points, color }) {
  return (
    <>
      {points.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={color} />
      ))}
    </>
  );
}

function HairBack({ style, color }) {
  switch (style) {
    case 0: { // Fluffy Bob — bumpy crown, chin-length
      const bumps = [[102,50,28],[130,38,27],[158,36,26],[184,48,24],[200,68,20],[84,65,22]];
      return (
        <g>
          <ellipse cx="150" cy="112" rx="76" ry="88" fill={color} stroke={OL} strokeWidth={OW} />
          <HairBumps points={bumps} color={color} />
          {bumps.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={OL} strokeWidth={OW} />
          ))}
          {/* Side puffs */}
          <ellipse cx="78" cy="135" rx="18" ry="26" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="222" cy="135" rx="18" ry="26" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    }
    case 1: { // Long Straight
      const bumps = [[108,52,24],[134,40,24],[160,38,23],[184,46,22],[198,66,18],[88,68,20]];
      return (
        <g>
          <ellipse cx="150" cy="108" rx="76" ry="84" fill={color} stroke={OL} strokeWidth={OW} />
          <HairBumps points={bumps} color={color} />
          {bumps.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={OL} strokeWidth={OW} />
          ))}
          {/* Long side panels */}
          <path d="M 78 122 Q 72 220 70 325 Q 72 350 82 338 Q 90 312 90 228 L 88 122 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 222 122 Q 228 220 230 325 Q 228 350 218 338 Q 210 312 210 228 L 212 122 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 88 122 Q 86 265 88 345 Q 98 365 122 358 Q 150 353 178 358 Q 202 365 212 345 Q 214 265 212 122 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    }
    case 2: { // Twin Braids — linked segment chains
      const bumps = [[108,55,22],[134,44,22],[160,42,21],[182,52,20],[196,70,17],[90,70,18]];
      const makeBraid = (side) => {
        const startX = side === 'L' ? 72 : 228;
        const dirX = side === 'L' ? -1 : 1;
        return Array.from({ length: 9 }, (_, i) => {
          const cx = startX + dirX * i * 4;
          const cy = 120 + i * 26;
          const rot = (side === 'L' ? -12 : 12) + i * (side === 'L' ? 9 : -9);
          return (
            <ellipse key={i} cx={cx} cy={cy} rx="16" ry="13"
              fill={color} stroke={OL} strokeWidth={OW - 0.5}
              transform={`rotate(${rot},${cx},${cy})`} />
          );
        });
      };
      return (
        <g>
          <ellipse cx="150" cy="96" rx="73" ry="78" fill={color} stroke={OL} strokeWidth={OW} />
          <HairBumps points={bumps} color={color} />
          {bumps.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={OL} strokeWidth={OW} />
          ))}
          {makeBraid('L')}
          {makeBraid('R')}
        </g>
      );
    }
    case 3: { // Wavy
      const bumps = [[106,54,25],[132,42,24],[158,40,23],[182,50,22],[198,68,18],[88,68,20]];
      return (
        <g>
          <ellipse cx="150" cy="104" rx="76" ry="85" fill={color} stroke={OL} strokeWidth={OW} />
          <HairBumps points={bumps} color={color} />
          {bumps.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={OL} strokeWidth={OW} />
          ))}
          {/* Wavy side shapes */}
          <path d="M 80 122 Q 72 162 76 196 Q 80 218 72 240 Q 64 255 72 268 Q 80 278 88 258 Q 92 240 90 218 Q 88 198 92 168 Q 94 142 90 122 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 220 122 Q 228 162 224 196 Q 220 218 228 240 Q 236 255 228 268 Q 220 278 212 258 Q 208 240 210 218 Q 212 198 208 168 Q 206 142 210 122 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 90 118 Q 86 188 90 230 Q 96 258 88 276 Q 82 290 94 295 Q 108 297 113 278 Q 118 262 124 244 Q 134 260 144 265 Q 150 267 156 265 Q 166 260 176 244 Q 182 262 187 278 Q 192 297 206 295 Q 218 290 212 276 Q 204 258 210 230 Q 214 188 210 118 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    }
    case 4: { // Short Pixie + Ahoge
      const bumps = [[106,58,22],[130,46,21],[154,44,21],[176,54,19],[190,72,16],[90,72,17]];
      return (
        <g>
          <ellipse cx="150" cy="98" rx="72" ry="76" fill={color} stroke={OL} strokeWidth={OW} />
          <HairBumps points={bumps} color={color} />
          {bumps.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={OL} strokeWidth={OW} />
          ))}
          <path d="M 82 115 Q 76 138 82 153 Q 87 162 93 150 Q 97 138 96 118 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 218 115 Q 224 138 218 153 Q 213 162 207 150 Q 203 138 204 118 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    }
    default: return null;
  }
}

function HairFront({ style, color }) {
  switch (style) {
    case 0: // Fluffy Bob bangs
      return (
        <g>
          <path d="M 90 82 Q 98 55 150 50 Q 202 55 210 82 Q 200 90 186 72 Q 170 58 150 59 Q 130 58 114 72 Q 100 90 90 82 Z"
            fill={color} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          <path d="M 92 86 Q 82 106 84 146 Q 86 164 95 153 Q 102 134 104 108 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 208 86 Q 218 106 216 146 Q 214 164 205 153 Q 198 134 196 108 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case 1: // Long Straight bangs
      return (
        <g>
          <path d="M 88 90 Q 94 56 150 51 Q 206 56 212 90 Q 198 98 180 80 Q 165 63 150 62 Q 135 63 120 80 Q 102 98 88 90 Z"
            fill={color} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          <path d="M 90 94 Q 82 113 82 184 Q 84 198 92 188 Q 98 164 100 134 Q 101 112 103 97 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 210 94 Q 218 113 218 184 Q 216 198 208 188 Q 202 164 200 134 Q 199 112 197 97 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case 2: // Twin Braids — just bangs (braids are in back layer)
      return (
        <g>
          <path d="M 94 82 Q 102 54 150 50 Q 198 54 206 82 Q 195 90 182 70 Q 167 58 150 59 Q 133 58 118 70 Q 105 90 94 82 Z"
            fill={color} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          {/* Hair tie bumps */}
          <ellipse cx="80" cy="110" rx="11" ry="11" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="80" cy="110" rx="6" ry="6" fill="rgba(255,255,255,0.45)" />
          <ellipse cx="220" cy="110" rx="11" ry="11" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="220" cy="110" rx="6" ry="6" fill="rgba(255,255,255,0.45)" />
        </g>
      );
    case 3: // Wavy bangs
      return (
        <g>
          <path d="M 89 87 Q 97 54 150 50 Q 203 54 211 87 Q 200 95 186 76 Q 168 61 150 61 Q 132 61 114 76 Q 100 95 89 87 Z"
            fill={color} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          <path d="M 91 91 Q 83 112 84 150 Q 85 172 92 184 Q 97 174 98 154 Q 100 132 103 112 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 209 91 Q 217 112 216 150 Q 215 172 208 184 Q 203 174 202 154 Q 200 132 197 112 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case 4: // Pixie + Ahoge bangs
      return (
        <g>
          <path d="M 96 85 Q 104 56 150 51 Q 196 56 204 85 Q 192 92 178 73 Q 163 61 150 59 Q 137 61 122 73 Q 108 92 96 85 Z"
            fill={color} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          <path d="M 98 89 Q 89 107 91 122 Q 94 132 100 123 Q 103 113 106 98 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 202 89 Q 211 107 209 122 Q 206 132 200 123 Q 197 113 194 98 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          {/* Ahoge */}
          <path d="M 146 51 Q 136 28 150 15 Q 162 8 164 22 Q 167 38 155 50 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    default: return null;
  }
}

// ── EYES ─────────────────────────────────────────────────────────────────────
function Eyes({ shape, eyeColor, skinColor }) {
  switch (shape) {
    case 0: // Droopy soft — matches the reference style
      return (
        <g>
          {/* Left eye */}
          <g className="eye-left">
            <ellipse cx="112" cy="118" rx="23" ry="17" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="112" cy="113" rx="14" ry="15" fill={eyeColor} />
            <ellipse cx="112" cy="113" rx="7.5" ry="8" fill="#1a0d08" />
            <ellipse cx="119" cy="106" rx="5.5" ry="5" fill="white" />
            <ellipse cx="105" cy="119" rx="2.5" ry="2.5" fill="rgba(255,255,255,0.85)" />
            {/* Warm under-eye shadow */}
            <path d="M 91 127 Q 112 136 133 127 Q 131 132 112 134 Q 93 132 91 127 Z"
              fill="rgba(120,58,28,0.18)" />
            {/* Upper lid — droops at outer corner */}
            <path d="M 89 111 Q 112 103 135 111"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 133 111 Q 138 116 135 123"
              stroke={OL} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Lower lid */}
            <path d="M 91 126 Q 112 133 133 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          {/* Right eye */}
          <g className="eye-right">
            <ellipse cx="188" cy="118" rx="23" ry="17" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="188" cy="113" rx="14" ry="15" fill={eyeColor} />
            <ellipse cx="188" cy="113" rx="7.5" ry="8" fill="#1a0d08" />
            <ellipse cx="195" cy="106" rx="5.5" ry="5" fill="white" />
            <ellipse cx="181" cy="119" rx="2.5" ry="2.5" fill="rgba(255,255,255,0.85)" />
            <path d="M 167 127 Q 188 136 209 127 Q 207 132 188 134 Q 169 132 167 127 Z"
              fill="rgba(120,58,28,0.18)" />
            <path d="M 165 111 Q 188 103 211 111"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 167 111 Q 162 116 165 123"
              stroke={OL} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 167 126 Q 188 133 209 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    case 1: // Wide + sparkly
      return (
        <g>
          <g className="eye-left">
            <ellipse cx="112" cy="116" rx="23" ry="19" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="112" cy="115" rx="15" ry="16" fill={eyeColor} />
            <ellipse cx="112" cy="115" rx="8" ry="9" fill="#1a0d08" />
            <ellipse cx="121" cy="108" rx="6" ry="5.5" fill="white" />
            <ellipse cx="105" cy="122" rx="3" ry="3" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="119" cy="122" rx="1.5" ry="1.5" fill="rgba(255,255,255,0.7)" />
            <path d="M 89 109 Q 112 100 135 109"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 91 126 Q 112 133 133 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g className="eye-right">
            <ellipse cx="188" cy="116" rx="23" ry="19" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="188" cy="115" rx="15" ry="16" fill={eyeColor} />
            <ellipse cx="188" cy="115" rx="8" ry="9" fill="#1a0d08" />
            <ellipse cx="197" cy="108" rx="6" ry="5.5" fill="white" />
            <ellipse cx="181" cy="122" rx="3" ry="3" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="195" cy="122" rx="1.5" ry="1.5" fill="rgba(255,255,255,0.7)" />
            <path d="M 165 109 Q 188 100 211 109"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 167 126 Q 188 133 209 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    case 2: // Star (magical girl)
      return (
        <g>
          <g className="eye-left">
            <ellipse cx="112" cy="117" rx="23" ry="18" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="112" cy="116" rx="15" ry="16" fill={eyeColor} />
            <ellipse cx="112" cy="116" rx="8.5" ry="9" fill="#101028" />
            <polygon points="112,106 114,112 121,112 115.5,116 117.5,123 112,119 106.5,123 108.5,116 103,112 110,112"
              fill="white" opacity="0.95" />
            <ellipse cx="106" cy="124" rx="2.5" ry="2.5" fill="white" opacity="0.85" />
            <ellipse cx="120" cy="108" rx="2" ry="2" fill="white" opacity="0.8" />
            <path d="M 89 109 Q 112 100 135 109"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 133 109 L 138 105" stroke={OL} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 91 126 Q 112 132 133 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g className="eye-right">
            <ellipse cx="188" cy="117" rx="23" ry="18" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="188" cy="116" rx="15" ry="16" fill={eyeColor} />
            <ellipse cx="188" cy="116" rx="8.5" ry="9" fill="#101028" />
            <polygon points="188,106 190,112 197,112 191.5,116 193.5,123 188,119 182.5,123 184.5,116 179,112 186,112"
              fill="white" opacity="0.95" />
            <ellipse cx="182" cy="124" rx="2.5" ry="2.5" fill="white" opacity="0.85" />
            <ellipse cx="196" cy="108" rx="2" ry="2" fill="white" opacity="0.8" />
            <path d="M 165 109 Q 188 100 211 109"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 167 109 L 162 105" stroke={OL} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 167 126 Q 188 132 209 126"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    case 3: // Sleepy / heavy-lidded
      return (
        <g>
          <g className="eye-left">
            <ellipse cx="112" cy="121" rx="23" ry="14" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="112" cy="119" rx="13" ry="12" fill={eyeColor} />
            <ellipse cx="112" cy="120" rx="7" ry="7" fill="#1a0d08" />
            <ellipse cx="118" cy="114" rx="4" ry="4" fill="white" />
            {/* Heavy upper lid */}
            <path d="M 89 114 Q 112 107 135 114 Q 130 119 112 117 Q 94 119 89 114 Z" fill={skinColor} />
            <path d="M 89 114 Q 112 107 135 114"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 133 114 L 138 112" stroke={OL} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 91 128 Q 112 135 133 128"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g className="eye-right">
            <ellipse cx="188" cy="121" rx="23" ry="14" fill="white" stroke={OL} strokeWidth="2.5" />
            <ellipse cx="188" cy="119" rx="13" ry="12" fill={eyeColor} />
            <ellipse cx="188" cy="120" rx="7" ry="7" fill="#1a0d08" />
            <ellipse cx="194" cy="114" rx="4" ry="4" fill="white" />
            <path d="M 165 114 Q 188 107 211 114 Q 206 119 188 117 Q 170 119 165 114 Z" fill={skinColor} />
            <path d="M 165 114 Q 188 107 211 114"
              stroke={OL} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 167 114 L 162 112" stroke={OL} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 167 128 Q 188 135 209 128"
              stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    default: return null;
  }
}

// ── TOPS ─────────────────────────────────────────────────────────────────────
function Top({ index, color }) {
  switch (index) {
    case 0: // Sailor
      return (
        <g>
          <path d="M 88 222 L 76 330 L 224 330 L 212 222 C 195 213 168 210 150 210 C 132 210 105 213 88 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 126 211 L 108 220 L 108 248 L 150 266 L 192 248 L 192 220 L 174 211 L 162 228 L 150 242 L 138 228 Z"
            fill="white" stroke={OL} strokeWidth="2" />
          <path d="M 110 244 Q 150 260 190 244" stroke="#1a3a8a" strokeWidth="2.5" fill="none" />
          <path d="M 143 246 L 148 258 L 143 264 M 157 246 L 152 258 L 157 264"
            stroke="#cc1111" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="258" r="5.5" fill="#aa0000" stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case 1: // Crop Bow
      return (
        <g>
          <path d="M 90 222 L 84 280 L 216 280 L 210 222 C 194 213 168 210 150 210 C 132 210 106 213 90 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 126 211 Q 150 226 174 211" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" fill="none" />
          <path d="M 140 224 L 147 233 L 140 240 M 160 224 L 153 233 L 160 240"
            stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="233" r="5.5" fill="white" stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case 2: // Frilly Blouse
      return (
        <g>
          <path d="M 88 222 L 76 330 L 224 330 L 212 222 C 195 213 168 210 150 210 C 132 210 105 213 88 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 120 211 Q 135 225 150 217 Q 165 225 180 211"
            stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
          <path d="M 126 230 Q 150 242 174 230" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
          <path d="M 120 254 Q 150 268 180 254" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
          <path d="M 114 280 Q 150 295 186 280" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
          <path d="M 110 306 Q 150 320 190 306" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
          <ellipse cx="82" cy="295" rx="11" ry="15" fill="rgba(255,255,255,0.45)" stroke={OL} strokeWidth="2" />
          <ellipse cx="218" cy="295" rx="11" ry="15" fill="rgba(255,255,255,0.45)" stroke={OL} strokeWidth="2" />
        </g>
      );
    case 3: // Hoodie
      return (
        <g>
          <path d="M 84 222 L 70 332 L 230 332 L 216 222 C 197 211 168 208 150 208 C 132 208 103 211 84 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 114 211 Q 100 200 93 220" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 186 211 Q 200 200 207 220" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 114 211 Q 100 200 93 220" stroke={OL} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 186 211 Q 200 200 207 220" stroke={OL} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="120" y="280" width="60" height="38" rx="9"
            fill="rgba(0,0,0,0.1)" stroke={OL} strokeWidth="2" />
          <path d="M 150 215 L 150 280" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeDasharray="5 4" />
          <path d="M 140 219 L 136 242 M 160 219 L 164 242"
            stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 4: // Off-Shoulder
      return (
        <g>
          <path d="M 72 242 L 68 330 L 232 330 L 228 242 Q 216 228 150 226 Q 84 228 72 242 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 72 242 Q 150 254 228 242" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" />
          <ellipse cx="72" cy="239" rx="15" ry="13" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="228" cy="239" rx="15" ry="13" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    default: return null;
  }
}

// ── BOTTOMS ──────────────────────────────────────────────────────────────────
function Bottom({ index, color }) {
  switch (index) {
    case 0: // Pleated Skirt
      return (
        <g>
          <path d="M 108 324 L 68 452 L 232 452 L 192 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="106" y="318" width="88" height="14" rx="4"
            fill={color} stroke={OL} strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5].map(i => (
            <path key={i} d={`M ${116 + i * 14} 332 L ${77 + i * 26} 452`}
              stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
          ))}
        </g>
      );
    case 1: // Shorts
      return (
        <g>
          <path d="M 106 324 L 97 384 L 203 384 L 194 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 150 324 L 150 384" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <rect x="104" y="318" width="92" height="13" rx="4"
            fill={color} stroke={OL} strokeWidth="2" />
          <path d="M 97 380 L 150 380 M 150 380 L 203 380"
            stroke="rgba(255,255,255,0.42)" strokeWidth="2" fill="none" />
        </g>
      );
    case 2: // Flared Skirt
      return (
        <g>
          <path d="M 110 324 L 50 458 L 250 458 L 190 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 50 458 Q 88 446 122 458 Q 152 468 182 458 Q 216 446 250 458"
            stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" fill="none" />
          <rect x="108" y="318" width="84" height="13" rx="4"
            fill={color} stroke={OL} strokeWidth="2" />
        </g>
      );
    case 3: // Pants
      return (
        <g>
          <path d="M 106 324 L 99 450 Q 115 457 131 450 L 149 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 151 324 L 169 450 Q 185 457 201 450 L 194 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="104" y="318" width="92" height="13" rx="4"
            fill={color} stroke={OL} strokeWidth="2" />
        </g>
      );
    case 4: // Ruffle Mini
      return (
        <g>
          <path d="M 108 324 L 90 384 L 210 384 L 192 324 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 86 366 Q 105 374 122 366 Q 138 358 150 366 Q 162 374 178 366 Q 195 358 214 366 L 210 384 L 90 384 Z"
            fill={color} stroke={OL} strokeWidth="2" />
          <rect x="106" y="318" width="88" height="13" rx="4"
            fill={color} stroke={OL} strokeWidth="2" />
          <path d="M 86 366 Q 105 374 122 366 Q 138 358 150 366 Q 162 374 178 366 Q 195 358 214 366"
            stroke="rgba(255,255,255,0.42)" strokeWidth="2" fill="none" />
        </g>
      );
    default: return null;
  }
}

// ── DRESSES ──────────────────────────────────────────────────────────────────
function Dress({ index, color }) {
  switch (index) {
    case 0: // Magical Girl
      return (
        <g>
          <path d="M 96 222 L 88 297 L 212 297 L 204 222 C 188 213 168 210 150 210 C 132 210 112 213 96 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 84 293 Q 60 358 50 458 L 250 458 Q 240 358 216 293 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 62 378 Q 104 390 150 384 Q 196 390 238 378 L 236 414 Q 196 404 150 410 Q 104 404 64 414 Z"
            fill={color} opacity="0.72" stroke={OL} strokeWidth="1.5" />
          <path d="M 122 211 Q 150 228 178 211" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
          <path d="M 133 294 L 142 302 L 133 310 M 167 294 L 158 302 L 167 310"
            stroke="rgba(255,255,255,0.88)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="302" r="6.5" fill="rgba(255,255,255,0.88)" stroke={OL} strokeWidth="1.5" />
          <polygon points="105,332 107.5,340 115,340 109,345 111.5,353 105,348.5 98.5,353 101,345 95,340 102.5,340"
            fill="rgba(255,228,80,0.82)" stroke={OL} strokeWidth="1.5" />
          <polygon points="195,344 197,350 204,350 199,354 201,361 195,357 189,361 191,354 186,350 193,350"
            fill="rgba(255,228,80,0.82)" stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case 1: // Lolita
      return (
        <g>
          <path d="M 96 222 L 90 300 L 210 300 L 204 222 C 188 213 168 210 150 210 C 132 210 112 213 96 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 86 295 Q 58 342 56 398 L 244 398 Q 242 342 214 295 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 54 378 Q 150 395 246 378 L 244 398 Q 150 415 56 398 Z"
            fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5" />
          <path d="M 52 398 Q 150 416 248 398 L 250 432 Q 150 450 50 432 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 120 211 Q 150 230 180 211" stroke="rgba(255,255,255,0.62)" strokeWidth="2" fill="none" />
          <path d="M 107 237 Q 150 252 193 237" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
          <path d="M 136 296 L 144 304 L 136 312 M 164 296 L 156 304 L 164 312"
            stroke="rgba(255,255,255,0.82)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="304" r="5.5" fill="rgba(255,255,255,0.82)" stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case 2: // Sundress
      return (
        <g>
          <path d="M 100 222 L 94 300 L 206 300 L 200 222 C 185 214 168 211 150 211 C 132 211 115 214 100 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 90 296 Q 70 362 66 458 L 234 458 Q 230 362 210 296 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 128 211 L 122 227" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <path d="M 172 211 L 178 227" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <path d="M 128 211 L 122 227 M 172 211 L 178 227"
            stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 122 213 Q 150 232 178 213" stroke="rgba(255,255,255,0.52)" strokeWidth="2" fill="none" />
          <path d="M 92 298 Q 150 308 208 298" stroke="rgba(255,255,255,0.42)" strokeWidth="2" fill="none" />
          {[[118,348],[150,334],[182,360],[133,388],[167,402]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="rgba(255,255,255,0.42)" />
          ))}
        </g>
      );
    case 3: // Princess Ballgown
      return (
        <g>
          <path d="M 94 222 L 88 302 L 212 302 L 206 222 C 188 213 168 210 150 210 C 132 210 112 213 94 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 86 298 Q 46 365 28 458 L 272 458 Q 254 365 214 298 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 48 418 Q 150 432 252 418 L 260 440 Q 150 456 40 440 Z"
            fill="rgba(255,255,255,0.2)" />
          <path d="M 118 211 Q 150 232 182 211" stroke="rgba(255,215,0,0.72)" strokeWidth="3" fill="none" />
          <path d="M 90 262 Q 150 274 210 262" stroke="rgba(255,215,0,0.42)" strokeWidth="1.5" fill="none" />
          <path d="M 88 282 Q 150 294 212 282" stroke="rgba(255,215,0,0.42)" strokeWidth="1.5" fill="none" />
          <path d="M 40 394 Q 150 408 260 394" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none" />
          <polygon points="150,312 152.5,320 160,320 154.5,324.5 157,332 150,327.5 143,332 145.5,324.5 140,320 147.5,320"
            fill="rgba(255,215,0,0.72)" stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case 4: // Casual Mini
      return (
        <g>
          <path d="M 98 222 L 86 394 L 214 394 L 202 222 C 186 213 168 210 150 210 C 132 210 114 213 98 222 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 124 211 Q 150 228 176 211" stroke="rgba(255,255,255,0.52)" strokeWidth="2.5" fill="none" />
          <rect x="110" y="290" width="80" height="13" rx="4"
            fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" />
          <rect x="144" y="292" width="12" height="9" rx="2" fill="rgba(255,255,255,0.42)" />
          <path d="M 86 390 Q 150 398 214 390" stroke="rgba(255,255,255,0.38)" strokeWidth="2" fill="none" />
        </g>
      );
    default: return null;
  }
}

// ── ACCESSORIES ──────────────────────────────────────────────────────────────
function Accessory({ index, color }) {
  switch (index) {
    case 0: // Big Bow
      return (
        <g>
          <path d="M 92 80 Q 150 64 208 80" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 92 80 Q 150 64 208 80" stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 172 62 Q 154 44 162 66 Q 168 80 181 74 Q 196 68 172 62 Z"
            fill={color} stroke={OL} strokeWidth="2.5" />
          <path d="M 208 62 Q 226 44 218 66 Q 212 80 199 74 Q 184 68 208 62 Z"
            fill={color} stroke={OL} strokeWidth="2.5" />
          <ellipse cx="190" cy="68" rx="11" ry="11" fill={color} stroke={OL} strokeWidth="2.5" />
          <ellipse cx="190" cy="68" rx="6" ry="6" fill="rgba(255,255,255,0.42)" />
          <path d="M 181 76 Q 174 92 172 102" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 199 76 Q 206 92 208 102" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 181 76 Q 174 92 172 102 M 199 76 Q 206 92 208 102"
            stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case 1: // Cat Ears
      return (
        <g>
          <path d="M 100 70 L 87 30 L 118 54 Z" fill={color} stroke={OL} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 100 68 L 91 40 L 114 57 Z" fill="rgba(255,175,195,0.7)" />
          <path d="M 200 70 L 213 30 L 182 54 Z" fill={color} stroke={OL} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 200 68 L 209 40 L 186 57 Z" fill="rgba(255,175,195,0.7)" />
        </g>
      );
    case 2: // Tiara
      return (
        <g>
          <path d="M 104 82 L 100 60 L 119 76 L 129 48 L 150 72 L 171 48 L 181 76 L 200 60 L 196 82 Z"
            fill={color} stroke={OL} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="150" cy="59" rx="8" ry="9" fill="#ff80b0" stroke={OL} strokeWidth="1.5" />
          <ellipse cx="129" cy="69" rx="6" ry="6" fill="#80c0ff" stroke={OL} strokeWidth="1.5" />
          <ellipse cx="171" cy="69" rx="6" ry="6" fill="#80ffb0" stroke={OL} strokeWidth="1.5" />
          <ellipse cx="152" cy="56" rx="3" ry="2.5" fill="rgba(255,255,255,0.68)" />
        </g>
      );
    case 3: // Flower Crown
      return (
        <g>
          <path d="M 96 78 Q 150 60 204 78" stroke="#66bb44" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 96 78 Q 150 60 204 78" stroke={OL} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {[
            { cx: 100, cy: 76, fc: '#ff9eb5' },
            { cx: 120, cy: 65, fc: '#ffcf77' },
            { cx: 140, cy: 59, fc: '#c8a8ff' },
            { cx: 160, cy: 59, fc: '#ff9eb5' },
            { cx: 180, cy: 65, fc: '#ffcf77' },
            { cx: 200, cy: 76, fc: '#c8a8ff' },
          ].map(({ cx, cy, fc }, i) => (
            <g key={i}>
              <ellipse cx={cx - 7} cy={cy} rx="5.5" ry="3.5" fill={fc} stroke={OL} strokeWidth="1.5" />
              <ellipse cx={cx + 7} cy={cy} rx="5.5" ry="3.5" fill={fc} stroke={OL} strokeWidth="1.5" />
              <ellipse cx={cx} cy={cy - 7} rx="3.5" ry="5.5" fill={fc} stroke={OL} strokeWidth="1.5" />
              <ellipse cx={cx} cy={cy + 7} rx="3.5" ry="5.5" fill={fc} stroke={OL} strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="4.5" fill="#ffdd55" stroke={OL} strokeWidth="1.5" />
            </g>
          ))}
        </g>
      );
    case 4: // Star Clips
      return (
        <g>
          <polygon points="108,82 110.5,90 118,90 112,95.5 114.5,104 108,99 101.5,104 104,95.5 98,90 105.5,90"
            fill={color} stroke={OL} strokeWidth="2" />
          <polygon points="192,82 194.5,90 202,90 196,95.5 198.5,104 192,99 185.5,104 188,95.5 182,90 189.5,90"
            fill={color} stroke={OL} strokeWidth="2" />
          <circle cx="119" cy="80" r="2.5" fill="rgba(255,230,100,0.95)" />
          <circle cx="96" cy="91" r="2" fill="rgba(255,230,100,0.95)" />
          <circle cx="203" cy="80" r="2.5" fill="rgba(255,230,100,0.95)" />
          <circle cx="181" cy="91" r="2" fill="rgba(255,230,100,0.95)" />
        </g>
      );
    default: return null;
  }
}

// ── MAIN CHARACTER ────────────────────────────────────────────────────────────
export default function Character({
  skinColor, hairColor, eyeColor,
  hairStyle, eyeShape,
  top, bottom, dress, accessory,
}) {
  const showDress = dress !== null;
  const topColor    = ['#6699cc','#ff9eb5','#e8d4f8','#99aacc','#ffcce0'][top]    ?? '#ff9eb5';
  const bottomColor = ['#c8a8e8','#88ccaa','#ffb7d5','#8899cc','#ffaa88'][bottom] ?? '#c8a8e8';
  const dressColor  = ['#ff88b8','#c8a8ff','#88ddaa','#ffc875','#88aaff'][dress]  ?? '#ff88b8';
  const accColor    = ['#ff80b0','#d4a8c8','#ffd700','#ffaa55','#ffdd44'][accessory] ?? '#ffd700';

  // Slightly spread-out arm positions to match the reference style
  const armL = "M 98 224 C 78 228 58 244 54 275 Q 52 295 64 298 C 78 304 98 278 108 240 Z";
  const armR = "M 202 224 C 222 228 242 244 246 275 Q 248 295 236 298 C 222 304 202 278 192 240 Z";
  // Hands with hint of fingers
  const handL = "M 58 296 Q 46 292 42 280 Q 44 270 50 268 Q 46 260 50 256 Q 55 254 58 260 Q 58 253 63 252 Q 68 252 68 259 Q 70 253 75 254 Q 80 256 78 263 Q 82 268 80 278 Q 78 292 68 300 Q 62 304 58 296 Z";
  const handR = "M 242 296 Q 254 292 258 280 Q 256 270 250 268 Q 254 260 250 256 Q 245 254 242 260 Q 242 253 237 252 Q 232 252 232 259 Q 230 253 225 254 Q 220 256 222 263 Q 218 268 220 278 Q 222 292 232 300 Q 238 304 242 296 Z";

  return (
    <svg viewBox="0 0 300 480" width="300" height="480" xmlns="http://www.w3.org/2000/svg">
      <g className="character-group">

        {/* ── Back hair ── */}
        <HairBack style={hairStyle} color={hairColor} />

        {/* ── Legs ── */}
        <path d="M 116 324 Q 140 328 145 442 Q 130 449 115 442 Z"
          fill={skinColor} stroke={OL} strokeWidth={OW} />
        <path d="M 184 324 Q 160 328 155 442 Q 170 449 185 442 Z"
          fill={skinColor} stroke={OL} strokeWidth={OW} />
        <ellipse cx="130" cy="445" rx="24" ry="12" fill={skinColor} stroke={OL} strokeWidth={OW} />
        <ellipse cx="170" cy="445" rx="24" ry="12" fill={skinColor} stroke={OL} strokeWidth={OW} />

        {/* ── Bottom clothing (no dress) ── */}
        {!showDress && bottom !== null && <Bottom index={bottom} color={bottomColor} />}

        {/* ── Torso ── */}
        <path d="M 100 222 C 88 256 88 312 106 324 C 120 332 180 332 194 324 C 212 312 212 256 200 222 C 185 213 168 210 150 210 C 132 210 115 213 100 222 Z"
          fill={skinColor} stroke={OL} strokeWidth={OW} />
        {/* Neck */}
        <path d="M 138 186 L 162 186 L 166 220 L 134 220 Z"
          fill={skinColor} stroke={OL} strokeWidth={OW} />

        {/* ── Dress / Top clothing (over torso) ── */}
        {showDress
          ? <Dress index={dress} color={dressColor} />
          : top !== null && <Top index={top} color={topColor} />
        }

        {/* ── Arms + hands ── */}
        <path d={armL} fill={skinColor} stroke={OL} strokeWidth={OW} />
        <path d={armR} fill={skinColor} stroke={OL} strokeWidth={OW} />
        <path d={handL} fill={skinColor} stroke={OL} strokeWidth={OW - 0.5} />
        <path d={handR} fill={skinColor} stroke={OL} strokeWidth={OW - 0.5} />

        {/* ── Head ── */}
        <ellipse cx="84" cy="114" rx="11" ry="17" fill={skinColor} stroke={OL} strokeWidth={OW} />
        <ellipse cx="216" cy="114" rx="11" ry="17" fill={skinColor} stroke={OL} strokeWidth={OW} />
        <ellipse cx="150" cy="110" rx="72" ry="82" fill={skinColor} stroke={OL} strokeWidth={OW} />

        {/* ── Face details ── */}
        {/* Heart blushes */}
        <HeartBlush cx={104} cy={148} size={13} rotate={-18} />
        <HeartBlush cx={196} cy={148} size={13} rotate={18} />
        {/* Freckles */}
        {[[142,152],[150,149],[158,152],[145,158],[155,158]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 1 ? 2.5 : 2} fill="#8B5E3C" opacity={i === 1 ? 0.55 : 0.45} />
        ))}

        {/* Eyes */}
        <Eyes shape={eyeShape} eyeColor={eyeColor} skinColor={skinColor} />

        {/* Eyebrows */}
        <path d="M 92 99 Q 110 91 126 99"
          stroke={hairColor} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 174 99 Q 190 91 208 99"
          stroke={hairColor} strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <circle cx="150" cy="150" r="2.5" fill="rgba(0,0,0,0.1)" />
        {/* Mouth */}
        <path d="M 140 162 Q 150 172 160 162"
          stroke="#cc7788" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* ── Front hair (over face) ── */}
        <HairFront style={hairStyle} color={hairColor} />

        {/* ── Accessory ── */}
        {accessory !== null && <Accessory index={accessory} color={accColor} />}

      </g>
    </svg>
  );
}
