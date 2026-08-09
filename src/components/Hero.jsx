import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from 'swiper/modules';
import { Phone, ShoppingBag } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: '/images/store1-hero.webp',
    fallback: '/images/store1-hero.jpg',
    title: 'Your Home for Quality Appliances',
    subtitle: 'Quality Refrigerators, TVs, Washing Machines, Microwaves and more.',
  },
  {
    id: 2,
    image: '/images/hero4.png',
    fallback: '/images/hero4.png',
    title: 'Premium Brands You Trust',
    subtitle: 'Experience top-tier electronics at unbeatable prices.',
  },
  // {
  //   id: 3,
  //   image: '/images/van-hero.webp',
  //   fallback: '/images/van-hero.jpg',
  //   title: 'Fast & Reliable Delivery',
  //   subtitle: 'Serving customers across Uganda and Kenya with care.',
  // },
];

const Hero = () => {
  // Preload remaining slides after first paint
  useEffect(() => {
    slides.slice(1).forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

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
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              <div
                className="hero-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                data-swiper-parallax="20%"
              >
                {index === 0 && (
                  <img
                    src={slide.image}
                    alt=""
                    className="hero-preload-img"
                    fetchPriority="high"
                    decoding="async"
                  />
                )}
              </div>
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
