import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import Seo from '@/components/Seo';
import StripeConnectBanner from '@/components/StripeConnectBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
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
            <div className="space-y-6 px-4 md:px-8 pb-6">
              <div className="flex justify-end -mt-2">
                <Badge className={statusColor}>{partner.status}</Badge>
              </div>

              {/* Stripe Connect Banner */}
              <StripeConnectBanner onboardingComplete={partner.stripe_connect_onboarding_complete} />

              {/* Discount Code */}
              {partner.discount_code && (
                <Card className="bg-white shadow-none md:shadow-md border-none rounded-xl">
                  <CardHeader>
                    <CardTitle>Your Discount Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-mono font-bold tracking-wider">
                      {partner.discount_code.code}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-semibold">${Number(partner.discount_code.discount_amount).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Times Used</p>
                        <p className="font-semibold">{partner.discount_code.total_uses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Discounted</p>
                        <p className="font-semibold">${(partner.discount_code.total_uses * Number(partner.discount_code.discount_amount)).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Earnings Summary */}
              <Card className="bg-white shadow-none md:shadow-md border-none rounded-xl">
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">${Number(partner.commission_summary.total_earned).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">${Number(partner.commission_summary.total_pending).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold text-blue-600">${Number(partner.commission_summary.total_approved).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-green-600">${Number(partner.commission_summary.total_paid).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Summary */}
              <Card className="bg-white shadow-none md:shadow-md border-none rounded-xl">
                <CardHeader>
                  <CardTitle>Payout Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid Out</p>
                      <p className="text-2xl font-bold">${Number(partner.payout_summary.total_paid).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">${Number(partner.payout_summary.total_pending).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Commissions */}
              <Card className="bg-white shadow-none md:shadow-md border-none rounded-xl">
                <CardHeader>
                  <CardTitle>Recent Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {partner.recent_commissions.length === 0 ? (
                    <p className="text-muted-foreground">No commissions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {partner.recent_commissions.map((c) => (
                        <div key={c.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium capitalize">{c.commission_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(c.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${Number(c.amount).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs">{c.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Requests */}
              {partner.partner_type === 'delivery' && (
                <Card className="bg-white shadow-none md:shadow-md border-none rounded-xl">
                  <CardHeader>
                    <CardTitle>Delivery Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {partner.delivery_requests.length === 0 ? (
                      <p className="text-muted-foreground">No delivery requests yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {partner.delivery_requests.map((dr) => (
                          <div
                            key={dr.id}
                            className="flex items-center justify-between border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => navigate(`/partner/delivery-request/${dr.token}`)}
                          >
                            <div>
                              <p className="font-medium">Delivery on {dr.delivery_date}</p>
                              <p className="text-sm text-muted-foreground">
                                Expires: {new Date(dr.expires_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{dr.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </UnifiedSummaryCard>
        </div>
      </div>
    </>
  );
};

export default PartnerDashboardPage;
