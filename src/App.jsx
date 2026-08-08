import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import ProductGrid from './components/ProductGrid';
import PromotionBanner from './components/PromotionBanner';
import WhyChooseUs from './components/WhyChooseUs';
import TopBrands from './components/TopBrands';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { listProducts } from './lib/productsApi';

const FAVOURITES_KEY = 'bfw-favourites';

const loadFavourites = () => {
  try {
    const stored = localStorage.getItem(FAVOURITES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function App() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState(loadFavourites);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setProductsError(err.message || 'Failed to load products');
      } finally {
        if (mounted) setProductsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const scrollToProducts = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setShowFavouritesOnly(false);
    scrollToProducts();
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      setShowFavouritesOnly(false);
    }
  };

  const handleSearchSubmit = () => {
    setShowFavouritesOnly(false);
    scrollToProducts();
  };

  const handleToggleFavourite = (productId) => {
    setFavourites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleFavouritesView = () => {
    setShowFavouritesOnly((prev) => {
      const next = !prev;
      if (next) {
        setActiveCategory('All');
        setSearchQuery('');
        scrollToProducts();
      }
      return next;
    });
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        favouritesCount={favourites.length}
        showFavouritesOnly={showFavouritesOnly}
        onToggleFavouritesView={handleToggleFavouritesView}
      />
      <main>
        <Hero />
        <CategorySection
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
        {productsError && (
          <div className="container" style={{ paddingTop: 20, color: '#b91c1c' }}>
            {productsError}
          </div>
        )}
        <ProductGrid
          products={products}
          loading={productsLoading}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          favourites={favourites}
          showFavouritesOnly={showFavouritesOnly}
          onToggleFavourite={handleToggleFavourite}
          onClearSearch={() => setSearchQuery('')}
          onShowAll={() => {
            setShowFavouritesOnly(false);
            setActiveCategory('All');
            setSearchQuery('');
          }}
        />
        <PromotionBanner />
        <WhyChooseUs />
        <TopBrands />
        <Testimonials />
      </main>
      <Footer />

      <a href="https://wa.me/256774182151" className="floating-whatsapp" aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </a>

      <style dangerouslySetInnerHTML={{__html: `
        .floating-whatsapp {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: var(--whatsapp-green);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
          z-index: 1000;
          transition: transform 0.3s;
        }
        .floating-whatsapp:hover {
          transform: scale(1.1);
        }
        @media (min-width: 993px) {
          .floating-whatsapp {
            display: none;
          }
        }
      `}} />
    </div>
  );
}

export default App;
