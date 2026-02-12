import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Seo from '@/components/Seo';
import { Home  } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full justify-start flex items-center gap-2 ${isActive ? 'bg-muted text-primary' : 'hover:bg-muted/50'}`;

  if (isAuthLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title="Admin | FutureFlower" />
      <div className="flex h-screen">
        {/* Vertical Nav */}
        <aside className="w-64 flex-shrink-0 border-r p-4 bg-background">
          <nav className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold tracking-tight mb-2 px-2">Admin Menu</h2>
            <Button asChild variant="ghost">
              <NavLink to="/admin-dashboard" end className={getNavLinkClass}>
                <Home className="h-4 w-4" />
                Admin Dashboard
              </NavLink>
            </Button>
            <h3 className="text-sm font-semibold tracking-tight mt-4 mb-2 px-2 text-muted-foreground">Analytics</h3>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow border-l p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
