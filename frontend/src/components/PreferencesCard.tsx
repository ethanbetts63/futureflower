// src/components/PreferencesCard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EditButton from '@/components/EditButton';
import type { FlowerType } from '../types/FlowerType';
import type { PreferencesCardProps } from '../types/PreferencesCardProps';

// Helper component for displaying a list of vibes/occasions
const FlowerTypePreferenceList: React.FC<{ title: string; typeIds: number[]; typeMap: Map<number, FlowerType>; icon: React.ElementType; }> = ({ title, typeIds, typeMap, icon: Icon }) => {
    const types = useMemo(() =>
        typeIds.map(id => typeMap.get(Number(id))).filter((ft): ft is FlowerType => !!ft),
        [typeIds, typeMap]);

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
            {types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {types.map(type => <Badge key={type.id} variant="default">{type.name}</Badge>)}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None specified.</p>
            )}
        </div>
    );
};


const PreferencesCard: React.FC<PreferencesCardProps> = ({ plan, flowerTypeMap, editUrl }) => {
    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Your Preferences</CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="space-y-6">
                <FlowerTypePreferenceList title="The Vibe" typeIds={plan.preferred_flower_types} typeMap={flowerTypeMap} icon={Sprout} />
                
                {plan.flower_notes && (
                    <div>
                        <h4 className="font-semibold mb-2">Florist Notes</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{plan.flower_notes}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PreferencesCard;
