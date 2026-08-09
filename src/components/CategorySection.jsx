import React, { useMemo } from 'react';
import categoryIcons from '../data/categoryIcons.json';
import './CategorySection.css';

const CATEGORY_ORDER = [
  'Refrigerators',
  'Freezers',
  'Washing Machines',
  'Televisions',
  'Cookers',
  'Microwaves & Ovens',
  'Irons',
  'Blenders & Mixers',
  'Air Conditioners',
  'Kitchen Appliances',
  'Water Dispensers',
  'Fans',
  'Juice Dispensers',
];

const CategorySection = ({ products = [], activeCategory = 'All', onSelectCategory }) => {
  const categories = useMemo(() => {
    return CATEGORY_ORDER
      .map((name) => {
        const items = products.filter((p) => p.category === name);
        const iconFromProduct = items.find((p) => p.image)?.image;
        return {
          name,
          count: items.length,
          icon: categoryIcons[name] || iconFromProduct || '/images/product_display.png',
        };
      })
      .filter((category) => category.count > 0);
  }, [products]);

  return (
    <section className="section bg-white" id="categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
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
