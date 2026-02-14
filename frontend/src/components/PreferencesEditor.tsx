// futureflower/frontend/src/components/PreferencesEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getFlowerTypes } from '@/api';
import type { FlowerType } from '../types/FlowerType';

import { VibePicker } from '@/components/VibePicker';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import BackButton from '@/components/BackButton';
import type { PreferencesEditorProps } from '../types/PreferencesEditorProps';

const PreferencesEditor: React.FC<PreferencesEditorProps> = ({
    mode,
    title,
    description,
    saveButtonText,
    onSaveNavigateTo,
    backPath,
    showSkipButton,
    getPlan,
    updatePlan,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Data fetching state
    const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Selection state
    const [selectedVibe, setSelectedVibe] = useState<number | null>(null);
    const [flowerNotes, setFlowerNotes] = useState<string>('');

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage preferences.");
            navigate('/login');
            return;
        }
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
                    setSelectedVibe(ids.length > 0 ? ids[0] : null);
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
    }, [isAuthenticated, navigate, planId, getPlan]);
    
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

    const handleSkip = () => {
        toast.info("You can add preferences later from your dashboard.");
        navigate(onSaveNavigateTo);
    }

    if (!isAuthenticated) return null;
    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-12">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                         <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl">{title}</CardTitle>
                                <CardDescription className="text-black">
                                    {description}
                                </CardDescription>
                            </div>
                            {showSkipButton && (
                                <Button variant="destructive" onClick={handleSkip} className="bg-transparent text-red-500 hover:bg-red-50 ml-4">
                                    Skip for Now
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <VibePicker
                            vibes={flowerTypes}
                            selected={selectedVibe}
                            onSelect={setSelectedVibe}
                        />

                        <Separator />

                        {/* Florist Notes Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Anything else the florist should know?</h3>
                            <p className="text-sm text-gray-600 mb-4">Favourite colours, dislikes, allergies — anything that helps them get it right.</p>
                            <Textarea
                                placeholder="She loves peonies but hates lilies. Keep it soft and pastel."
                                value={flowerNotes}
                                onChange={(e) => setFlowerNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath} variant="ghost" />
                        <Button size="lg" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : saveButtonText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PreferencesEditor;
