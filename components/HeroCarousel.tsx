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

  // Reset to first slide when mode changes
  useEffect(() => {
    setCurrent(0);
    setIsAutoPlaying(true);
  }, [mode]);

  useEffect(() => {
    if (!isAutoPlaying) return;
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

          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-300"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Prev button */}
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

          {/* Next button */}
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

          {/* Dots */}
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
        </div>
      </div>

      <style>{`
        .hero-carousel-inner {
          aspect-ratio: 16/5;
          min-height: 200px;
        }
        @media (max-width: 767px) {
          .hero-carousel-inner {
            aspect-ratio: 4/3;
            min-height: 220px;
          }
        }
        @media (max-width: 480px) {
          .hero-carousel-inner {
            aspect-ratio: unset;
            height: 240px;
            min-height: unset;
          }
        }
      `}</style>
    </>
  );
}
