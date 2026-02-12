import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Seo from '@/components/Seo';
import StripeConnectBanner from '@/components/StripeConnectBanner';
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
      <Seo title="Partner Dashboard | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {/* Header */}
          <Card className="bg-white shadow-md border-none text-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">{partner.business_name || 'Partner Dashboard'}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {partner.partner_type === 'delivery' ? 'Delivery Partner' : 'Referral Partner'}
                  </p>
                </div>
                <Badge className={statusColor}>{partner.status}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Stripe Connect Banner */}
          <StripeConnectBanner onboardingComplete={partner.stripe_connect_onboarding_complete} />

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              {partner.partner_type === 'delivery' && (
                <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              )}
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Discount Code Card */}
              {partner.discount_code && (
                <Card className="bg-white shadow-md border-none text-black">
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
                        <p className="font-semibold">${partner.discount_code.discount_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Times Used</p>
                        <p className="font-semibold">{partner.discount_code.total_uses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Discounted</p>
                        <p className="font-semibold">${partner.discount_code.total_discount_given.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Commission Summary */}
              <Card className="bg-white shadow-md border-none text-black">
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">${partner.commission_summary.total_earned.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">${partner.commission_summary.total_pending.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold text-blue-600">${partner.commission_summary.total_approved.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-green-600">${partner.commission_summary.total_paid.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Summary */}
              <Card className="bg-white shadow-md border-none text-black">
                <CardHeader>
                  <CardTitle>Payout Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid Out</p>
                      <p className="text-2xl font-bold">${partner.payout_summary.total_paid_out.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Payouts</p>
                      <p className="text-2xl font-bold">{partner.payout_summary.total_payouts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commissions Tab */}
            <TabsContent value="commissions">
              <Card className="bg-white shadow-md border-none text-black">
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
            </TabsContent>

            {/* Deliveries Tab */}
            {partner.partner_type === 'delivery' && (
              <TabsContent value="deliveries">
                <Card className="bg-white shadow-md border-none text-black">
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
                              <p className="font-medium">Delivery on {dr.event_delivery_date}</p>
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
              </TabsContent>
            )}

            {/* Payouts Tab */}
            <TabsContent value="payouts">
              <Card className="bg-white shadow-md border-none text-black">
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View detailed payout history on the{' '}
                    <a href="/partner/payouts" className="text-blue-600 underline">Payouts page</a>.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PartnerDashboardPage;
