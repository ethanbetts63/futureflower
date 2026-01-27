import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import settingsPng from '../assets/settings.png';
import logoutPng from '../assets/logout.png';

const BREAKPOINT = 1048; // Custom breakpoint for hamburger menu

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
        setMenuOpen(false); // Close menu if resized to desktop
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
        <Link to="/">
            <img 
              width="367"
              height="367"
              src={logo} 
              srcSet={`${logo128} 128w, ${logo192} 192w, ${logo256} 256w`}
              sizes="64px"
              alt="ForeverFlower Logo" 
              className="h-16 w-auto" 
            />
        </Link>

        {/* Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <Link to="/" className="font-bold md:text-4xl lg:text-6xl italic text-white font-['Playfair_Display',_serif]">
                FOREVERFLOWER
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
                <Link to="/event-gate" onClick={() => setMenuOpen(false)}>
                    <Button className={`bg-white text-black font-bold hover:bg-gray-100 ${screenWidth < BREAKPOINT ? 'w-1/2' : ''}`}>Order</Button>
                </Link>

                {isAuthenticated ? (
                    <>
                        {isDashboardMobile ? (
                            <>
                                {dashboardNavItems.map(item => (
                                    <Link to={item.to} key={item.to} onClick={() => setMenuOpen(false)}>
                                        <Button className="bg-white text-black font-bold hover:bg-gray-100 w-1/2 flex items-center justify-center">
                                            {item.to === '/dashboard' && <img src={settingsPng} alt="Settings" className="mr-2 w-5 h-5" />}
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                                <Button className={`bg-white text-black font-bold hover:bg-gray-100 ${screenWidth < BREAKPOINT ? 'w-1/2 flex items-center justify-center' : ''}`}>
                                    {screenWidth < BREAKPOINT ? (
                                        <>
                                            <img src={settingsPng} alt="Settings" className="mr-2 w-5 h-5" />
                                            Account
                                        </>
                                    ) : (
                                        <img src={settingsPng} alt="Settings" className="w-5 h-5" />
                                    )}
                                </Button>
                            </Link>
                        )}
                        <Button
                            onClick={() => { logout(() => navigate('/')); setMenuOpen(false); }}
                            className={`bg-white text-black font-bold hover:bg-gray-100 ${screenWidth < BREAKPOINT ? 'w-1/2 flex items-center justify-center' : ''}`}
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
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                        <Button className={`bg-white text-black font-bold hover:bg-gray-100 ${screenWidth < BREAKPOINT ? 'w-1/2' : ''}`}>Login</Button>
                    </Link>
                )}
            </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
