import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/context/NavigationContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function UserDashboardLayout() {
  const { setDashboardNavItems } = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    const dashboardLinks = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/dashboard/account', label: 'Account Management' },
      { to: '/dashboard/plans', label: 'Flower Plan Management' },
    ];

    if (user?.is_partner) {
      dashboardLinks.push(
        { to: '/dashboard/partner', label: 'Business Dashboard' },
        { to: '/dashboard/partner/details', label: 'Business Details' },
        { to: '/dashboard/partner/payouts', label: 'Payouts' },
      );
    }

    if (user?.is_staff || user?.is_superuser) {
      dashboardLinks.push({ to: '/dashboard/admin', label: 'Task Queue' });
    }

    setDashboardNavItems(dashboardLinks);

    return () => {
      setDashboardNavItems([]);
    };
  }, [setDashboardNavItems, user?.is_partner, user?.is_staff, user?.is_superuser]);

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-gray-800 text-white p-6">
        <nav className="flex flex-col space-y-6">
          <Link to="/dashboard" className="text-lg font-semibold hover:text-gray-300">Dashboard</Link>
          <Link to="/order">
            <Button className="w-full bg-white text-black font-bold hover:bg-gray-100">Order</Button>
          </Link>
          <Link to="/dashboard/account" className="text-lg hover:text-gray-300">Account Management</Link>
          <Link to="/dashboard/plans" className="text-lg hover:text-gray-300">Flower Plan Management</Link>

          {user?.is_partner && (
            <>
              <div className="border-t border-gray-600 pt-4">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Business</p>
                <div className="flex flex-col space-y-6">
                  <Link to="/dashboard/partner" className="text-lg hover:text-gray-300">Business Dashboard</Link>
                  <Link to="/dashboard/partner/details" className="text-lg hover:text-gray-300">Business Details</Link>
                  <Link to="/dashboard/partner/payouts" className="text-lg hover:text-gray-300">Payouts</Link>
                </div>
              </div>
            </>
          )}

          {(user?.is_staff || user?.is_superuser) && (
            <div className="border-t border-gray-600 pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Admin</p>
              <div className="flex flex-col space-y-6">
                <Link to="/dashboard/admin" className="text-lg hover:text-gray-300">Task Queue</Link>
              </div>
            </div>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-0">
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboardLayout;
