// frontend/src/components/SingleDeliveryStructureCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageSquare, DollarSign } from 'lucide-react';
import EditButton from '@/components/EditButton';
import type { SingleDeliveryStructureCardProps } from '../types/SingleDeliveryStructureCardProps';
import { format, parseISO } from 'date-fns';

const SingleDeliveryStructureCard: React.FC<SingleDeliveryStructureCardProps> = ({ plan, editUrl }) => {
    const deliveryDate = plan.start_date ? format(parseISO(plan.start_date), 'do MMMM yyyy') : 'Not set';

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Delivery Details</CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center">
                    <DollarSign className="h-6 w-6 mr-4 text-green-500" />
                    <div>
                        <p className="font-bold text-lg">${Number(plan.budget).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Bouquet Budget</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar className="h-6 w-6 mr-4 text-green-500" />
                    <div>
                        <p className="font-bold text-lg">{deliveryDate}</p>
                        <p className="text-sm text-muted-foreground">Delivery Date</p>
                    </div>
                </div>
                {plan.notes && (
                    <div className="flex items-start">
                        <MessageSquare className="h-6 w-6 mr-4 mt-1 text-green-500" />
                        <div>
                            <p className="font-bold text-lg">Message</p>
                            <p className="text-sm text-muted-foreground italic">"{plan.notes}"</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SingleDeliveryStructureCard;
