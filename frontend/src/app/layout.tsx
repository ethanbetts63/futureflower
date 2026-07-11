import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display } from 'next/font/google';
import "../index.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
});
import Providers from './providers';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { buildWebsiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app",
  ),
  title: {
    default: "FutureFlower | Australian Florist-Led Flower Delivery",
    template: "%s",
  },
  description:
    "Tell us the occasion, budget, and flower preferences. A local Australian florist designs a bouquet that fits.",
  icons: {
    icon: [
      { url: '/favicon-32x32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/favicon-48x48.png',  sizes: '48x48',  type: 'image/png' },
      { url: '/favicon-96x96.png',  sizes: '96x96',  type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} scroll-smooth`}>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NHG66P5X9L" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NHG66P5X9L');
          gtag('config', 'AW-17974501300');
        `}</Script>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteSchema()) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
