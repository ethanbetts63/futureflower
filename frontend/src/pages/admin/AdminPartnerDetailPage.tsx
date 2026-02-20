import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminPartner, approvePartner, denyPartner, payCommission } from '@/api/admin';
import type { AdminPartner } from '@/types/AdminPartner';
import type { AdminCommission } from '@/types/AdminCommission';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import { Button } from '@/components/ui/button';

function formatDate(dtStr: string): string {
  return new Date(dtStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatAmount(amount: string): string {
  return `$${parseFloat(amount).toFixed(2)}`;
}

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-black/40 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-black">{value || '—'}</p>
  </div>
);

const StatusBadge: React.FC<{ status: AdminCommission['status'] }> = ({ status }) => {
  const colours: Record<AdminCommission['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colours[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminPartnerDetailPage: React.FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<AdminPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) return;
    getAdminPartner(Number(partnerId))
      .then(setPartner)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [partnerId]);

  async function handleApprove() {
    if (!partner) return;
    setSubmitting(true);
    try {
      await approvePartner(partner.id);
      toast.success(`${partner.business_name || partner.first_name} approved.`);
      navigate('/dashboard/admin');
    } catch {
      toast.error('Failed to approve partner.');
      setSubmitting(false);
    }
  }

  async function handleDeny() {
    if (!partner) return;
    setSubmitting(true);
    try {
      await denyPartner(partner.id);
      toast.success(`${partner.business_name || partner.first_name} denied.`);
      navigate('/dashboard/admin');
    } catch {
      toast.error('Failed to deny partner.');
      setSubmitting(false);
    }
  }

  async function handlePay(commission: AdminCommission) {
    if (!partner) return;
    setPayingId(commission.id);
    try {
      await payCommission(partner.id, commission.id);
      toast.success(`Paid ${formatAmount(commission.amount)} to ${partner.business_name || partner.first_name}.`);
      // Refresh partner data
      const updated = await getAdminPartner(partner.id);
      setPartner(updated);
    } catch (e: any) {
      toast.error(e.message || 'Failed to pay commission.');
    } finally {
      setPayingId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="p-8 text-red-600">{error ?? 'Partner not found.'}</p>
        </div>
      </div>
    );
  }

  const isDelivery = partner.partner_type === 'delivery';
  const isPending = partner.status === 'pending';
  const commissions = partner.commissions ?? [];
  const fullAddress = [
    partner.street_address,
    partner.suburb,
    partner.city,
    partner.state,
    partner.postcode,
    partner.country,
  ].filter(Boolean).join(', ');

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <Seo title="Partner Detail | FutureFlower" />
      <div className="container mx-auto max-w-4xl">
        <UnifiedSummaryCard
          title={partner.business_name || `${partner.first_name} ${partner.last_name}`}
          description={`${isDelivery ? 'Delivery (Florist)' : 'Referral'} · Applied ${formatDate(partner.created_at)}`}
          footer={
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to="/dashboard/admin" />
              {isPending && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleDeny}
                    disabled={submitting}
                    variant="outline"
                    className="px-6 py-3 rounded-xl text-base font-normal border-black/20 text-black/60 hover:bg-black/5 hover:text-black"
                  >
                    Deny
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl text-base font-normal bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          }
        >
          <SummarySection label="Applicant">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Business Name" value={partner.business_name} />
              <Field label="Partner Type" value={isDelivery ? 'Delivery (Florist)' : 'Referral'} />
              <Field label="First Name" value={partner.first_name} />
              <Field label="Last Name" value={partner.last_name} />
              <Field label="Email" value={partner.email} />
              <Field label="Phone" value={partner.phone} />
              <Field label="Status" value={partner.status.charAt(0).toUpperCase() + partner.status.slice(1)} />
              <Field
                label="Stripe Onboarding"
                value={partner.stripe_connect_onboarding_complete ? 'Complete' : 'Incomplete'}
              />
            </div>
          </SummarySection>

          {isDelivery && (
            <SummarySection label="Service Area">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Address" value={fullAddress} />
                </div>
                <Field label="Service Radius" value={`${partner.service_radius_km} km`} />
                {partner.latitude != null && partner.longitude != null && (
                  <Field label="Coordinates" value={`${partner.latitude.toFixed(5)}, ${partner.longitude.toFixed(5)}`} />
                )}
              </div>
            </SummarySection>
          )}

          <SummarySection label="Commissions & Payouts">
            {commissions.length === 0 ? (
              <p className="text-sm text-black/40">No commissions yet.</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-2 text-xs text-black/40 uppercase tracking-wider pb-1 border-b border-black/5">
                  <span>Type</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span></span>
                </div>
                {commissions.map((c) => (
                  <div key={c.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center py-1.5 border-b border-black/5 last:border-0">
                    <div>
                      <p className="text-sm text-black">
                        {c.commission_type === 'fulfillment' ? 'Delivery Payment' : 'Commission'}
                      </p>
                      <p className="text-xs text-black/40">{formatDate(c.created_at)}</p>
                      {c.event && (
                        <Link
                          to={`/dashboard/admin/events/${c.event}`}
                          className="text-xs text-black/40 underline hover:text-black"
                        >
                          View event
                        </Link>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">{formatAmount(c.amount)}</span>
                    <StatusBadge status={c.status} />
                    {c.status !== 'paid' ? (
                      <Button
                        size="sm"
                        disabled={payingId === c.id || !partner.stripe_connect_onboarding_complete}
                        onClick={() => handlePay(c)}
                        title={!partner.stripe_connect_onboarding_complete ? 'Partner has not completed Stripe onboarding' : undefined}
                      >
                        {payingId === c.id ? <Spinner className="h-3 w-3" /> : 'Pay Out'}
                      </Button>
                    ) : (
                      <span className="text-xs text-black/30">—</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SummarySection>
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default AdminPartnerDetailPage;
