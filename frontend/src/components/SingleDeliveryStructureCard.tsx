// futureflower/frontend/src/components/SingleDeliveryStructureCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, MessageSquare, StickyNote } from 'lucide-react';
import EditButton from '@/components/EditButton';
import { formatDate } from '@/utils/utils';
import type { SingleDeliveryStructureCardProps } from '../types/SingleDeliveryStructureCardProps';

const SingleDeliveryStructureCard: React.FC<SingleDeliveryStructureCardProps> = ({ plan, editUrl }) => {
    // For a single delivery, the message is the first entry in draft_card_messages (index "0")
    const draftMessage = plan.draft_card_messages?.['0'] || '';
    // Post-payment fallback: if events exist, use the first event's message
    const eventMessage = plan.events?.[0]?.message || '';
    const message = draftMessage || eventMessage;

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    <CardTitle>Delivery Details</CardTitle>
                </div>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4 text-gray-500" /> Delivery Date</span>
                    <span>{formatDate(plan.start_date)}</span>
                </div>
                {plan.delivery_notes && (
                    <div>
                        <span className="font-medium flex items-center"><StickyNote className="mr-2 h-4 w-4 text-gray-500" /> Delivery Notes</span>
                        <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md border mt-1">{plan.delivery_notes}</p>
                    </div>
                )}
                {message && (
                    <div>
                        <span className="font-medium flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-gray-500" /> Card Message</span>
                        <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md border mt-1">{message}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SingleDeliveryStructureCard;
