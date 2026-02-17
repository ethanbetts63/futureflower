// src/components/NextDeliveryCard.tsx
import React from 'react';
import { Calendar, Hash, User, MapPin } from 'lucide-react';

import type { NextDeliveryCardProps } from '../types/NextDeliveryCardProps';

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
            <p className="text-black/40">You have no upcoming deliveries scheduled.</p>
        );
    }

    const { plan, event, deliveryIndex } = deliveryInfo;
    const fullAddress = `${plan.recipient_street_address}${plan.recipient_suburb ? `, ${plan.recipient_suburb}` : ''}, ${plan.recipient_city}, ${plan.recipient_state} ${plan.recipient_postcode}`;

    return (
        <div className="space-y-4 text-sm text-black">
            <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-3 mt-1 text-black/20 flex-shrink-0" />
                <span className="font-semibold">{formatDate(event.delivery_date)}</span>
            </div>
            <div className="flex items-start">
                <Hash className="h-4 w-4 mr-3 mt-1 text-black/20 flex-shrink-0" />
                <span>Delivery {deliveryIndex} of {plan.events.length}</span>
            </div>
            <div className="flex items-start">
                <User className="h-4 w-4 mr-3 mt-1 text-black/20 flex-shrink-0" />
                <span>{`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim()}</span>
            </div>
            <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-1 text-black/20 flex-shrink-0" />
                <span>{fullAddress}</span>
            </div>
        </div>
    );
};

export default NextDeliveryCard;
