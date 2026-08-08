import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({
  products = [],
  loading = false,
  activeCategory,
  onSelectCategory,
  searchQuery = '',
  favourites = [],
  showFavouritesOnly = false,
  onToggleFavourite,
  onClearSearch,
  onShowAll,
}) => {
  const favouriteSet = useMemo(() => new Set(favourites), [favourites]);
  const query = searchQuery.trim().toLowerCase();

  const categories = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (showFavouritesOnly && !favouriteSet.has(product.id)) return false;
      if (activeCategory !== 'All' && product.category !== activeCategory) return false;
      if (!query) return true;

      const haystack = `${product.name} ${product.brand} ${product.category} ${product.sku || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [products, activeCategory, query, showFavouritesOnly, favouriteSet]);

  const emptyMessage = loading
    ? 'Loading products…'
    : showFavouritesOnly
      ? favourites.length === 0
        ? 'No favourites yet. Tap the heart on any product to save it.'
        : 'No favourites match your filters.'
      : query
        ? `No products match “${searchQuery.trim()}”.`
        : 'No products in this category yet.';

  return (
    <section className="section bg-light" id="products">
      <div className="container">
        <div className="section-header animate-fade-in">
          <h2 className="section-title">
            {showFavouritesOnly ? 'Your Favourites' : 'Our Products'}
          </h2>
          <p className="section-subtitle">
            {loading
              ? 'Fetching the latest catalogue…'
              : showFavouritesOnly
                ? `${favourites.length} saved appliance${favourites.length === 1 ? '' : 's'}`
                : query
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for “${searchQuery.trim()}”`
                  : 'Browse appliances in stock at Busia Fridge World — prices in UGX'}
          </p>
          {(query || showFavouritesOnly) && (
            <button type="button" className="products-clear-btn" onClick={onShowAll}>
              Show all products
            </button>
          )}
        </div>

        {!showFavouritesOnly && (
          <div className="product-filters">
            <button
              type="button"
              className={`filter-chip ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => onSelectCategory('All')}
            >
              All ({products.length})
            </button>
            {categories.map(({ name, count }) => (
              <button
                key={name}
                type="button"
                className={`filter-chip ${activeCategory === name ? 'active' : ''}`}
                onClick={() => onSelectCategory(name)}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        )}

        {query && !showFavouritesOnly && (
          <div className="search-active-bar">
            <span>Searching: <strong>{searchQuery.trim()}</strong></span>
            <button type="button" onClick={onClearSearch}>Clear search</button>
          </div>
        )}

        <div className="product-grid animate-fade-in">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavourite={favouriteSet.has(product.id)}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>

        {(loading || filtered.length === 0) && (
          <p className="products-empty">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
