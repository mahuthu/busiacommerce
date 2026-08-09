import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="newsletter-section">
        <div className="container newsletter-inner">
          <div className="newsletter-text">
            <h3>Subscribe for Offers</h3>
            <p>Get updates on new products and exclusive offers.</p>
          </div>
          <div className="newsletter-form">
            <input type="text" placeholder="Enter your WhatsApp number" />
            <button className="btn btn-whatsapp">Subscribe on WhatsApp</button>
          </div>
        </div>
      </div>

      <div className="main-footer">
        <div className="container footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col">
            <div className="footer-logo">
              <img
                src="/images/busialogo.png"
                alt="Busia Fridge World"
                className="footer-logo-img"
              />
            </div>
            <p className="footer-desc">
              Your trusted destination for quality home appliances in Busia, Uganda. Serving customers from both Uganda and Kenya.
            </p>
            <div className="social-links-footer">
              <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="tel:+256758367662" aria-label="Call us"><Phone size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#categories">Shop by Category</a></li>
              <li><a href="#products">Brands</a></li>
              <li><a href="tel:+256758367662">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-col">
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li><a href="#products">Refrigerators</a></li>
              <li><a href="#products">Washing Machines</a></li>
              <li><a href="#products">Televisions</a></li>
              <li><a href="#products">Microwaves</a></li>
              <li><a href="#products">Irons</a></li>
              <li><a href="#products">Cookers</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-col">
            <h4 className="footer-title">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>Busia Uganda Customs Road after Equity Bank</span>
              </li>
              <li>
                <Clock size={18} />
                <span>Open: Mon - Sun<br/>8:00 AM - 8:00 PM</span>
              </li>
              <li>
                <Phone size={18} />
                <span>
                  WhatsApp Orders: <a href="https://wa.me/256774182151" className="whatsapp-link">+256 774 182 151</a><br />
                  Phone: <a href="tel:+256758367662">+256 758 367 662</a>
                  <br />
                  Phone: <a href="tel:+254742698581">+254 742 698 581</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bottom-footer">
        <div className="container bottom-footer-inner">
          <p>&copy; {new Date().getFullYear()} Busia Fridge World. All Rights Reserved.</p>
          <p>Designed by SavannahInc.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
