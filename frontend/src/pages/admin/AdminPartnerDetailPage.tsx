import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPendingPartners, approvePartner, denyPartner } from '@/api/admin';
import type { AdminPartner } from '@/types/Admin';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

function formatDate(dtStr: string): string {
  return new Date(dtStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || <span className="italic text-gray-400">—</span>}</dd>
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
    getPendingPartners()
      .then((partners) => {
        const found = partners.find((p) => p.id === Number(partnerId));
        if (!found) setError('Partner not found or no longer pending.');
        else setPartner(found);
      })
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
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error || !partner) {
    return <p className="p-8 text-red-600">{error ?? 'Partner not found.'}</p>;
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
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/dashboard/admin')}
        className="text-sm text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {partner.business_name || `${partner.first_name} ${partner.last_name}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isDelivery ? 'Delivery (Florist)' : 'Referral'} · Applied {formatDate(partner.created_at)}
      </p>

      {/* Applicant Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Applicant Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Business Name" value={partner.business_name} />
          <Field label="Partner Type" value={isDelivery ? 'Delivery (Florist)' : 'Referral'} />
          <Field label="First Name" value={partner.first_name} />
          <Field label="Last Name" value={partner.last_name} />
          <Field label="Email" value={partner.email} />
          <Field label="Phone" value={partner.phone} />
        </dl>
      </div>

      {/* Service Area — delivery partners only */}
      {isDelivery && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Service Area</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field label="Address" value={fullAddress} />
            </div>
            <Field label="Service Radius" value={`${partner.service_radius_km} km`} />
            {partner.latitude != null && partner.longitude != null && (
              <Field label="Coordinates" value={`${partner.latitude.toFixed(5)}, ${partner.longitude.toFixed(5)}`} />
            )}
          </dl>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/dashboard/admin')}
          className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={submitting}
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleDeny}
            disabled={submitting}
            className="px-4 py-2 rounded border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
          >
            Deny
          </button>
          <button
            onClick={handleApprove}
            disabled={submitting}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPartnerDetailPage;
