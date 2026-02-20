import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminEvent } from '@/api/admin';
import type { AdminEvent } from '@/types/AdminEvent';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import FlowBackButton from '@/components/form_flow/FlowBackButton';

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateTime(dtStr: string): string {
  return new Date(dtStr).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  ordered: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status}
  </span>
);

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-black/40 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-black">{value || '—'}</p>
  </div>
);

const AdminEventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    getAdminEvent(Number(eventId))
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="p-8 text-red-600">{error ?? 'Event not found.'}</p>
        </div>
      </div>
    );
  }

  const fullAddress = [
    event.recipient_street_address,
    event.recipient_suburb,
    event.recipient_city,
    event.recipient_state,
    event.recipient_postcode,
    event.recipient_country,
  ].filter(Boolean).join(', ');

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <Seo title={`Event #${event.id} | FutureFlower`} />
      <div className="container mx-auto max-w-4xl">
        <UnifiedSummaryCard
          title={`Event #${event.id}`}
          description={`${event.recipient_first_name} ${event.recipient_last_name} — ${formatDate(event.delivery_date)}`}
          footer={
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to="/dashboard/admin" />
              {event.status === 'scheduled' && (
                <Button asChild className="px-6 py-3 rounded-xl text-base font-normal bg-black text-white hover:bg-black/80">
                  <Link to={`/dashboard/admin/events/${event.id}/mark-ordered`}>Place Order</Link>
                </Button>
              )}
              {event.status === 'ordered' && (
                <Button asChild className="px-6 py-3 rounded-xl text-base font-normal bg-green-600 text-white hover:bg-green-700">
                  <Link to={`/dashboard/admin/events/${event.id}/mark-delivered`}>Confirm Delivery</Link>
                </Button>
              )}
            </div>
          }
        >
          {/* Delivery Details */}
          <SummarySection label="Delivery">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Recipient" value={`${event.recipient_first_name} ${event.recipient_last_name}`} />
              <Field label="Delivery Date" value={formatDate(event.delivery_date)} />
              {fullAddress && (
                <div className="sm:col-span-2">
                  <Field label="Address" value={fullAddress} />
                </div>
              )}
              <Field label="Preferred Delivery Time" value={event.preferred_delivery_time} />
              {event.delivery_notes && (
                <div className="sm:col-span-2">
                  <Field label="Delivery Notes" value={event.delivery_notes} />
                </div>
              )}
              {event.message && (
                <div className="sm:col-span-2">
                  <Field label="Card Message" value={event.message} />
                </div>
              )}
            </div>
          </SummarySection>

          {/* Order */}
          <SummarySection label="Order">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Budget" value={`$${event.budget}`} />
              <Field label="Total Amount" value={`$${event.total_amount}`} />
              <Field label="Plan Type" value={event.order_type} />
              <Field label="Frequency" value={event.frequency} />
            </div>
          </SummarySection>

          {/* Preferences */}
          <SummarySection label="Preferences">
            <div className="grid grid-cols-1 gap-4">
              <Field
                label="Flower Types"
                value={event.preferred_flower_types.length > 0 ? event.preferred_flower_types.join(', ') : null}
              />
              {event.flower_notes && <Field label="Flower Notes" value={event.flower_notes} />}
            </div>
          </SummarySection>

          {/* Customer */}
          <SummarySection label="Customer">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" value={`${event.customer_first_name} ${event.customer_last_name}`} />
              <Field label="Email" value={event.customer_email} />
            </div>
          </SummarySection>

          {/* Status & Evidence */}
          <SummarySection label="Status">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <StatusBadge status={event.status} />
              </div>

              {(event.status === 'ordered' || event.status === 'delivered') && event.ordered_at && (
                <div className="space-y-1">
                  <p className="text-xs text-black/40 uppercase tracking-wider">Ordered At</p>
                  <p className="text-sm text-black">{formatDateTime(event.ordered_at)}</p>
                  {event.ordering_evidence_text && (
                    <p className="text-sm text-black/70 whitespace-pre-wrap bg-black/5 rounded-xl p-4 mt-2">
                      {event.ordering_evidence_text}
                    </p>
                  )}
                </div>
              )}

              {event.status === 'delivered' && event.delivered_at && (
                <div className="space-y-1">
                  <p className="text-xs text-black/40 uppercase tracking-wider">Delivered At</p>
                  <p className="text-sm text-black">{formatDateTime(event.delivered_at)}</p>
                  {event.delivery_evidence_text && (
                    <p className="text-sm text-black/70 whitespace-pre-wrap bg-black/5 rounded-xl p-4 mt-2">
                      {event.delivery_evidence_text}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SummarySection>
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default AdminEventDetailPage;
