import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAdminEvent, markEventDelivered } from '@/api/admin';
import type { AdminEvent } from '@/types/AdminEvent';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

function toLocalDatetimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const MarkDeliveredPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveredAt, setDeliveredAt] = useState(toLocalDatetimeInputValue(new Date()));
  const [evidenceText, setEvidenceText] = useState('');

  useEffect(() => {
    if (!eventId) return;
    getAdminEvent(Number(eventId))
      .then(setEvent)
      .catch(() => toast.error('Failed to load event'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setSubmitting(true);
    try {
      await markEventDelivered(Number(eventId), {
        delivered_at: deliveredAt,
        delivery_evidence_text: evidenceText,
      });
      navigate('/dashboard/admin');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark event as delivered');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Link to={`/dashboard/admin/events/${eventId}`} className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to event
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Delivery</h1>
      {event && (
        <p className="text-gray-500 mb-6">
          {event.recipient_first_name} {event.recipient_last_name} — {event.delivery_date}
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="delivered_at">
            Delivered At
          </label>
          <input
            id="delivered_at"
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={deliveredAt}
            onChange={(e) => setDeliveredAt(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="evidence">
            Delivery Evidence
          </label>
          <textarea
            id="evidence"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={5}
            placeholder="Note any delivery confirmation details."
            value={evidenceText}
            onChange={(e) => setEvidenceText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Confirm Delivery'}
        </button>
      </form>
    </div>
  );
};

export default MarkDeliveredPage;
