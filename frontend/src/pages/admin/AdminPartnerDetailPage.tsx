import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminPartner, approvePartner, denyPartner } from '@/api/admin';
import type { AdminPartner } from '@/types/Admin';
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

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-black/40 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-black">{value || '—'}</p>
  </div>
);

const AdminPartnerDetailPage: React.FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<AdminPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      <Seo title="Partner Application | FutureFlower" />
      <div className="container mx-auto max-w-4xl">
        <UnifiedSummaryCard
          title={partner.business_name || `${partner.first_name} ${partner.last_name}`}
          description={`${isDelivery ? 'Delivery (Florist)' : 'Referral'} · Applied ${formatDate(partner.created_at)}`}
          footer={
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to="/dashboard/admin" />
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
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default AdminPartnerDetailPage;
