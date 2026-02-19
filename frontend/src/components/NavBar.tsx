import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import type { NavItem } from '../types/NavItem';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { dashboardNavItems } = useNavigation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + brand */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logo}
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="40px"
              alt="FutureFlower"
              width="367"
              height="367"
              className="h-10 w-auto brightness-0"
            />
            <span className="hidden sm:block font-['Playfair_Display',_serif] italic font-bold text-2xl md:text-3xl text-black tracking-widest leading-none">
              FUTUREFLOWER
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {dashboardNavItems.length > 0 ? (
                  dashboardNavItems.map((item: NavItem) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      className="text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(() => navigate('/')); close(); }}
                  className="text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={close}
                className="text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase"
              >
                Login
              </Link>
            )}

            <Link
              to="/order"
              onClick={close}
              className="inline-flex items-center bg-black text-white font-bold px-5 py-2 text-xs tracking-widest uppercase hover:bg-black/80 transition-colors"
            >
              Order Now
            </Link>
          </nav>

          {/* Mobile: Order + Animated hamburger */}
          <div className="flex md:hidden items-center gap-4">
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

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <nav className="bg-white border-t border-black/10 px-6 py-3 flex flex-col">
          {isAuthenticated ? (
            <>
              {dashboardNavItems.length > 0 ? (
                dashboardNavItems.map((item: NavItem) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5 last:border-0"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <Link
                  to="/dashboard"
                  onClick={close}
                  className="py-3 text-xs font-semibold text-black hover:text-black/50 transition-colors tracking-widest uppercase border-b border-black/5"
                >
                  Dashboard
                </Link>
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
