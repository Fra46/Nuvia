import React from 'react';

export default function CategoryHero({ eyebrow, title, subtitle, image }) {
  return (
    <section className="category-hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="category-hero__overlay" />
      <div className="category-hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
