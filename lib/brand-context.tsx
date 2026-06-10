'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandMode = 'cosmetics' | 'nutraceuticals' | 'ayurveda';

export interface BrandTheme {
  primary: string;
  primaryDark: string;
  primaryRgb: string;
  bgLight: string;
  bgAlt: string;
  border: string;
  mode: BrandMode;
  label: string;
  heroGrad: string;
}

export const BRAND_THEMES: Record<BrandMode, BrandTheme> = {
  cosmetics: {
    primary: '#ff5f1f',
    primaryDark: '#e04e10',
    primaryRgb: '255,95,31',
    bgLight: '#fff8f5',
    bgAlt: '#fff3ed',
    border: '#ffddd0',
    mode: 'cosmetics',
    label: 'Cosmetics',
    heroGrad: 'linear-gradient(135deg, #ff5f1f 0%, #ff8a5b 60%, #ffb899 100%)',
  },
  nutraceuticals: {
    primary: '#0d9488',
    primaryDark: '#0a7a6e',
    primaryRgb: '13,148,136',
    bgLight: '#f0fdfa',
    bgAlt: '#ccfbf1',
    border: '#99f6e4',
    mode: 'nutraceuticals',
    label: 'Nutraceuticals',
    heroGrad: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #5eead4 100%)',
  },
  ayurveda: {
    primary: '#00ff00',
    primaryDark: '#00cc00',
    primaryRgb: '0,255,0',
    bgLight: '#f0fff0',
    bgAlt: '#ccffcc',
    border: '#99ff99',
    mode: 'ayurveda',
    label: 'Ayurveda',
    heroGrad: 'linear-gradient(135deg, #00ff00 0%, #33ff33 60%, #99ff99 100%)',
  },
};

interface BrandCtx {
  mode: BrandMode;
  setMode: (m: BrandMode) => void;
  theme: BrandTheme;
}

const BrandContext = createContext<BrandCtx>({
  mode: 'cosmetics',
  setMode: () => {},
  theme: BRAND_THEMES.cosmetics,
});

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<BrandMode>('cosmetics');

  useEffect(() => {
    try {
      const s = localStorage.getItem('atulya-brand') as BrandMode;
      if (s === 'cosmetics' || s === 'nutraceuticals' || s === 'ayurveda') setModeState(s);
    } catch {}
  }, []);

  function setMode(m: BrandMode) {
    setModeState(m);
    try { localStorage.setItem('atulya-brand', m); } catch {}
  }

  return (
    <BrandContext.Provider value={{ mode, setMode, theme: BRAND_THEMES[mode] }}>
      {children}
    </BrandContext.Provider>
  );
}

export const useBrand = () => useContext(BrandContext);
