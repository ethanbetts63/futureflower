// foreverflower/frontend/src/components/SubscriptionStructureCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Repeat, MessageSquare, Edit } from 'lucide-react';
import type { SubscriptionStructureCardProps } from '../types/SubscriptionStructureCardProps';

const SubscriptionStructureCard: React.FC<SubscriptionStructureCardProps> = ({ plan, editUrl }) => {
    
    const frequencyMap: { [key: string]: string } = {
        'monthly': 'Monthly',
        'quarterly': 'Quarterly',
        'bi-annually': 'Bi-Annually',
        'annually': 'Annually',
    };

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    <CardTitle>Subscription Details</CardTitle>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={editUrl}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4 text-gray-500" /> First Delivery</span>
                    <span>{plan.start_date ? plan.start_date : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center"><Repeat className="mr-2 h-4 w-4 text-gray-500" /> Frequency</span>
                    <span className="capitalize">{plan.frequency ? frequencyMap[plan.frequency] : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-gray-500" /> Message</span>
                </div>
                {plan.subscription_message ? (
                     <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md border">{plan.subscription_message}</p>
                ) : (
                    <p className="text-sm text-gray-500">No message provided.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default SubscriptionStructureCard;