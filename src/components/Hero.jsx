import React, { useState, useEffect } from 'react';
import { Phone, ShoppingBag, Star, Truck, Shield, Zap, ArrowRight } from 'lucide-react';
import './Hero.css';

const showcaseImages = [
  { src: '/images/hero5-og.jpg',    label: 'Refrigerators' },
  { src: '/images/hero4-hero.jpg',  label: 'Electronics'   },
  { src: '/images/store1-hero.jpg', label: 'Our Store'      },
];

const Hero = () => {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActiveImg(p => (p + 1) % showcaseImages.length),
      4000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero-section">
      {/* ── Background layers ── */}
      <div className="hero-bg-grid"   aria-hidden="true" />
      <div className="hero-bg-radial" aria-hidden="true" />
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />
      <div className="hero-blob hero-blob--3" aria-hidden="true" />

      <div className="hero-inner">

        {/* ══ LEFT — Text content ══ */}
        <div className="hero-left">

          {/* Badge */}
          <div className="hero-badge">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>Uganda &amp; Kenya's #1 Appliance Store</span>
          </div>

          {/* Headline */}
          <h1 className="hero-heading">
            <span className="hero-line">Your Home for</span>
            <span className="hero-line hero-line--accent">Quality Appliances</span>
            <span className="hero-line">Delivered to You</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Premium refrigerators, TVs, washing machines &amp; more — at unbeatable prices.
            Serving Busia and beyond, every day of the week.
          </p>

          {/* Trust chips */}
          <div className="hero-chips">
            <div className="hero-chip"><Truck  size={14} /><span>Fast Delivery</span></div>
            <div className="hero-chip"><Shield size={14} /><span>Warranty Assured</span></div>
            <div className="hero-chip"><Zap    size={14} /><span>Top Brands</span></div>
          </div>

          {/* CTAs */}
          <div className="hero-cta-group">
            <a href="#products" className="hero-btn hero-btn--primary">
              <ShoppingBag size={19} />
              <span>Browse Products</span>
            </a>
            <a href="https://wa.me/256774182151" className="hero-btn hero-btn--ghost">
              <Phone size={18} />
              <span>Chat on WhatsApp</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* ══ RIGHT — Image + floating cards ══ */}
        <div className="hero-right">

          {/* Main cycling image */}
          <div className="hero-img-wrap">
            {showcaseImages.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.label}
                className={`hero-img ${i === activeImg ? 'hero-img--active' : ''}`}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
              />
            ))}

            {/* Category label */}
            <div className="hero-img-label">{showcaseImages[activeImg].label}</div>

            {/* Dot nav */}
            <div className="hero-img-dots">
              {showcaseImages.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot ${i === activeImg ? 'hero-dot--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View ${showcaseImages[i].label}`}
                />
              ))}
            </div>
          </div>

          {/* Float card — delivery */}
          <div className="hero-float-card hero-float-card--delivery">
            <div className="hero-float-icon-wrap"><Truck size={20} /></div>
            <div>
              <div className="hero-float-title">Free Delivery</div>
              <div className="hero-float-sub">Busia &amp; surroundings</div>
            </div>
          </div>

          {/* Float card — rating */}
          <div className="hero-float-card hero-float-card--rating">
            <div className="hero-float-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#f59e0b" stroke="none" />
              ))}
            </div>
            <div className="hero-float-title">4.9 / 5</div>
            <div className="hero-float-sub">500+ happy customers</div>
          </div>

          {/* Float card — open */}
          <div className="hero-float-card hero-float-card--open">
            <div className="hero-float-dot" />
            <div>
              <div className="hero-float-title">Open Today</div>
              <div className="hero-float-sub">Mon – Sun</div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,30 C480,70 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--wave-fill,#f8fafc)" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
