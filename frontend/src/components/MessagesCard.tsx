// src/components/MessagesCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText, Repeat } from 'lucide-react';
import EditButton from '@/components/EditButton';
import type { UpfrontPlan, DeliveryEvent, SubscriptionPlan } from '@/types';
import type { MessagesCardProps } from '@/types/components';



const MessagesCard: React.FC<MessagesCardProps> = ({ plan, editUrl }) => {
    // Get a list of all non-empty messages
    const allMessages = plan.events?.map((e: DeliveryEvent) => e.message).filter((m: string): m is string => !!m) || [];
    const uniqueMessages = new Set(allMessages);

    const hasMessages = allMessages.length > 0;
    const isSingleMessageForAll = hasMessages && uniqueMessages.size === 1;

    const renderContent = () => {
        if (!hasMessages) {
            return <p className="text-sm text-muted-foreground">No custom messages were added.</p>;
        }

        if (isSingleMessageForAll) {
            const singleMessage: string = Array.from(uniqueMessages)[0] || '';
            return (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-sm text-gray-800 flex items-center mb-2">
                        <Repeat className="mr-2 h-4 w-4" />
                        One message for all deliveries
                    </p>
                    <p className="mt-1 text-gray-600 italic">"{singleMessage}"</p>
                </div>
            );
        }

        // Default case: multiple different messages
        return (
            <ul className="space-y-4">
                {plan.events.filter((e: DeliveryEvent) => e.message).map((event: DeliveryEvent) => (
                    <li key={event.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm text-gray-800">
                            Delivery on {new Date(event.delivery_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="mt-1 text-gray-600 italic">"{event.message}"</p>
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

