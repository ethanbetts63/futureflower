import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { getPayouts } from '@/api/partners';
import type { Payout } from '@/types';

const PayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const data = await getPayouts();
        setPayouts(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <Seo title="Payouts | FutureFlower" />
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
            <CardHeader className="px-4 md:px-8">
              <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">Payout History</CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-8">
              {payouts.length === 0 ? (
                <p className="text-muted-foreground">No payouts yet.</p>
              ) : (
                <div className="space-y-3">
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => navigate(`/dashboard/partner/payouts/${p.id}`)}
                    >
                      <div>
                        <p className="font-medium capitalize">{p.payout_type} Payout</p>
                        <p className="text-sm text-muted-foreground">
                          {p.period_start} — {p.period_end}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${Number(p.amount).toFixed(2)} {p.currency}</p>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
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

export default PayoutsPage;
