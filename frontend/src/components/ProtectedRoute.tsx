import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that ensures a user is authenticated before rendering the child component.
 * It waits for the AuthContext to finish its initial loading state to avoid false-positive redirects
 * during token refresh or initial boot.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="text-center">
          <Spinner className="h-12 w-12 mb-4" />
          <p className="text-muted-foreground animate-pulse">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the current location so we can send them back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
