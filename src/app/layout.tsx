import './styles/globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FacebookPixel from '../../components/FacebookPixel';
import Script from 'next/script';
import AnnouncementBar from '../../components/anouncement';
import SecurityBar from '../../components/SecurityBar';
import { Suspense } from 'react';
import Loading from './loading';
import { AuthProvider } from '../../lib/auth-context';
import { BrandProvider } from '../../lib/brand-context';
import type { Viewport } from 'next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'Atulya Medilink — Natural Cosmetics & Nutraceuticals',
  description: 'Atulya Medilink Pvt Ltd — Premium natural cosmetics and clinical-grade nutraceuticals. Dermatologist-tested, cruelty-free products. Delhi, India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = '1366996188303432';
  const gtagId = 'AW-17423083060';

  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Preconnect to CMS image server for faster hero image loading */}
        <link rel="preconnect" href="https://cms.atulyamedilinkpvtltd.shop" />
        <link rel="dns-prefetch" href="https://cms.atulyamedilinkpvtltd.shop" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body className={`overflow-x-hidden overflow-y-scroll antialiased font-sans`}>
        <ReactQueryProvider>
          <BrandProvider>
            <CartProvider>
              <AuthProvider>
                <div className="flex flex-col min-h-screen">
                  <SecurityBar />
                  <AnnouncementBar />
                  <Header />
                  <main className="flex-grow">
                    <Suspense fallback={<Loading />}>
                      {children}
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                <Suspense fallback={null}>
                  <FacebookPixel pixelId={fbPixelId} />
                </Suspense>
              </AuthProvider>
            </CartProvider>
          </BrandProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
