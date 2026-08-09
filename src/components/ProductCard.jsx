import React from 'react';
import { Heart, Phone } from 'lucide-react';
import './ProductCard.css';

const formatPrice = (price) => {
  return `UGX ${price.toLocaleString()}`;
};

const ProductCard = ({ product, isFavourite = false, onToggleFavourite }) => {
  return (
    <div className="product-card">
      {/* Top Badges */}
      <div className="product-badges">
        {product.isNew && <span className="badge badge-new">NEW</span>}
        {product.discount > 0 && <span className="badge badge-sale">SALE</span>}
      </div>

      <button
        type="button"
        className={`favorite-btn ${isFavourite ? 'active' : ''}`}
        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        aria-pressed={isFavourite}
        onClick={() => onToggleFavourite?.(product.id)}
      >
        <Heart size={20} fill={isFavourite ? 'currentColor' : 'none'} />
      </button>

      <div className="product-image-container">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="product-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-price-container">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="product-old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <a 
          href={`https://wa.me/256774182151?text=I'm interested in the ${product.name} (${product.brand}) for ${formatPrice(product.price)}.`} 
          className="btn btn-whatsapp product-btn"
        >
          <Phone size={16} />
          <span>Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
