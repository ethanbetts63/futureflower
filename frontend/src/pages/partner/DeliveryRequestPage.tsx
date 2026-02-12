import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MapPin, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import { getDeliveryRequestByToken, respondToDeliveryRequest, markDeliveryComplete } from '@/api/partners';
import type { DeliveryRequestDetail } from '@/types';

const DeliveryRequestPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [request, setRequest] = useState<DeliveryRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchRequest = async () => {
      try {
        const data = await getDeliveryRequestByToken(token);
        setRequest(data);
      } catch (err: any) {
        setError(err.message || 'Delivery request not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequest();
  }, [token]);

  const handleRespond = async (action: 'accept' | 'decline') => {
    if (!token) return;
    setIsResponding(true);
    try {
      await respondToDeliveryRequest(token, action);
      toast.success(action === 'accept' ? 'Delivery accepted!' : 'Delivery declined.');
      const data = await getDeliveryRequestByToken(token);
      setRequest(data);
    } catch (err: any) {
      toast.error('Failed to respond', { description: err.message });
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!token) return;
    setIsResponding(true);
    try {
      await markDeliveryComplete(token);
      toast.success('Marked as delivered!');
      const data = await getDeliveryRequestByToken(token);
      setRequest(data);
    } catch (err: any) {
      toast.error('Failed to mark as delivered', { description: err.message });
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'Not found.'}</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="Delivery Request | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-2xl space-y-6">
          <Card className="bg-white shadow-md border-none text-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Delivery Request</CardTitle>
                <Badge variant="outline" className="text-sm capitalize">{request.status}</Badge>
              </div>
              <CardDescription>Review the delivery details below.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Delivery Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-semibold">{request.delivery_date}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Location</p>
                  <p className="font-semibold">{request.recipient_name}</p>
                  <p className="text-sm">
                    {[request.recipient_suburb, request.recipient_city, request.recipient_state, request.recipient_postcode]
                      .filter(Boolean).join(', ')}
                  </p>
                  <p className="text-sm">{request.recipient_country}</p>
                </div>
              </div>

              {/* Budget */}
              {request.budget && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">${Number(request.budget).toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {request.delivery_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Notes</p>
                  <p className="text-sm mt-1">{request.delivery_notes}</p>
                </div>
              )}

              {/* Message */}
              {request.message && (
                <div>
                  <p className="text-sm text-muted-foreground">Card Message</p>
                  <p className="text-sm mt-1 italic">"{request.message}"</p>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleRespond('accept')}
                    disabled={isResponding}
                  >
                    {isResponding ? <Spinner className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleRespond('decline')}
                    disabled={isResponding}
                  >
                    {isResponding ? <Spinner className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                    Decline
                  </Button>
                </div>
              )}

              {request.status === 'accepted' && request.event_status !== 'delivered' && request.event_status !== 'completed' && (
                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={handleMarkDelivered}
                    disabled={isResponding}
                  >
                    {isResponding ? <Spinner className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Mark as Delivered
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DeliveryRequestPage;
