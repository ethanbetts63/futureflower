// src/components/RecipientCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Home } from 'lucide-react';
import EditButton from '@/components/EditButton';
import type { RecipientCardProps } from '../../types/RecipientCardProps';

const RecipientCard: React.FC<RecipientCardProps> = ({ plan, editUrl }) => {
    const fullAddress = [plan.recipient_street_address, plan.recipient_suburb, plan.recipient_city, plan.recipient_state, plan.recipient_postcode, plan.recipient_country].filter(Boolean).join(', ');

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Recipient Details</CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="font-semibold text-lg">{plan.recipient_first_name} {plan.recipient_last_name}</p>
                {fullAddress ? (
                    <p className="text-muted-foreground flex items-center"><Home className="mr-2 h-4 w-4" /> {fullAddress}</p>
                ) : (
                    <p className="text-sm text-muted-foreground">No recipient details provided yet.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default RecipientCard;
