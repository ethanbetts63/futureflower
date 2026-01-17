import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import logo320 from '../assets/logo-320w.webp';
import logo640 from '../assets/logo-640w.webp';
import logo768 from '../assets/logo-768w.webp';
import logo1024 from '../assets/logo-1024w.webp';
import logo1280 from '../assets/logo-1280w.webp';

const NavBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-[var(--color2)] bg-[var(--color3)]">
      <div className="relative flex h-20 w-full items-center justify-between px-4">
        
        {/* Left Section: Logo */}
        <Link to="/">
            <img 
              src={logo} 
              srcSet={`${logo320} 320w, ${logo640} 640w, ${logo768} 768w, ${logo1024} 1024w, ${logo1280} 1280w`}
              sizes="64px"
              alt="ForeverFlower Logo" 
              className="h-16 w-auto" 
            />
        </Link>

        {/* Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="font-bold text-6xl italic text-white font-['Playfair_Display',_serif]">
                FOREVERFLOWER
            </Link>
        </div>

        {/* Right Section: Auth Buttons */}
        <div className="flex items-center gap-2">
            <Link to="/login">
                <Button className="bg-white text-black font-bold hover:bg-gray-100">Login</Button>
            </Link>
            <Link to="/event-gate">
                <Button className="bg-white text-black font-bold hover:bg-gray-100">Create Event</Button>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
