import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import type { NavItem } from '../types/NavItem';
import sideMenuSymbol from '../assets/side_menu_symbol.svg';
import flowerIcon from '../assets/flower_symbol.svg';
import settingsPng from '../assets/settings.png';
import logoutPng from '../assets/logout.png';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { dashboardNavItems } = useNavigation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color3)] border-b border-black/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo + brand name */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logo}
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="44px"
              alt="FutureFlower"
              width="367"
              height="367"
              className="h-11 w-auto"
            />
            <span className="hidden italic sm:block font-['Playfair_Display',_serif] font-bold text-3xl md:text-4xl text-white tracking-wide leading-none">
              FUTUREFLOWER
            </span>
          </Link>

          {/* Right: Desktop actions */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {dashboardNavItems.length > 0 ? (
                  dashboardNavItems.map((item: NavItem) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      className="px-3 py-2 rounded-md text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="p-2 rounded-md bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
                    title="Dashboard"
                  >
                    <img src={settingsPng} alt="Dashboard" className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={() => { logout(() => navigate('/')); close(); }}
                  className="p-2 rounded-md bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
                  title="Logout"
                >
                  <img src={logoutPng} alt="Logout" className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={close}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}

            <Link
              to="/order"
              onClick={close}
              className="ml-2 inline-flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-lg text-sm hover:brightness-105 transition-all shadow-sm"
            >
              <img src={flowerIcon} alt="" className="h-5 w-5" />
              Order
            </Link>
          </div>

          {/* Right: Mobile — Order CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/order"
              onClick={close}
              className="inline-flex items-center gap-1.5 bg-[var(--colorgreen)] text-black font-bold px-3 py-1.5 rounded-lg text-sm hover:brightness-105 transition-all shadow-sm"
            >
              <img src={flowerIcon} alt="" className="h-4 w-4" />
              Order
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 rounded-md bg-white hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <img src={sideMenuSymbol} alt="Menu" className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black/10 bg-[var(--color3)] px-4 py-2">
          {isAuthenticated ? (
            <>
              {dashboardNavItems.length > 0 ? (
                dashboardNavItems.map((item: NavItem) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-black/10 transition-colors text-black font-medium"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <Link
                  to="/dashboard"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-black/10 transition-colors text-black font-medium"
                >
                  <img src={settingsPng} alt="" className="w-5 h-5" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => { logout(() => navigate('/')); close(); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-black/10 transition-colors text-black font-medium"
              >
                <img src={logoutPng} alt="" className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={close}
              className="flex items-center px-3 py-3 rounded-lg hover:bg-black/10 transition-colors text-black font-medium"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;
