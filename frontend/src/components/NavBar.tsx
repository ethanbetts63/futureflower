import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import logo320 from '../assets/logo-320w.webp';
import logo640 from '../assets/logo-640w.webp';
import logo768 from '../assets/logo-768w.webp';
import logo1024 from '../assets/logo-1024w.webp';
import logo1280 from '../assets/logo-1280w.webp';
import { useAuth } from '@/context/AuthContext';
import { Banner } from './ui/Banner';
import { resendVerificationEmail } from '@/api'; // Import the new api function
import { toast } from 'sonner'; // Import toast

const NavBar: React.FC = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  const handleResend = async () => {
    try {
      const response = await resendVerificationEmail();
      toast.success(response.detail || "A new verification email has been sent.");
    } catch (error) {
      toast.error("Failed to send email. Please try again in a few moments.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4">
          
          {/* Left Section: Logo and App Name */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                width="367"
                height="367"
                src={logo} 
                srcSet={`${logo320} 320w, ${logo640} 640w, ${logo768} 768w, ${logo1024} 1024w, ${logo1280} 1280w`}
                sizes="40px"
                alt=" Logo" 
                className="h-10 w-auto object-contain" 
              />
              <span className="font-bold text-xl hidden md:block bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold underline italic">ForeverFlower</span>
            </Link>
          </div>

          {/* Center Section: Can be used for nav links later */}
          <nav className="flex-1 flex justify-center gap-4">
          </nav>

          {/* Right Section: Auth Buttons */}
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <>
                {user.is_staff && (
                  <Button variant="ghost" onClick={() => navigate('/admin-dashboard')}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" onClick={() => navigate('/dashboard/events')}>
                  My Events
                </Button>
                <Button variant="ghost" onClick={() => navigate('/dashboard/account')}>
                  Account
                </Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/event-gate">
                  <Button>Create Event</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {user && !user.is_email_verified && (
        <Banner>
          Your email is not verified. Please check your inbox. No notifications will be sent until verification.
          <Button variant="link" className="ml-2 h-auto p-0 text-yellow-800 dark:text-yellow-300 underline" onClick={handleResend}>
            Resend Email
          </Button>
        </Banner>
      )}
    </>
  );
};

export default NavBar;
