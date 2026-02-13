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
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          {/* Left Side: Logo and Copyright */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <img
                                width="367"
                                height="367"
                                className="h-20 w-auto"
                                src={logo}
                                srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
                                sizes="80px"
                                alt="FutureFlower Logo"
                            />
            <p className="text-sm">&copy; {currentYear} FutureFlower. All rights reserved.</p>
          </div>

          {/* Right Side: Navigation Links & Payment Badge */}
          <div className="flex flex-col md:items-end gap-4">
            <nav className="flex gap-6 justify-center md:justify-end">
              <Link to="/florists" className="text-sm hover:underline">Florists</Link>
              <Link to="/contact" className="text-sm hover:underline">Contact Us</Link>
              <Link to="/terms-and-conditions" className="text-sm hover:underline">Terms & Conditions</Link>
              {(user?.is_staff || user?.is_superuser) && (
                <Link to="/admin-dashboard" className="text-sm hover:underline">Admin Dashboard</Link>
              )}
            </nav>
            <div className="flex items-center justify-center md:justify-end gap-0">
                <span className="text-xs opacity-70">Powered by</span>
                <img src={stripeLogo} alt="Stripe" className="h-6" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;