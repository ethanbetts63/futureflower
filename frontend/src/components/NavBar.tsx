import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import type { NavItem } from '../types/NavItem';
import settingsPng from '../assets/settings.png';
import logoutPng from '../assets/logout.png';
import flowerIcon from '../assets/flower_symbol.svg';

const BREAKPOINT = 1048; 

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { dashboardNavItems } = useNavigation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isDashboardMobile = dashboardNavItems.length > 0 && screenWidth < BREAKPOINT;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth >= BREAKPOINT) {
        setMenuOpen(false); 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-[var(--color2)] bg-[var(--color3)]">
      <div className="relative flex h-20 w-full items-center justify-between px-4">
        
        {/* Left Section: Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
            <img 
              width="367"
              height="367"
              src={logo} 
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="64px"
              alt="FutureFlower Logo" 
              className="h-16 w-auto" 
            />
        </Link>

        {/* Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <Link to="/" className="font-bold md:text-4xl lg:text-6xl text-white font-['Playfair_Display',_serif]">
                FUTUREFLOWER
            </Link>
        </div>

        {/* Right Section: Auth Buttons */}
        {screenWidth < BREAKPOINT ? (
            <div className="flex items-center">
                <Button onClick={() => setMenuOpen(!menuOpen)} className="bg-white text-black font-bold hover:bg-gray-100 p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                    </svg>
                </Button>
            </div>
        ) : null}

        {((screenWidth < BREAKPOINT && menuOpen) || screenWidth >= BREAKPOINT) && (
            <div className={`items-center gap-2 ${screenWidth < BREAKPOINT ? 'flex flex-col absolute top-full left-0 w-full bg-[var(--color3)] p-4 shadow-lg' : 'flex'}`}>
                {isAuthenticated ? (
                    <>
                        {isDashboardMobile ? (
                            <>
                                {dashboardNavItems.map((item: NavItem) => (
                                    <Link to={item.to} key={item.to} onClick={() => setMenuOpen(false)} className="w-full flex justify-center">
                                        <Button className="bg-white text-black font-bold hover:bg-gray-100 w-1/2 flex items-center justify-center px-4 py-2 h-10">
                                            {item.to === '/dashboard' && <img src={settingsPng} alt="Settings" className="mr-2 w-5 h-5" />}
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`${screenWidth < BREAKPOINT ? 'w-full flex justify-center' : ''}`}>
                                <Button className={`bg-white text-black font-bold hover:bg-gray-100 px-4 py-2 h-10 ${screenWidth < BREAKPOINT ? 'w-1/2 flex items-center justify-center' : ''}`}>
                                    {screenWidth < BREAKPOINT ? (
                                        <>
                                            <img src={settingsPng} alt="Settings" className="mr-2 w-5 h-5" />
                                            Dashboard
                                        </>
                                    ) : (
                                        <img src={settingsPng} alt="Settings" className="w-5 h-5" />
                                    )}
                                </Button>
                            </Link>
                        )}
                        <Button
                            onClick={() => { logout(() => navigate('/')); setMenuOpen(false); }}
                            className={`bg-white text-black font-bold hover:bg-gray-100 px-4 py-2 h-10 ${screenWidth < BREAKPOINT ? 'w-1/2 flex items-center justify-center' : ''}`}
                        >
                            {screenWidth < BREAKPOINT ? (
                                <>
                                    <img src={logoutPng} alt="Logout" className="mr-2 w-5 h-5" />
                                    Logout
                                </>
                            ) : (
                                <img src={logoutPng} alt="Logout" className="w-5 h-5" />
                            )}
                        </Button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className={`${screenWidth < BREAKPOINT ? 'w-full flex justify-center' : ''}`}>
                        <Button className={`bg-white text-black font-bold hover:bg-gray-100 px-4 py-2 h-10 ${screenWidth < BREAKPOINT ? 'w-1/2 flex items-center justify-center' : ''}`}>Login</Button>
                    </Link>
                )}

                <Link to="/order" onClick={() => setMenuOpen(false)} className={`${screenWidth < BREAKPOINT ? 'w-full flex justify-center' : ''}`}>
                    <div className={`inline-flex items-center justify-center gap-2 bg-[var(--colorgreen)] text-black font-bold px-4 py-2 h-10 rounded-md hover:brightness-110 transition-all text-center shadow-sm cursor-pointer ${screenWidth < BREAKPOINT ? 'w-1/2' : ''}`}>
                        <img src={flowerIcon} alt="Order" className="h-6 w-6" />
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </Link>
            </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
