"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBrand, BrandMode } from '../lib/brand-context';

const IMAGES_BY_MODE: Record<BrandMode, { src: string; alt: string }[]> = {
  cosmetics: [
    {
      src: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/gLUTATHIONE-rICE-WATER-FACE-WASH.jpg.jpeg',
      alt: 'Atulya Cosmetics — Premium Beauty',
    },
  ],
  nutraceuticals: [
    {
      src: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/Shop-Website-1920X700.jpg-1-scaled.jpeg',
      alt: 'Atulya Nutraceuticals — Health & Wellness',
    },
  ],
  ayurveda: [
    {
      src: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/Shop-Website-1920X700-Shilajit.jpg-2-scaled.jpeg',
      alt: 'Atulya Ayurveda — Herbal Formulations',
    },
  ],
};

export default function HeroCarousel() {
  const { theme, mode } = useBrand();
  const images = IMAGES_BY_MODE[mode];
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // Increments on every mode change — used as key to trigger fade animation
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setCurrent(0);
    setIsAutoPlaying(true);
    setFadeKey(k => k + 1);
  }, [mode]);

  useEffect(() => {
    if (!isAutoPlaying || images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  return (
    <>
      <div className="w-full relative overflow-hidden bg-gray-50">
        <div className="hero-carousel-inner w-full relative overflow-hidden">

          {/* Slides — key changes on mode switch to trigger fade-in animation */}
          <div
            key={fadeKey}
            className="flex h-full carousel-fade-in"
            style={{ transform: `translateX(-${current * 100}%)`, transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-contain sm:object-cover object-center bg-gray-50"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Prev / Next buttons — only show when multiple slides */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40
                  bg-white/90 hover:bg-white border border-gray-200 text-gray-700
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
                  flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Previous"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40
                  bg-white/90 hover:bg-white border border-gray-200 text-gray-700
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
                  flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Next"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          {/* Dots — only when multiple slides */}
          {images.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30
              flex gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className="rounded-full cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none"
                  style={{
                    width: index === current ? 28 : 10,
                    height: 10,
                    background: index === current ? theme.primary : '#d1d5db',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes carouselFadeIn {
          from { opacity: 0; transform: translateX(0) scale(1.04); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .carousel-fade-in {
          animation: carouselFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hero-carousel-inner {
          aspect-ratio: 16/5;
          min-height: 200px;
        }
        @media (max-width: 639px) {
          .hero-carousel-inner {
            aspect-ratio: 1920/700;
            min-height: unset;
          }
        }
      `}</style>
    </>
  );
}
