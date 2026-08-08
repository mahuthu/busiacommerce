import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from 'swiper/modules';
import { Phone, ShoppingBag } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = () => {
  const slides = [
    {
      id: 1,
      image: '/images/store1.png',
      title: 'Your Home for Quality Appliances',
      subtitle: 'Quality Refrigerators, TVs, Washing Machines, Microwaves and more.',
    },
    {
      id: 2,
      image: '/images/store2.png',
      title: 'Premium Brands You Trust',
      subtitle: 'Experience top-tier electronics at unbeatable prices.',
    },
    {
      id: 3,
      image: '/images/van.png',
      title: 'Fast & Reliable Delivery',
      subtitle: 'Serving customers across Uganda and Kenya with care.',
    }
  ];

  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination, Parallax]}
        effect="fade"
        speed={1000}
        parallax={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              <div
                className="hero-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                data-swiper-parallax="20%"
              ></div>
              <div className="hero-overlay"></div>

              <div className="container hero-content">
                <div className="hero-text-container" data-swiper-parallax="-300">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>

                  <div className="hero-buttons">
                    <a href="#products" className="btn btn-primary">
                      <ShoppingBag size={20} />
                      <span>Browse Products</span>
                    </a>
                    <a href="https://wa.me/256774182151" className="btn btn-whatsapp">
                      <Phone size={20} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
