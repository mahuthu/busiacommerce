import React from 'react';
import './TopBrands.css';

const TopBrands = () => {
  const brands = [
    { name: 'Hiscence', logo: '/images/hiscence1.png' },
    { name: 'Mika', logo: '/images/mika.png' },
    { name: 'Phillips', logo: '/images/phillips.png' },
    { name: 'LG', logo: '/images/lg.png' },
    { name: 'Roch', logo: '/images/roch.png' },
    { name: 'Sayonna', logo: '/images/sayonna.jpeg' },
    { name: 'SPJ', logo: '/images/spj.png' },
    { name: 'Geepas', logo: '/images/geepas.png' }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top Brands</h2>
        </div>
        
        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.name} className="brand-logo-container">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="brand-logo-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
