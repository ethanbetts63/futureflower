// src/components/MessagesCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText, Repeat } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import EditButton from '@/components/EditButton';
import { getProjectedDeliveries } from '@/api';
import type { ProjectedDelivery } from '@/api/upfrontPlans';
import type { DeliveryEvent } from '../types/DeliveryEvent';
import type { MessagesCardProps } from '../types/MessagesCardProps';

const MessagesCard: React.FC<MessagesCardProps> = ({ plan, editUrl }) => {
    const hasEvents = (plan.events?.length ?? 0) > 0;
    const [projectedDeliveries, setProjectedDeliveries] = useState<ProjectedDelivery[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch projected deliveries for pre-payment display of per-delivery messages
    useEffect(() => {
        if (hasEvents) return;
        const draft = plan.draft_card_messages || {};
        const values = Object.values(draft).filter(Boolean);
        const unique = new Set(values);
        // Only need projected dates if we have multiple different messages
        if (unique.size <= 1) return;

        setIsLoading(true);
        getProjectedDeliveries(String(plan.id))
            .then(setProjectedDeliveries)
            .catch(() => setProjectedDeliveries([]))
            .finally(() => setIsLoading(false));
    }, [plan.id, hasEvents, plan.draft_card_messages]);

    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderContent = () => {
        if (hasEvents) {
            // Post-payment: read from events
            const allMessages = plan.events.map((e: DeliveryEvent) => e.message).filter(Boolean);
            const uniqueMessages = new Set(allMessages);

            if (allMessages.length === 0) {
                return <p className="text-sm text-muted-foreground">No custom messages were added.</p>;
            }

            if (uniqueMessages.size === 1) {
                return (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm text-gray-800 flex items-center mb-2">
                            <Repeat className="mr-2 h-4 w-4" />
                            One message for all deliveries
                        </p>
                        <p className="mt-1 text-gray-600 italic">"{Array.from(uniqueMessages)[0]}"</p>
                    </div>
                );
            }

            return (
                <ul className="space-y-4">
                    {plan.events.filter((e: DeliveryEvent) => e.message).map((event: DeliveryEvent) => (
                        <li key={event.id} className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm text-gray-800">
                                Delivery on {formatDate(event.delivery_date)}
                            </p>
                            <p className="mt-1 text-gray-600 italic">"{event.message}"</p>
                        </li>
                    ))}
                </ul>
            );
        }

        // Pre-payment: read from draft_card_messages
        const draft = plan.draft_card_messages || {};
        const values = Object.values(draft).filter(Boolean);

        if (values.length === 0) {
            return <p className="text-sm text-muted-foreground">No custom messages were added.</p>;
        }

        const uniqueValues = new Set(values);

        if (uniqueValues.size === 1) {
            return (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-sm text-gray-800 flex items-center mb-2">
                        <Repeat className="mr-2 h-4 w-4" />
                        One message for all deliveries
                    </p>
                    <p className="mt-1 text-gray-600 italic">"{Array.from(uniqueValues)[0]}"</p>
                </div>
            );
        }

        if (isLoading) {
            return <div className="flex justify-center py-4"><Spinner className="h-6 w-6" /></div>;
        }

        // Multiple different messages — show each with its projected date
        return (
            <ul className="space-y-4">
                {projectedDeliveries
                    .filter(d => draft[String(d.index)])
                    .map(d => (
                        <li key={d.index} className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm text-gray-800">
                                Delivery on {formatDate(d.date)}
                            </p>
                            <p className="mt-1 text-gray-600 italic">"{draft[String(d.index)]}"</p>
                        </li>
                    ))}
            </ul>
        );
    };

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center">
                    <MessageSquareText className="mr-2 h-5 w-5" />
                    Custom Messages
                </CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default MessagesCard;
