import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import { getPayoutDetail } from '@/api/partners';
import type { PayoutDetail } from '@/types';

const PayoutDetailPage: React.FC = () => {
  const { payoutId } = useParams<{ payoutId: string }>();
  const [payout, setPayout] = useState<PayoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!payoutId) return;
    const fetchPayout = async () => {
      try {
        const data = await getPayoutDetail(Number(payoutId));
        setPayout(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayout();
  }, [payoutId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Payout not found.</p>
      </div>
    );
  }

  return (
    <>
      <Seo title={`Payout #${payout.id} | FutureFlower`} />
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <BackButton to="/dashboard/partner/payouts" />

          <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
            <CardHeader className="px-4 md:px-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif] capitalize">{payout.payout_type} Payout</CardTitle>
                <Badge variant="outline">{payout.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold">${Number(payout.amount).toFixed(2)} {payout.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="font-medium">{payout.period_start} — {payout.period_end}</p>
                </div>
              </div>

              {payout.note && (
                <div>
                  <p className="text-sm text-muted-foreground">Note</p>
                  <p className="text-sm">{payout.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
            <CardHeader className="px-4 md:px-8">
              <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-8">
              {payout.line_items.length === 0 ? (
                <p className="text-muted-foreground">No line items.</p>
              ) : (
                <div className="space-y-2">
                  {payout.line_items.map((li) => (
                    <div key={li.id} className="flex items-center justify-between border-b pb-2">
                      <p className="text-sm">{li.description}</p>
                      <p className="font-medium">${Number(li.amount).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PayoutDetailPage;
