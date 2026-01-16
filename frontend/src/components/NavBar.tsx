import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-[var(--color2)] bg-[var(--color3)]">
      <div className="relative flex h-20 w-full items-center justify-end px-4">
        
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
