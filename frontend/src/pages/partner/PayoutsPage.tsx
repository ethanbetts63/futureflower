import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
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
      <div className="w-full space-y-6">
          <BackButton to="/dashboard/partner" />
          <Card className="bg-white shadow-md border-none text-black">
            <CardHeader>
              <CardTitle className="text-2xl">Payout History</CardTitle>
            </CardHeader>
            <CardContent>
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
    </>
  );
};

export default PayoutsPage;
