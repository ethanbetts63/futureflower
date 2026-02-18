import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminEvent } from '@/api/admin';
import type { AdminEvent } from '@/types/Admin';
import { Spinner } from '@/components/ui/spinner';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(dtStr: string): string {
  return new Date(dtStr).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || <span className="italic text-gray-400">—</span>}</dd>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colours: Record<string, string> = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    ordered: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-semibold capitalize ${colours[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

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
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error || !event) {
    return <p className="p-8 text-red-600">Error: {error ?? 'Event not found.'}</p>;
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
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/dashboard/admin" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Task Queue
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Event #{event.id} — {event.recipient_first_name} {event.recipient_last_name}
      </h1>
      <p className="text-gray-500 mb-8">{formatDate(event.delivery_date)}</p>

      {/* Section 1: Order Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Order Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">{fullAddress || '—'}</dd>
          </div>
          <Field label="Recipient" value={`${event.recipient_first_name} ${event.recipient_last_name}`} />
          <Field label="Preferred Delivery Time" value={event.preferred_delivery_time} />
          <Field label="Delivery Notes" value={event.delivery_notes} />
          <Field label="Delivery Date" value={formatDate(event.delivery_date)} />
          <Field label="Budget" value={`$${event.budget}`} />
          <Field label="Total Amount" value={`$${event.total_amount}`} />
          <Field label="Plan Type" value={event.order_type} />
          <Field label="Frequency" value={event.frequency} />
          <Field
            label="Flower Types"
            value={event.preferred_flower_types.length > 0 ? event.preferred_flower_types.join(', ') : null}
          />
          <Field label="Flower Notes" value={event.flower_notes} />
          <div className="sm:col-span-2">
            <Field label="Card Message" value={event.message} />
          </div>
          <Field label="Customer Name" value={`${event.customer_first_name} ${event.customer_last_name}`} />
          <Field label="Customer Email" value={event.customer_email} />
        </dl>
      </div>

      {/* Section 2: Status & Evidence */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Status & Evidence</h2>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-gray-500">Current status:</span>
          <StatusBadge status={event.status} />
        </div>

        {(event.status === 'ordered' || event.status === 'delivered') && event.ordered_at && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Ordered At</p>
            <p className="text-sm text-gray-900">{formatDateTime(event.ordered_at)}</p>
            {event.ordering_evidence_text && (
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3 border border-gray-200">
                {event.ordering_evidence_text}
              </p>
            )}
          </div>
        )}

        {event.status === 'delivered' && event.delivered_at && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Delivered At</p>
            <p className="text-sm text-gray-900">{formatDateTime(event.delivered_at)}</p>
            {event.delivery_evidence_text && (
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3 border border-gray-200">
                {event.delivery_evidence_text}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {event.status === 'scheduled' && (
            <Link
              to={`/dashboard/admin/events/${event.id}/mark-ordered`}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Place Order
            </Link>
          )}
          {event.status === 'ordered' && (
            <Link
              to={`/dashboard/admin/events/${event.id}/mark-delivered`}
              className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
            >
              Confirm Delivery
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetailPage;
