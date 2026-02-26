import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import Seo from '@/components/Seo';
import StripeConnectBanner from '@/components/StripeConnectBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import { getPartnerDashboard } from '@/api/partners';
import type { Partner } from '@/types';
import { useNavigate } from 'react-router-dom';

const PartnerDashboardPage: React.FC = () => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getPartnerDashboard();
        setPartner(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'Partner account not found.'}</p>
      </div>
    );
  }

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
  }[partner.status];

  return (
    <>
      <Seo title="Partner Dashboard | FutureFlower" />
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <UnifiedSummaryCard
            title={partner.business_name || 'Partner Dashboard'}
            description={partner.partner_type === 'delivery' ? 'Delivery Partner' : 'Referral Partner'}
          >
            <StripeConnectBanner onboardingComplete={partner.stripe_connect_onboarding_complete} />

            <SummarySection label="Account Status">
              <div className="flex items-center gap-3">
                <Badge className={statusColor}>{partner.status}</Badge>
              </div>
            </SummarySection>

            {/* Discount Code */}
            {partner.discount_code && (
              <SummarySection label="Your Discount Code">
                <div className="text-3xl font-mono font-bold tracking-wider text-black">
                  {partner.discount_code.code}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                  <div>
                    <p className="text-black/40">Discount</p>
                    <p className="font-semibold text-black">${Number(partner.discount_code.discount_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-black/40">Times Used</p>
                    <p className="font-semibold text-black">{partner.discount_code.total_uses}</p>
                  </div>
                  <div>
                    <p className="text-black/40">Total Discounted</p>
                    <p className="font-semibold text-black">${(partner.discount_code.total_uses * Number(partner.discount_code.discount_amount)).toFixed(2)}</p>
                  </div>
                </div>
              </SummarySection>
            )}

            {/* Earnings Summary */}
            <SummarySection label="Earnings Summary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-black/40">Total Earned</p>
                  <p className="text-2xl font-bold text-black">${Number(partner.commission_summary.total_earned).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-black/40">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${Number(partner.commission_summary.total_pending).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-black/40">Approved</p>
                  <p className="text-2xl font-bold text-blue-600">${Number(partner.commission_summary.total_approved).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-black/40">Paid</p>
                  <p className="text-2xl font-bold text-green-600">${Number(partner.commission_summary.total_paid).toFixed(2)}</p>
                </div>
              </div>
            </SummarySection>

            {/* Payout Summary */}
            <SummarySection label="Payout Summary">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black/40">Total Paid Out</p>
                  <p className="text-2xl font-bold text-black">${Number(partner.payout_summary.total_paid).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-black/40">Pending</p>
                  <p className="text-2xl font-bold text-black">${Number(partner.payout_summary.total_pending).toFixed(2)}</p>
                </div>
              </div>
            </SummarySection>

            {/* Recent Commissions */}
            <SummarySection label="Recent Commissions">
              {partner.recent_commissions.length === 0 ? (
                <p className="text-black/40">No commissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {partner.recent_commissions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between border-b border-black/5 pb-2 last:border-0">
                      <div>
                        <p className="font-medium capitalize text-black">{c.commission_type}</p>
                        <p className="text-sm text-black/40">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">${Number(c.amount).toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs text-black bg-green-400">{c.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SummarySection>

            {/* Delivery Requests */}
            {partner.partner_type === 'delivery' && (
              <SummarySection label="Delivery Requests">
                {partner.delivery_requests.length === 0 ? (
                  <p className="text-black/40">No delivery requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {partner.delivery_requests.map((dr) => (
                      <div
                        key={dr.id}
                        className="flex items-center justify-between border-b border-black/5 pb-2 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => navigate(`/partner/delivery-request/${dr.token}`)}
                      >
                        <div>
                          <p className="font-medium text-black">Delivery on {dr.delivery_date}</p>
                          <p className="text-sm text-black/40">
                            Expires: {new Date(dr.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{dr.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </SummarySection>
            )}
          </UnifiedSummaryCard>
        </div>
      </div>
    </>
  );
};

export default PartnerDashboardPage;
