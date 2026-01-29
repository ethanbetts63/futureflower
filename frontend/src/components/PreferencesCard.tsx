// src/components/PreferencesCard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sprout, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EditButton from '@/components/EditButton';
import type { Color, FlowerType } from '@/types';
import type { PreferencesCardProps } from '@/types/component_props';
import type { UpfrontPlan, SubscriptionPlan, PartialUpfrontPlan, PartialSubscriptionPlan } from '@/types';

type Plan = UpfrontPlan | SubscriptionPlan;
type PartialPlan = PartialUpfrontPlan | PartialSubscriptionPlan;

// Helper component for displaying a single color swatch
const ColorSwatchDisplay: React.FC<{ hex: string; name: string }> = ({ hex, name }) => (
    <div className="flex items-center gap-2">
        <div title={name} className="h-6 w-6 rounded-full border" style={{ backgroundColor: hex }} />
        <span>{name}</span>
    </div>
);

// Helper component for displaying a list of colors
const ColorPreferenceList: React.FC<{ title: string; colorIds: number[]; colorMap: Map<number, Color>; icon: React.ElementType; }> = ({ title, colorIds, colorMap, icon: Icon }) => {
    const colors = useMemo(() =>
        colorIds.map(id => colorMap.get(Number(id))).filter((c): c is Color => !!c),
        [colorIds, colorMap]);

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
            {colors.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {colors.map(color => <ColorSwatchDisplay key={color.id} hex={color.hex_code} name={color.name} />)}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None specified.</p>
            )}
        </div>
    );
};

// Helper component for displaying a list of flower types by name
const FlowerTypePreferenceList: React.FC<{ title: string; typeIds: number[]; typeMap: Map<number, FlowerType>; icon: React.ElementType; variant: 'default' | 'destructive' }> = ({ title, typeIds, typeMap, icon: Icon, variant }) => {
    const types = useMemo(() =>
        typeIds.map(id => typeMap.get(Number(id))).filter((ft): ft is FlowerType => !!ft),
        [typeIds, typeMap]);

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
            {types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {types.map(type => <Badge key={type.id} variant={variant}>{type.name}</Badge>)}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None specified.</p>
            )}
        </div>
    );
};


const PreferencesCard: React.FC<PreferencesCardProps> = ({ plan, colorMap, flowerTypeMap, editUrl }) => {
    return (
        <Card className="bg-white shadow-md border-none text-black">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Your Preferences</CardTitle>
                <EditButton to={editUrl} />
            </CardHeader>
            <CardContent className="space-y-6">
                <ColorPreferenceList title="Preferred Colors" colorIds={plan.preferred_colors} colorMap={colorMap} icon={Palette} />
                <FlowerTypePreferenceList title="Preferred Flower Types" typeIds={plan.preferred_flower_types} typeMap={flowerTypeMap} icon={Sprout} variant="default" />
                <div className="border-t"></div>
                <ColorPreferenceList title="Rejected Colors" colorIds={plan.rejected_colors} colorMap={colorMap} icon={Ban} />
                <FlowerTypePreferenceList title="Rejected Flower Types" typeIds={plan.rejected_flower_types} typeMap={flowerTypeMap} icon={Ban} variant="destructive" />
            </CardContent>
        </Card>
    );
};

export default PreferencesCard;
