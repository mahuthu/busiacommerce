import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: 'John K.',
      rating: 5,
      text: 'Good customer service and genuine products. I bought a fridge and it is working perfectly.',
      initial: 'J',
      color: '#8B5CF6'
    },
    {
      id: 2,
      name: 'Aisha N.',
      rating: 5,
      text: 'Affordable prices compared to other shops. Highly recommend!',
      initial: 'A',
      color: '#10B981'
    },
    {
      id: 3,
      name: 'Mike O.',
      rating: 5,
      text: 'Wide range of appliances. I found exactly what I needed.',
      initial: 'M',
      color: '#3B82F6'
    }
  ];

  return (
    <section className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="google-rating">
            <div className="stars">
              {'★★★★★'.split('').map((star, i) => <span key={i} className="star-icon">{star}</span>)}
            </div>
            <span className="rating-score">5.0</span>
            <span className="rating-text">Google reviews</span>
          </div>
        </div>

        <div className="testimonials-grid">
          {reviews.map(review => (
            <div key={review.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="customer-avatar" style={{ backgroundColor: review.color }}>
                  {review.initial}
                </div>
                <div className="customer-info">
                  <h4 className="customer-name">{review.name}</h4>
                  <div className="stars small">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="star-icon">{star}</span>)}
                  </div>
                </div>
                <div className="google-icon">G</div>
              </div>
              <p className="testimonial-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
