import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminEvent, markEventOrdered } from '@/api/admin';
import type { AdminEvent } from '@/types/AdminEvent';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import FlowBackButton from '@/components/form_flow/FlowBackButton';

function toLocalDatetimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(dtStr: string): string {
  return new Date(dtStr + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const MarkOrderedPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderedAt, setOrderedAt] = useState(toLocalDatetimeInputValue(new Date()));
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
      await markEventOrdered(Number(eventId), {
        ordered_at: orderedAt,
        ordering_evidence_text: evidenceText,
      });
      navigate('/dashboard/admin');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark event as ordered');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const backPath = `/dashboard/admin/events/${eventId}`;
  const description = event
    ? `${event.recipient_first_name} ${event.recipient_last_name} — ${formatDate(event.delivery_date)}`
    : '';

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <Seo title="Mark as Ordered | FutureFlower" />
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSubmit}>
          <UnifiedSummaryCard
            title="Mark as Ordered"
            description={description}
            footer={
              <div className="flex flex-row justify-between items-center w-full gap-4">
                <FlowBackButton to={backPath} />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl text-base font-normal bg-black text-white hover:bg-black/80"
                >
                  {submitting ? 'Saving…' : 'Mark as Ordered'}
                </Button>
              </div>
            }
          >
            <SummarySection label="Ordered At">
              <input
                type="datetime-local"
                className="w-full sm:max-w-sm px-3 py-2 text-sm border border-black/15 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black/20"
                value={orderedAt}
                onChange={(e) => setOrderedAt(e.target.value)}
                required
              />
            </SummarySection>

            <SummarySection label="Order Evidence">
              <textarea
                className="w-full px-3 py-2 text-sm border border-black/15 rounded-lg bg-white placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-black/20 resize-none"
                rows={5}
                placeholder="Paste confirmation number, order details, or any relevant notes here."
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
              />
            </SummarySection>
          </UnifiedSummaryCard>
        </form>
      </div>
    </div>
  );
};

export default MarkOrderedPage;
