import React from 'react';

const UserDashboardPage: React.FC = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <p className="mb-8 text-lg">
        This is your central hub for managing everything related to your Forever Flower account. 
        Here you can get a quick overview of your flower plans, upcoming deliveries, and recent account activity.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Your Next Delivery</h2>
          <p>Your next beautiful bouquet of seasonal flowers is scheduled for <strong>Tuesday, January 27, 2026</strong>.</p>
          <p className="mt-2">We'll notify you once it's on its way!</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Flower Plan Status</h2>
          <p>You are currently subscribed to the <strong>"Weekly Blooms"</strong> plan.</p>
          <p className="mt-2">Your subscription is active and will renew on the 1st of every month.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You updated your delivery address on January 15, 2026.</li>
            <li>You paused your subscription for one week on January 5, 2026.</li>
            <li>Your payment for January was successfully processed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
