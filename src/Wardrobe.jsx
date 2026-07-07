import {
  EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK, BUNS,
  SHIRTS, PANTS, SOCKS, SHOES,
  NECKLACES, BRACELETS, EARRINGS, HATS,
} from './data.js';

function Section({ label, items, selected, onSelect }) {
  return (
    <div className="wardrobe-section">
      <h3>{label}</h3>
      <div className="item-grid">
        <button
          className={`item-btn none-btn ${selected === null ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
          title="None"
        >✕</button>
        {items.map(item => (
          <button
            key={item.id}
            className={`item-btn ${selected === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}
            title={item.name}
          >
            <span className="item-emoji">{item.emoji}</span>
            <span className="item-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SocksSection({ selected, onSelect, socksOver, onSocksOver }) {
  return (
    <div className="wardrobe-section">
      <h3>Socks</h3>
      <div className="sock-toggle-row">
        <button
          className={`sock-pos-btn ${!socksOver ? 'selected' : ''}`}
          onClick={() => onSocksOver(false)}
        >Under shoe</button>
        <button
          className={`sock-pos-btn ${socksOver ? 'selected' : ''}`}
          onClick={() => onSocksOver(true)}
        >Over shoe</button>
      </div>
      <div className="item-grid">
        <button
          className={`item-btn none-btn ${selected === null ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
          title="None"
        >✕</button>
        {SOCKS.map(item => (
          <button
            key={item.id}
            className={`item-btn ${selected === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}
            title={item.name}
          >
            <span className="item-emoji">{item.emoji}</span>
            <span className="item-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Wardrobe({
  eyes,     onEyes,
  eyebrows, onEyebrows,
  mouth,    onMouth,
  nose,     onNose,
  bangs,    onBangs,
  hairBack, onHairBack,
  buns,     onBuns,
  shirt,    onShirt,
  pant,     onPant,
  sock,     onSock,     socksOver, onSocksOver,
  shoe,     onShoe,
  necklace, onNecklace,
  bracelet, onBracelet,
  earring,  onEarring,
  hat,      onHat,
}) {
  return (
    <div className="wardrobe-panel">
      <Section label="Eyes"      items={EYES}      selected={eyes}     onSelect={onEyes}     />
      <Section label="Eyebrows"  items={EYEBROWS}  selected={eyebrows} onSelect={onEyebrows} />
      <Section label="Nose"      items={NOSE}       selected={nose}     onSelect={onNose}     />
      <Section label="Mouth"     items={MOUTH}     selected={mouth}    onSelect={onMouth}    />
      <Section label="Bangs"     items={BANGS}     selected={bangs}    onSelect={onBangs}    />
      <Section label="Buns"      items={BUNS}      selected={buns}     onSelect={onBuns}     />
      <Section label="Hair Back" items={HAIR_BACK} selected={hairBack} onSelect={onHairBack} />
      <Section label="Hat"       items={HATS}      selected={hat}      onSelect={onHat}      />
      <Section label="Earrings"  items={EARRINGS}  selected={earring}  onSelect={onEarring}  />
      <Section label="Necklace"  items={NECKLACES} selected={necklace} onSelect={onNecklace} />
      <Section label="Bracelet"  items={BRACELETS} selected={bracelet} onSelect={onBracelet} />
      <Section label="Tops"      items={SHIRTS}    selected={shirt}    onSelect={onShirt}    />
      <Section label="Bottoms"   items={PANTS}     selected={pant}     onSelect={onPant}     />
      <SocksSection
        selected={sock}     onSelect={onSock}
        socksOver={socksOver} onSocksOver={onSocksOver}
      />
      <Section label="Shoes"     items={SHOES}     selected={shoe}     onSelect={onShoe}     />
    </div>
  );
}
