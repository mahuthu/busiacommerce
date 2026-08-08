import React from 'react';
import { ShieldCheck, Tag, ThumbsUp, MapPin } from 'lucide-react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <ShieldCheck size={40} />,
      title: 'Warranty',
      description: 'All products come with official warranty for peace of mind.'
    },
    {
      id: 2,
      icon: <Tag size={40} />,
      title: 'Affordable',
      description: 'Competitive prices with the best value for your money.'
    },
    {
      id: 3,
      icon: <ThumbsUp size={40} />,
      title: 'Trusted Brands',
      description: 'We sell 100% original appliances from trusted global brands.'
    },
    {
      id: 4,
      icon: <MapPin size={40} />,
      title: 'Border Location',
      description: 'Conveniently located in Busia, serving both Uganda & Kenya.'
    }
  ];

  return (
    <section className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Experience the Busia Fridge World difference</p>
        </div>

        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
