import { Outlet } from "react-router-dom";

function UserDashboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col" style={{ backgroundColor: 'var(--color4)' }}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboardLayout;