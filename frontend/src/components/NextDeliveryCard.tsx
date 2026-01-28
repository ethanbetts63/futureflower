// src/components/NextDeliveryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Calendar, Hash, User, MapPin } from 'lucide-react';
import type { UpfrontPlan } from '@/types';
import type { Event as PlanEvent } from '@/types';

export interface NextDeliveryInfo {
    plan: UpfrontPlan;
    event: PlanEvent;
    deliveryIndex: number;
}

interface NextDeliveryCardProps {
    deliveryInfo: NextDeliveryInfo | null;
}

const NextDeliveryCard: React.FC<NextDeliveryCardProps> = ({ deliveryInfo }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!deliveryInfo) {
        return (
            <Card className="bg-white shadow-md border-none text-black">
                <CardHeader>
                    <CardTitle className="flex items-center text-xl font-semibold">
                        <Truck className="mr-3 h-6 w-6" />
                        Your Next Delivery
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You have no upcoming deliveries scheduled.</p>
                </CardContent>
            </Card>
        );
    }
    
    const { plan, event, deliveryIndex } = deliveryInfo;
    const fullAddress = `${plan.recipient_street_address}${plan.recipient_suburb ? `, ${plan.recipient_suburb}` : ''}, ${plan.recipient_city}, ${plan.recipient_state} ${plan.recipient_postcode}`;

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold">
                    <Truck className="mr-3 h-6 w-6" />
                    Your Next Delivery
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                    <span className="font-semibold">{formatDate(event.delivery_date)}</span>
                </div>
                <div className="flex items-start">
                    <Hash className="h-4 w-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                    <span>Delivery {deliveryIndex} of {plan.events.length}</span>
                </div>
                <div className="flex items-start">
                    <User className="h-4 w-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                    <span>{`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim()}</span>
                </div>
                <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                    <span>{fullAddress}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default NextDeliveryCard;
