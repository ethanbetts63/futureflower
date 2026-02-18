import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import stripeLogo from '../assets/stripe-ar21.svg';
import { useAuth } from '@/context/AuthContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Site Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Quick Links</p>
            <Link to="/florists" className="text-sm hover:underline">Florists</Link>
            <Link to="/affiliates" className="text-sm hover:underline">Affiliates</Link>
            <Link to="/contact" className="text-sm hover:underline">Contact Us</Link>
            {(user?.is_staff || user?.is_superuser) && (
              <Link to="/admin-dashboard" className="text-sm hover:underline">Admin Dashboard</Link>
            )}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Legal</p>
            <Link to="/terms-and-conditions/customer" className="text-sm hover:underline">Customer Terms & Conditions</Link>
            <Link to="/terms-and-conditions/florist" className="text-sm hover:underline">Florist Terms & Conditions</Link>
            <Link to="/terms-and-conditions/affiliate" className="text-sm hover:underline">Affiliate Terms & Conditions</Link>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img
              width="367"
              height="367"
              className="h-16 w-16 object-contain"
              src={logo}
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="64px"
              alt="FutureFlower Logo"
            />
            <p className="text-sm opacity-80">&copy; {currentYear} FutureFlower. All rights reserved.</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs opacity-60">Powered by</span>
              <img src={stripeLogo} alt="Stripe" className="h-5" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
