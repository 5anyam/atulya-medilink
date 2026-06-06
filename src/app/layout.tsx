import './styles/globals.css';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FacebookPixel from '../../components/FacebookPixel';
import Script from 'next/script';
import AnnouncementBar from '../../components/anouncement';
import SecurityBar from '../../components/SecurityBar';
import { Suspense } from 'react';
import LeadCapture from '../../components/LeadCapture';
import Loading from './loading';
import { AuthProvider } from '../../lib/auth-context';
import { BrandProvider } from '../../lib/brand-context';
import type { Viewport } from 'next';

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
  const fbPixelId = '821676473858360';
  const gtagId = 'AW-17423083060';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
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
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body className="overflow-x-hidden overflow-y-scroll antialiased">
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
                  <LeadCapture />
                </Suspense>
                <Suspense fallback={null}>
                  <FacebookPixel pixelId={1648859765778662} />
                </Suspense>
              </AuthProvider>
            </CartProvider>
          </BrandProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
