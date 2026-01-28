// src/components/PlanStructureCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestone, Repeat, DollarSign } from 'lucide-react';
import EditButton from '@/components/EditButton';
import type { UpfrontPlan } from '@/api';

interface PlanStructureCardProps {
    plan: UpfrontPlan;
    editUrl: string;
}

const PlanStructureCard: React.FC<PlanStructureCardProps> = ({ plan, editUrl }) => {
    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Plan Structure</CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                    <Milestone className="h-8 w-8 mb-2 text-green-500" />
                    <p className="font-bold text-2xl">{plan.years}</p>
                    <p className="text-black">{plan.years > 1 ? 'Years' : 'Year'}</p>
                </div>
                <div className="flex flex-col items-center">
                    <Repeat className="h-8 w-8 mb-2 text-green-500" />
                    <p className="font-bold text-2xl">{plan.deliveries_per_year}</p>
                    <p className="text-black">Deliveries per Year</p>
                </div>
                <div className="flex flex-col items-center">
                    <DollarSign className="h-8 w-8 mb-2 text-green-500" />
                    <p className="font-bold text-2xl">${Number(plan.budget).toFixed(2)}</p>
                    <p className="text-black">Budget per Bouquet</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlanStructureCard;
