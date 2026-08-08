import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Search, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import './Header.css';

const Header = ({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  favouritesCount = 0,
  showFavouritesOnly = false,
  onToggleFavouritesView,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit?.();
    setMobileMenuOpen(false);
  };

  const handleFavouritesClick = () => {
    onToggleFavouritesView?.();
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <div className="top-bar-item">
              <MapPin size={14} />
              <span>Busia Uganda Customs Road after Equity Bank</span>
            </div>
            <div className="top-bar-item">
              <Clock size={14} />
              <span>Open Mon-Sun</span>
            </div>
          </div>
          <div className="top-bar-right">
            <div className="top-bar-item">
              <Phone size={14} />
              <span>WhatsApp: +256 774 182 151 | +254 742 698 581</span>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="main-nav">
        <div className="container main-nav-inner">
          {/* Logo */}
          <a href="/" className="logo">
            <img
              src="/images/busialogo.png"
              alt="Busia Fridge World"
              className="logo-img"
            />
          </a>

          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSubmit} role="search">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search for appliances..."
              aria-label="Search for appliances"
            />
            <button type="submit" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          {/* Actions */}
          <div className="nav-actions">
            <button
              type="button"
              className={`action-icon ${showFavouritesOnly ? 'active' : ''}`}
              onClick={handleFavouritesClick}
              aria-label={showFavouritesOnly ? 'Show all products' : 'View favourites'}
              aria-pressed={showFavouritesOnly}
            >
              <Heart size={24} fill={showFavouritesOnly ? 'currentColor' : 'none'} />
              {favouritesCount > 0 && (
                <span className="cart-badge">{favouritesCount}</span>
              )}
            </button>
            <a href="#products" className="action-icon hide-mobile" aria-label="Browse products">
              <ShoppingCart size={24} />
            </a>
            <a href="https://wa.me/256774182151" className="btn btn-whatsapp hide-mobile">
              <Phone size={18} />
              <span>Chat on WhatsApp</span>
            </a>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <a href="/" className="active" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a>
          <a href="#products" onClick={() => { handleFavouritesClick(); }}>Favourites ({favouritesCount})</a>
          <a href="https://wa.me/256774182151" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
        <a href="https://wa.me/256774182151" className="btn btn-whatsapp mobile-whatsapp-btn">
          <Phone size={18} />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
