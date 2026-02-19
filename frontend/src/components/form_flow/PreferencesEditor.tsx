// futureflower/frontend/src/components/PreferencesEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getFlowerTypes } from '@/api';
import type { FlowerType } from '../../types/FlowerType';

import { VibePicker } from '@/components/form_flow/VibePicker';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { PreferencesEditorProps } from '../../types/PreferencesEditorProps';

const PreferencesEditor: React.FC<PreferencesEditorProps> = ({
    mode,
    title = "The Florist's Brief",
    saveButtonText,
    onSaveNavigateTo,
    backPath,
    getPlan,
    updatePlan,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();

    // Data fetching state
    const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Selection state
    const [selectedVibe, setSelectedVibe] = useState<number | null>(null);
    const [flowerNotes, setFlowerNotes] = useState<string>('');

    useEffect(() => {
        if (!planId) {
            toast.error("No plan specified.");
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [flowerTypesData, planData] = await Promise.all([
                    getFlowerTypes(),
                    getPlan(planId), 
                ]);
                
                setFlowerTypes(flowerTypesData);

                if (planData) {
                    const ids = planData.preferred_flower_types.map(Number);
                    let initialVibe = ids.length > 0 ? ids[0] : null;

                    // If no preferred flower types from the plan, and flower types are available,
                    // default to the first available flower type.
                    if (initialVibe === null && flowerTypesData.length > 0) {
                        initialVibe = flowerTypesData[0].id;
                    }
                    
                    setSelectedVibe(initialVibe);
                    setFlowerNotes(planData.flower_notes || '');
                }

            } catch (err) {
                setError("Failed to load preference options. Please try again later.");
                toast.error("Failed to load preference options.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate, planId, getPlan]);
    
    const handleSave = async () => {
        if (!planId) return;
        setIsSaving(true);
        try {
            await updatePlan(planId, {
                preferred_flower_types: selectedVibe !== null ? [selectedVibe] : [],
                flower_notes: flowerNotes,
            });
            if (mode === 'edit') {
                toast.success("Preferences saved successfully!");
            }
            navigate(onSaveNavigateTo.replace('{planId}', planId)); 
        } catch (err) {
            toast.error("Failed to save preferences. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8">
                        <VibePicker
                            vibes={flowerTypes}
                            selected={selectedVibe}
                            onSelect={setSelectedVibe}
                        />

                        <Separator />

                        {/* Florist Notes Section */}
                        <div className="pb-4">
                            <h3 className="text-xl font-semibold mb-2">Anything else the florist should know? (optional)</h3>
                            <p className="text-sm text-gray-600 mb-4">Favourite colours, dislikes, allergies — anything that helps them get it right.</p>
                            <Textarea
                                placeholder="She loves peonies but hates lilies. Keep it soft and pastel."
                                value={flowerNotes}
                                onChange={(e) => setFlowerNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <FlowBackButton to={backPath} />
                        <FlowNextButton 
                            label={saveButtonText} 
                            onClick={handleSave} 
                            isLoading={isSaving}
                            disabled={selectedVibe === null}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PreferencesEditor;
