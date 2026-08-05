'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBrand } from '../lib/brand-context';

/**
 * Probes a list of candidate banner URLs and returns only the ones that
 * actually load (in order). Falls back to `fallbacks` if none exist yet.
 * Runs client-side only; SSR renders `fallbacks` so the banner is never blank.
 */
export function useValidBanners(candidates: string[], fallbacks: string[]): string[] {
  const [valid, setValid] = useState<string[]>(fallbacks);

  const key = candidates.join('|');
  useEffect(() => {
    let cancelled = false;
    const results: (string | null)[] = new Array(candidates.length).fill(null);
    let remaining = candidates.length;

    if (remaining === 0) {
      setValid(fallbacks);
      return;
    }

    const finish = () => {
      if (cancelled) return;
      remaining -= 1;
      if (remaining === 0) {
        const list = results.filter((u): u is string => !!u);
        setValid(list.length ? list : fallbacks);
      }
    };

    candidates.forEach((url, i) => {
      const img = new window.Image();
      img.onload = () => { results[i] = url; finish(); };
      img.onerror = () => { finish(); };
      img.src = url;
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return valid;
}

/**
 * A rotating banner carousel (1920×700, never cropped). Shows arrows + dots
 * only when there is more than one image. Auto-advances every 4s.
 */
export default function BannerCarousel({ images, alt = '' }: { images: string[]; alt?: string }) {
  const { theme } = useBrand();
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => { setCurrent(0); }, [images.length]);

  useEffect(() => {
    if (!auto || images.length < 2) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [auto, images.length]);

  if (images.length === 0) return null;

  const go = (i: number) => {
    setCurrent((i + images.length) % images.length);
    setAuto(false);
  };

  return (
    <div className="w-full relative overflow-hidden bg-gray-50">
      <div className="banner-carousel-inner w-full relative overflow-hidden">
        <div
          className="flex h-full"
          style={{ transform: `translateX(-${current * 100}%)`, transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}
        >
          {images.map((src, i) => (
            <div key={src + i} className="w-full h-full flex-shrink-0 relative">
              <img
                src={src}
                alt={alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-contain object-center bg-gray-50"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(current - 1)}
              aria-label="Previous"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white border border-gray-200 text-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => go(current + 1)}
              aria-label="Next"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white border border-gray-200 text-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg"
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>

            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="rounded-full cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none"
                  style={{
                    width: i === current ? 28 : 10,
                    height: 10,
                    background: i === current ? theme.primary : '#d1d5db',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`
        .banner-carousel-inner { aspect-ratio: 1920/700; min-height: unset; }
      `}</style>
    </div>
  );
}
