import { EYES, EYEBROWS, MOUTH, NOSE, BANGS, HAIR_BACK } from './data.js';

function Section({ label, items, selected, onSelect }) {
  return (
    <div className="wardrobe-section">
      <h3>{label}</h3>
      <div className="item-grid">
        <button
          className={`item-btn none-btn ${selected === null ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
          title="None"
        >
          ✕
        </button>
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

export default function Wardrobe({
  eyes,     onEyes,
  eyebrows, onEyebrows,
  mouth,    onMouth,
  nose,     onNose,
  bangs,    onBangs,
  hairBack, onHairBack,
}) {
  return (
    <div className="wardrobe-panel">
      <Section label="Eyes"      items={EYES}      selected={eyes}     onSelect={onEyes}     />
      <Section label="Eyebrows"  items={EYEBROWS}  selected={eyebrows} onSelect={onEyebrows} />
      <Section label="Nose"      items={NOSE}      selected={nose}     onSelect={onNose}     />
      <Section label="Mouth"     items={MOUTH}     selected={mouth}    onSelect={onMouth}    />
      <Section label="Bangs"     items={BANGS}     selected={bangs}    onSelect={onBangs}    />
      <Section label="Hair Back" items={HAIR_BACK} selected={hairBack} onSelect={onHairBack} />
    </div>
  );
}
