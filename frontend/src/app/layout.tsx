import type { Metadata } from "next";
import "../index.css";
import Providers from './providers';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app",
  ),
  title: {
    default: "FutureFlower | Flower Delivery & Subscriptions",
    template: "%s",
  },
  description:
    "Free delivery from local florists. Pick a date, set a budget, and FutureFlower handles the rest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
