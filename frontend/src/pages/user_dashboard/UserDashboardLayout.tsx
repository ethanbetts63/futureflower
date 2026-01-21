import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

function UserDashboardLayout() {
  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-6">
        <nav className="flex flex-col space-y-6">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <Link to="/event-gate">
            <Button className="w-full bg-white text-black font-bold hover:bg-gray-100">Order Flowers</Button>
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