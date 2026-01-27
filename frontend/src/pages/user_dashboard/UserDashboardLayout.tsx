import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/context/NavigationContext";
import { useEffect } from "react";

function UserDashboardLayout() {
  const { setDashboardNavItems } = useNavigation();

  useEffect(() => {
    const dashboardLinks = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/dashboard/account', label: 'Account Management' },
      { to: '/dashboard/plans', label: 'Flower Plan Management' },
    ];
    setDashboardNavItems(dashboardLinks);

    // Cleanup function to clear the items when leaving the dashboard
    return () => {
      setDashboardNavItems([]);
    };
  }, [setDashboardNavItems]);

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
      <aside className="hidden md:block w-64 flex-shrink-0 bg-gray-800 text-white p-6">
        <nav className="flex flex-col space-y-6">
          <Link to="/dashboard" className="text-lg font-semibold hover:text-gray-300">Dashboard</Link>
          <Link to="/event-gate">
            <Button className="w-full bg-white text-black font-bold hover:bg-gray-100">Order</Button>
          </Link>
          <Link to="/dashboard/account" className="text-lg hover:text-gray-300">Account Management</Link>
          <Link to="/dashboard/plans" className="text-lg hover:text-gray-300">Flower Plan Management</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboardLayout;