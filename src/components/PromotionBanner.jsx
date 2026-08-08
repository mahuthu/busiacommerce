import React from 'react';
import './PromotionBanner.css';

const PromotionBanner = () => {
  return (
    <section className="section banner-section">
      <div className="container">
        <div className="promotion-banner">
          <div className="banner-content">
            <span className="banner-tag">Limited Time Offer</span>
            <h2 className="banner-title">Weekend Mega Sale</h2>
            <p className="banner-subtitle">Up to 25% OFF on selected refrigerators and washing machines.</p>
            <a href="#products" className="btn btn-white banner-btn">
              Shop Now
            </a>
          </div>
          <div className="banner-image-container">
            <img 
              src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=60" 
              alt="Mega Sale Refrigerator" 
              className="banner-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
