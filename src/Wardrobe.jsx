import React from 'react';
import { HAIR_STYLES, EYE_SHAPES, TOPS, BOTTOMS, DRESSES, ACCESSORIES } from './data.js';

function ItemRow({ label, items, selected, onSelect, allowNone = false }) {
  return (
    <div className="wardrobe-section">
      <h3>{label}</h3>
      <div className="item-grid">
        {allowNone && (
          <button
            className={`item-btn none-btn ${selected === null ? 'selected' : ''}`}
            onClick={() => onSelect(null)}
            title="None"
          >
            ✕
          </button>
        )}
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

export default function Wardrobe({ outfit, onOutfitChange, hairStyle, eyeShape, onHairChange, onEyeChange }) {
  return (
    <div className="wardrobe-panel">
      <ItemRow
        label="Hair Style"
        items={HAIR_STYLES}
        selected={hairStyle}
        onSelect={onHairChange}
      />
      <ItemRow
        label="Eye Shape"
        items={EYE_SHAPES}
        selected={eyeShape}
        onSelect={onEyeChange}
      />
      <ItemRow
        label="Tops"
        items={TOPS}
        selected={outfit.top}
        onSelect={v => onOutfitChange({ top: v })}
        allowNone
      />
      <ItemRow
        label="Bottoms"
        items={BOTTOMS}
        selected={outfit.bottom}
        onSelect={v => onOutfitChange({ bottom: v })}
        allowNone
      />
      <ItemRow
        label="Dresses"
        items={DRESSES}
        selected={outfit.dress}
        onSelect={v => onOutfitChange({ dress: v })}
        allowNone
      />
      <ItemRow
        label="Accessories"
        items={ACCESSORIES}
        selected={outfit.accessory}
        onSelect={v => onOutfitChange({ accessory: v })}
        allowNone
      />
    </div>
  );
}
