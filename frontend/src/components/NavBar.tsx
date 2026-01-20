import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import logo128 from '../assets/logo-128w.webp';
import logo192 from '../assets/logo-192w.webp';
import logo256 from '../assets/logo-256w.webp';

const NavBar: React.FC = () => {

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
        <div className="flex items-center gap-2">
            <Link to="/login">
                <Button className="bg-white text-black font-bold hover:bg-gray-100">Login</Button>
            </Link>
            <Link to="/create-account">
                <Button className="bg-white text-black font-bold hover:bg-gray-100">Sign Up</Button>
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
