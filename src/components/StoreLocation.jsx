import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import './StoreLocation.css';

const StoreLocation = () => {
  return (
    <section className="location-section" id="location">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Visit Our Store</h2>
          <p className="section-subtitle">Find us in the heart of Busia, serving Uganda and Kenya</p>
        </div>

        <div className="location-grid">
          {/* Map iframe */}
          <div className="location-map-card">
            <iframe
              src="https://maps.google.com/maps?q=Busia+Fridge+World&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Busia Fridge World Location Map"
            ></iframe>
          </div>

          {/* Store Info */}
          <div className="location-info-card">
            <h3 className="location-info-title">Busia Fridge World</h3>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon-wrap">
                  <MapPin size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Address</span>
                  <span className="info-value">Customs Road after Equity Bank<br />Busia, Uganda</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrap">
                  <Clock size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Opening Hours</span>
                  <span className="info-value">Monday - Sunday<br />8:00 AM - 8:00 PM</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrap">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Contact</span>
                  <span className="info-value">+256 774 182 151 (UG)<br />+254 742 698 581 (KE)</span>
                </div>
              </div>
            </div>

            <div className="location-actions">
              <a
                href="https://maps.app.goo.gl/3iNfESeEWbyjwepv6"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-full"
              >
                <Navigation size={18} />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
