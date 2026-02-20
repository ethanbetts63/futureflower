import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard, getPendingPartners } from '@/api/admin';
import type { AdminDashboard } from '@/types/AdminDashboard';
import type { AdminPartner } from '@/types/AdminPartner';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import type { EventCardProps } from '@/types/EventCardProps';
import type { QueueSectionProps } from '@/types/QueueSectionProps';

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

const EventCard: React.FC<EventCardProps> = ({ event, section }) => {
  const days = daysUntil(event.delivery_date);
  const recipientName = `${event.recipient_first_name} ${event.recipient_last_name}`;
  const location = [event.recipient_suburb, event.recipient_city].filter(Boolean).join(', ');

  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-black/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-black truncate">{recipientName}</p>
        <p className="text-sm text-black/60">{formatDate(event.delivery_date)}</p>
        {location && <p className="text-sm text-black/40">{location}</p>}
        <p className="text-sm font-medium text-black/70 mt-0.5">${event.budget}</p>
        {section === 'to_order' && (
          <p className={`text-sm font-semibold mt-0.5 ${days <= 3 ? 'text-red-600' : days <= 7 ? 'text-orange-500' : 'text-black/40'}`}>
            {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Today' : `in ${days} day${days === 1 ? '' : 's'}`}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Link
          to={`/dashboard/admin/events/${event.id}`}
          className="text-xs px-3 py-1.5 rounded border border-black/20 hover:bg-black/5 text-center text-black/70"
        >
          View
        </Link>
        {section === 'to_order' && (
          <Link
            to={`/dashboard/admin/events/${event.id}/mark-ordered`}
            className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-center"
          >
            Place Order
          </Link>
        )}
        {section === 'ordered' && (
          <Link
            to={`/dashboard/admin/events/${event.id}/mark-delivered`}
            className="text-xs px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 text-center"
          >
            Confirm Delivery
          </Link>
        )}
      </div>
    </div>
  );
};

const QueueSection: React.FC<QueueSectionProps> = ({ title, events, section }) => (
  <SummarySection label={`${title} (${events.length})`}>
    {events.length === 0 ? (
      <p className="text-sm text-black/40 italic">No events currently in this queue.</p>
    ) : (
      <div className="flex flex-col">
        {events.map((event) => (
          <EventCard key={event.id} event={event} section={section} />
        ))}
      </div>
    )}
  </SummarySection>
);

const PartnerRequestRow: React.FC<{ partner: AdminPartner }> = ({ partner }) => (
  <div className="flex justify-between items-center gap-4 py-3 border-b border-black/5 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-black truncate">{partner.business_name || `${partner.first_name} ${partner.last_name}`}</p>
      <p className="text-sm text-black/60">
        {partner.partner_type === 'delivery' ? 'Delivery (Florist)' : 'Referral'}
        {' · '}
        {partner.first_name} {partner.last_name}
      </p>
      <p className="text-sm text-black/40">{partner.email}</p>
    </div>
    <Link
      to={`/dashboard/admin/partners/${partner.id}`}
      className="text-xs px-3 py-1.5 rounded border border-black/20 hover:bg-black/5 text-center text-black/70 flex-shrink-0"
    >
      View
    </Link>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [pendingPartners, setPendingPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getPendingPartners()])
      .then(([dash, partners]) => {
        setDashboard(dash);
        setPendingPartners(partners);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <div className="container mx-auto max-w-4xl">
        <Seo title="Admin Dashboard | FutureFlower" />
        <UnifiedSummaryCard
          title="Admin Dashboard"
          description="Manage upcoming deliveries — place orders and confirm deliveries."
        >
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-black/20" />
              <p className="ml-4 text-black/40">Loading task queue...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 text-sm">{error}</div>
          ) : dashboard ? (
            <>
              <SummarySection label={`Partner Requests (${pendingPartners.length})`}>
                {pendingPartners.length === 0 ? (
                  <p className="text-sm text-black/40 italic">No pending partner requests.</p>
                ) : (
                  <div className="flex flex-col">
                    {pendingPartners.map((partner) => (
                      <PartnerRequestRow key={partner.id} partner={partner} />
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <Link
                    to="/dashboard/admin/partners"
                    className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
                  >
                    See all partners
                  </Link>
                </div>
              </SummarySection>
              <QueueSection title="To Order" events={dashboard.to_order} section="to_order" />
              <QueueSection title="Ordered" events={dashboard.ordered} section="ordered" />
              <QueueSection title="Delivered" events={dashboard.delivered} section="delivered" />
            </>
          ) : null}
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
