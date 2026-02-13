// src/components/DeliveryDatesCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import EditButton from '@/components/EditButton';
import { getProjectedDeliveries } from '@/api';
import type { ProjectedDelivery } from '@/api/upfrontPlans';
import type { DeliveryEvent } from '../types/DeliveryEvent';
import type { DeliveryDatesCardProps } from '../types/DeliveryDatesCardProps';

const DeliveryDatesCard: React.FC<DeliveryDatesCardProps> = ({ plan, editUrl }) => {
    const hasEvents = (plan.events?.length ?? 0) > 0;
    const [projectedDates, setProjectedDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (hasEvents) return;
        setIsLoading(true);
        getProjectedDeliveries(String(plan.id))
            .then((data: ProjectedDelivery[]) => {
                setProjectedDates(data.map(d => d.date));
            })
            .catch(() => setProjectedDates([]))
            .finally(() => setIsLoading(false));
    }, [plan.id, hasEvents]);

    const deliveryDates = hasEvents
        ? plan.events.map((e: DeliveryEvent) => e.delivery_date).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        : projectedDates;

    const formatDate = (dateString: string) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Delivery Schedule
                </CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-4"><Spinner className="h-6 w-6" /></div>
                ) : deliveryDates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {deliveryDates.map((date: string, index: number) => (
                            <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="font-semibold text-gray-600">Delivery {index + 1}</span>
                                <span className="text-gray-800">{formatDate(date)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No delivery dates have been scheduled.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default DeliveryDatesCard;
