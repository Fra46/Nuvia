import React from 'react';

export default function CategoryHero({ eyebrow, title, subtitle, image }) {
  return (
    <section className="hero">
      <div className="hero-media">
        <img src={image} alt="" />
      </div>
      <div className="hero-overlay" />
      <div
        className="container-xl position-relative d-flex flex-column justify-content-end"
        style={{ minHeight: '46vh', paddingTop: '7rem', paddingBottom: '3rem' }}
      >
        <p className="text-uppercase-xs text-amber mb-1">{eyebrow}</p>
        <h1
          className="font-heading fw-semibold text-white lh-1"
          style={{ maxWidth: '40rem', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
        >
          {title}
        </h1>
        <p className="fs-5 text-white-50 mt-3 mb-0" style={{ maxWidth: '34rem', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
