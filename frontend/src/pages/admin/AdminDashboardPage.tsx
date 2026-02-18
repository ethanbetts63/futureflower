import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '@/api/admin';
import type { AdminEvent, AdminDashboard } from '@/types/Admin';
import { Spinner } from '@/components/ui/spinner';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface EventCardProps {
  event: AdminEvent;
  section: 'to_order' | 'ordered' | 'delivered';
}

const EventCard: React.FC<EventCardProps> = ({ event, section }) => {
  const days = daysUntil(event.delivery_date);
  const recipientName = `${event.recipient_first_name} ${event.recipient_last_name}`;
  const location = [event.recipient_suburb, event.recipient_city].filter(Boolean).join(', ');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{recipientName}</p>
          <p className="text-sm text-gray-600">{formatDate(event.delivery_date)}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
          <p className="text-sm font-medium text-gray-700 mt-1">${event.budget}</p>
          {section === 'to_order' && (
            <p className={`text-sm font-semibold mt-1 ${days <= 3 ? 'text-red-600' : days <= 7 ? 'text-orange-500' : 'text-gray-500'}`}>
              {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Today' : `in ${days} day${days === 1 ? '' : 's'}`}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link
            to={`/dashboard/admin/events/${event.id}`}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-center"
          >
            View
          </Link>
          {section === 'to_order' && (
            <Link
              to={`/dashboard/admin/events/${event.id}/mark-ordered`}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-center"
            >
              Place Order
            </Link>
          )}
          {section === 'ordered' && (
            <Link
              to={`/dashboard/admin/events/${event.id}/mark-delivered`}
              className="text-sm px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 text-center"
            >
              Confirm Delivery
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  events: AdminEvent[];
  section: 'to_order' | 'ordered' | 'delivered';
}

const Section: React.FC<SectionProps> = ({ title, events, section }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
        {events.length}
      </span>
    </div>
    {events.length === 0 ? (
      <p className="text-gray-500 text-sm italic">No events currently in this queue.</p>
    ) : (
      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} section={section} />
        ))}
      </div>
    )}
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setDashboard)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-red-600">Error: {error}</p>;
  }

  if (!dashboard) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Task Queue</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Section title="To Order" events={dashboard.to_order} section="to_order" />
        <Section title="Ordered" events={dashboard.ordered} section="ordered" />
        <Section title="Delivered" events={dashboard.delivered} section="delivered" />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
