"use client";

import Link from 'next/link';
import logo from '@/assets/logo.webp';
import logo128 from '@/assets/logo-128w.webp';
import logo192 from '@/assets/logo-192w.webp';
import logo256 from '@/assets/logo-256w.webp';
import stripeLogo from '@/assets/stripe-ar21.svg';
import { assetSrc } from '@/lib/assets';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="border-t border-black/10 bg-white text-black">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Quick Links</p>
            <Link href="/florists" className="text-sm hover:underline">Florists</Link>
            <Link href="/affiliates" className="text-sm hover:underline">Affiliates</Link>
            <Link href="/order-support" className="text-sm hover:underline">Order Support</Link>
            <Link href="/login" className="text-sm hover:underline">Log in</Link>
            {(user?.is_staff || user?.is_superuser) && (
              <Link href="/admin-dashboard" className="text-sm hover:underline">Admin Dashboard</Link>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Flower Delivery</p>
            <Link href="/flower-subscription" className="text-sm hover:underline">Flower Subscription</Link>
            <Link href="/birthday-flower-delivery" className="text-sm hover:underline">Birthday Flowers</Link>
            <Link href="/valentines-day-flower-delivery" className="text-sm hover:underline">Valentine's Day Flowers</Link>
            <Link href="/mothers-day-flower-delivery" className="text-sm hover:underline">Mother's Day Flowers</Link>
            <Link href="/flower-delivery-perth" className="text-sm hover:underline">Flower Delivery Perth</Link>
            <Link href="/flower-delivery-melbourne" className="text-sm hover:underline">Flower Delivery Melbourne</Link>
            <Link href="/flower-delivery-sydney" className="text-sm hover:underline">Flower Delivery Sydney</Link>
            <Link href="/flower-delivery-brisbane" className="text-sm hover:underline">Flower Delivery Brisbane</Link>
            <Link href="/flower-delivery-adelaide" className="text-sm hover:underline">Flower Delivery Adelaide</Link>
            <Link href="/flower-delivery-hobart" className="text-sm hover:underline">Flower Delivery Hobart</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Guides &amp; Articles</p>
            <Link href="/articles" className="text-sm hover:underline">All Articles</Link>
            <Link href="/articles/best-flower-subscription-services-au" className="text-sm hover:underline">Best Subscriptions Australia</Link>
            <Link href="/articles/best-flower-delivery-perth" className="text-sm hover:underline">Best Flower Delivery Perth</Link>
            <Link href="/articles/best-flower-delivery-sydney" className="text-sm hover:underline">Best Flower Delivery Sydney</Link>
            <Link href="/articles/best-flower-delivery-melbourne" className="text-sm hover:underline">Best Flower Delivery Melbourne</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Legal</p>
            <Link href="/terms-and-conditions/customer" className="text-sm hover:underline">Customer Terms & Conditions</Link>
            <Link href="/terms-and-conditions/florist" className="text-sm hover:underline">Florist Terms & Conditions</Link>
            <Link href="/terms-and-conditions/affiliate" className="text-sm hover:underline">Affiliate Terms & Conditions</Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm">
              <img
                width="367"
                height="367"
                className="h-11 w-11 object-contain brightness-0"
                src={assetSrc(logo)}
                srcSet={`${assetSrc(logo128)} 128w, ${assetSrc(logo192)} 192w, ${assetSrc(logo256)} 256w`}
                sizes="40px"
                alt="FutureFlower Logo"
                loading="lazy"
              />
            </div>
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
