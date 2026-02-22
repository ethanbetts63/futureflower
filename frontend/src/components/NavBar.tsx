import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import { useAuth } from '@/context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + brand */}
          <Link to="/" onClick={close} aria-label="FutureFlower company logo" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logo}
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="40px"
              alt=""
              width="367"
              height="367"
              className="h-10 w-auto brightness-0"
            />
            <span className="hidden sm:block font-['Playfair_Display',_serif] italic font-bold text-2xl md:text-3xl text-black tracking-widest leading-none">
              FUTUREFLOWER
            </span>
          </Link>

          {/* Order + Animated hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/order"
              onClick={close}
              className="inline-flex items-center bg-black text-white font-bold px-4 py-1.5 text-xs tracking-widest uppercase"
            >
              Order
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block w-5 h-px bg-black transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Dropdown menu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="bg-white border-t border-black/10 px-6 py-3 flex flex-col">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                Dashboard
              </Link>
              <Link to="/dashboard/account" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                Account Management
              </Link>
              <Link to="/dashboard/plans" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                Flower Plan Management
              </Link>
              <Link to="/dashboard/refunds" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                Refunds
              </Link>
              {user?.is_partner && (
                <>
                  <Link to="/dashboard/partner" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Business Dashboard
                  </Link>
                  <Link to="/dashboard/partner/details" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Business Details
                  </Link>
                  <Link to="/dashboard/partner/payouts" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Payouts
                  </Link>
                </>
              )}
              {(user?.is_staff || user?.is_superuser) && (
                <>
                  <Link to="/dashboard/admin" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Admin Dashboard
                  </Link>
                  <Link to="/dashboard/admin/partners" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Admin Partner List
                  </Link>
                  <Link to="/dashboard/admin/plans" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Admin Plan List
                  </Link>
                  <Link to="/dashboard/admin/users" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Admin User List
                  </Link>
                  <Link to="/dashboard/admin/payouts" onClick={close} className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5">
                    Admin Payouts
                  </Link>
                </>
              )}
              <button
                onClick={() => { logout(() => navigate('/')); close(); }}
                className="py-3 text-left text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={close}
              className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
