import React, { useMemo } from 'react';
import categoryIcons from '../data/categoryIcons.json';
import './CategorySection.css';



const CategorySection = ({ products = [], categories = [], activeCategory = 'All', onSelectCategory }) => {
  const displayCategories = useMemo(() => {
    // If categories prop is empty (e.g. still loading), we can fallback to extracting from products
    const catList = categories.length > 0 
      ? categories 
      : Array.from(new Set(products.map(p => p.category))).map(name => ({ name }));

    return catList.map((cat) => {
      const items = products.filter((p) => p.category === cat.name);
      const iconFromProduct = items.find((p) => p.image)?.image;
      return {
        name: cat.name,
        count: items.length,
        icon: cat.image || categoryIcons[cat.name] || iconFromProduct || '/images/product_display.png',
      };
    });
  }, [products, categories]);

  return (
    <section className="section bg-white" id="categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>

        <div className="category-grid">
          {displayCategories.map((category) => (
            <button
              type="button"
              key={category.name}
              className={`category-card ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => onSelectCategory?.(category.name)}
            >
              <div className="category-icon-container">
                <img
                  src={category.icon}
                  alt={`${category.name} appliances`}
                  className="category-icon"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="category-name">{category.name}</h3>
              <span className="category-count">{category.count} items</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
