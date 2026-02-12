// futureflower/frontend/src/components/SingleDeliveryStructureCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Edit, MessageSquare } from 'lucide-react';
import type { SingleDeliveryStructureCardProps } from '../types/SingleDeliveryStructureCardProps';

const SingleDeliveryStructureCard: React.FC<SingleDeliveryStructureCardProps> = ({ plan, editUrl }) => {
    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    <CardTitle>Delivery Details</CardTitle>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={editUrl}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {plan.events.map(event => (
                    <div key={event.id}>
                        <div className="flex justify-between items-center">
                            <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4 text-gray-500" /> Delivery Date</span>
                            <span>{event.delivery_date}</span>
                        </div>
                        {event.message && (
                            <div className="mt-2">
                                <span className="font-medium flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-gray-500" /> Message</span>
                                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md border">{event.message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default SingleDeliveryStructureCard;
