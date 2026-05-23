"use client";

import Link from 'next/link';
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import stripeLogo from '../assets/stripe-ar21.svg';
import { assetSrc } from '@/lib/assets';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Site Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Quick Links</p>
            <Link href="/florists" className="text-sm hover:underline">Florists</Link>
            <Link href="/affiliates" className="text-sm hover:underline">Affiliates</Link>
            <Link href="/contact" className="text-sm hover:underline">Contact Us</Link>
            {(user?.is_staff || user?.is_superuser) && (
              <Link href="/admin-dashboard" className="text-sm hover:underline">Admin Dashboard</Link>
            )}
          </div>

          {/* Flower Delivery */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Flower Delivery</p>
            <Link href="/birthday-flower-delivery" className="text-sm hover:underline">Birthday Flowers</Link>
            <Link href="/valentines-day-flower-delivery" className="text-sm hover:underline">Valentine's Day Flowers</Link>
            <Link href="/mothers-day-flower-delivery" className="text-sm hover:underline">Mother's Day Flowers</Link>
            <Link href="/flower-delivery-perth" className="text-sm hover:underline">Flower Delivery Perth</Link>
          </div>

          {/* Articles */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Guides &amp; Articles</p>
            <Link href="/articles" className="text-sm hover:underline">All Articles</Link>
            <Link href="/articles/best-flower-subscription-services-au" className="text-sm hover:underline">Best Subscriptions Australia</Link>
            <Link href="/articles/best-flower-subscription-services-us" className="text-sm hover:underline">Best Subscriptions USA</Link>
            <Link href="/articles/best-flower-subscription-services-uk" className="text-sm hover:underline">Best Subscriptions UK</Link>
            <Link href="/articles/best-flower-delivery-perth" className="text-sm hover:underline">Best Flower Delivery Perth</Link>
            <Link href="/articles/best-flower-delivery-sydney" className="text-sm hover:underline">Best Flower Delivery Sydney</Link>
            <Link href="/articles/best-flower-delivery-melbourne" className="text-sm hover:underline">Best Flower Delivery Melbourne</Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Legal</p>
            <Link href="/terms-and-conditions/customer" className="text-sm hover:underline">Customer Terms & Conditions</Link>
            <Link href="/terms-and-conditions/florist" className="text-sm hover:underline">Florist Terms & Conditions</Link>
            <Link href="/terms-and-conditions/affiliate" className="text-sm hover:underline">Affiliate Terms & Conditions</Link>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img
              width="367"
              height="367"
              className="h-16 w-16 object-contain"
              src={assetSrc(logo)}
              srcSet={`${assetSrc(logo128)} 128w, ${assetSrc(logo192)} 192w, ${assetSrc(logo256)} 256w`}
              sizes="64px"
              alt="FutureFlower Logo"
              loading="lazy"
            />
            <p className="text-sm opacity-80">&copy; {currentYear} FutureFlower. All rights reserved.</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs opacity-60">Powered by</span>
              <img src={assetSrc(stripeLogo)} alt="Stripe" className="h-5" width="50" height="60" loading="lazy" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
