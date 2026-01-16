import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-4">
        
        {/* Left Spacer */}
        <div className="flex-1"></div>

        {/* Center Title */}
        <div className="flex-1 text-center">
            <Link to="/" className="font-bold text-2xl italic">
                FOREVERFLOWER
            </Link>
        </div>

        {/* Right Section: Auth Buttons */}
        <div className="flex flex-1 items-center justify-end gap-2">
            <Link to="/login">
                <Button>Login</Button>
            </Link>
            <Link to="/event-gate">
                <Button>Create Event</Button>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
