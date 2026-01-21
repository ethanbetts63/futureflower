// foreverflower/frontend/src/pages/flow/PreferenceSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getColors, getFlowerTypes, updateFlowerPlan } from '@/api';
import type { Color, FlowerType } from '@/api';
import { ColorSwatch, SelectableTag } from '@/components/preferences';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Data fetching state
    const [colors, setColors] = useState<Color[]>([]);
    const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Selection state
    const [preferredColors, setPreferredColors] = useState<number[]>([]);
    const [rejectedColors, setRejectedColors] = useState<number[]>([]);
    const [preferredFlowerTypes, setPreferredFlowerTypes] = useState<number[]>([]);
    const [rejectedFlowerTypes, setRejectedFlowerTypes] = useState<number[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage preferences.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No flower plan specified.");
            navigate('/book-flow');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [colorsData, flowerTypesData] = await Promise.all([
                    getColors(),
                    getFlowerTypes()
                ]);
                setColors(colorsData);
                setFlowerTypes(flowerTypesData);
            } catch (err) {
                setError("Failed to load preference options. Please try again later.");
                toast.error("Failed to load preference options.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate, planId]);
    
    const handleToggle = (id: number, setList: React.Dispatch<React.SetStateAction<number[]>>, otherList: number[], setOtherList: React.Dispatch<React.SetStateAction<number[]>>) => {
        // If it's in the other list, remove it from there first
        if (otherList.includes(id)) {
            setOtherList(prev => prev.filter(itemId => itemId !== id));
        }
        // Then toggle it in the current list
        setList(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (!planId) return;
        setIsSaving(true);
        try {
            await updateFlowerPlan(planId, {
                preferred_colors: preferredColors,
                rejected_colors: rejectedColors,
                preferred_flower_types: preferredFlowerTypes,
                rejected_flower_types: rejectedFlowerTypes,
            });
            toast.success("Preferences saved!");
            navigate(`/book-flow/flower-plan/${planId}/add-message`); 
        } catch (err) {
            toast.error("Failed to save preferences. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSkip = () => {
        toast.info("You can add preferences later from your dashboard.");
        navigate(`/book-flow/flower-plan/${planId}/add-message`);
    }

    const handleBack = () => {
        navigate(-1);
    };

    if (!isAuthenticated) return null; // Redirecting
    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-12">
                <Seo title="Select Preferences | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                         <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl">Add Your Preferences (Optional)</CardTitle>
                                <CardDescription className="text-black">
                                    Let us know what you love and what you don't. This helps our florists create bouquets you'll adore.
                                </CardDescription>
                            </div>
                             <Button variant="destructive" onClick={handleSkip} className="bg-transparent text-red-500 hover:bg-red-50 ml-4">
                                Skip for Now
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Colors Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Colors</h3>
                            <p className="text-sm text-gray-600 mb-4">Choose colors you'd like to see more of, and any you'd like to avoid.</p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <h4 className="font-medium mb-3 text-center">I'd love these colors</h4>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {colors.map(color => (
                                            <ColorSwatch 
                                                key={color.id} 
                                                hex={color.hex_code}
                                                isSelected={preferredColors.includes(color.id)}
                                                onClick={() => handleToggle(color.id, setPreferredColors, rejectedColors, setRejectedColors)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3 text-center">Please, no thanks!</h4>
                                     <div className="flex flex-wrap gap-3 justify-center">
                                        {colors.map(color => (
                                            <ColorSwatch 
                                                key={color.id} 
                                                hex={color.hex_code}
                                                isSelected={rejectedColors.includes(color.id)}
                                                onClick={() => handleToggle(color.id, setRejectedColors, preferredColors, setPreferredColors)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />
                        
                        {/* Flower Types Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Flower Types</h3>
                            <p className="text-sm text-gray-600 mb-4">Select their favorite flowers and flowers you know they don't like. We will order based off these so long as we can find a florist in your area, for your budget, that can accomodate your preferences.</p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <h4 className="font-medium mb-3 text-center">My absolute favorites</h4>
                                    <div className="flex flex-wrap gap-2 justify-center ">
                                        {flowerTypes.map(ft => (
                                            <SelectableTag
                                                key={ft.id}
                                                label={ft.name}
                                                isSelected={preferredFlowerTypes.includes(ft.id)}
                                                onClick={() => handleToggle(ft.id, setPreferredFlowerTypes, rejectedFlowerTypes, setRejectedFlowerTypes)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3 text-center">Not these please!</h4>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {flowerTypes.map(ft => (
                                            <SelectableTag
                                                key={ft.id}
                                                label={ft.name}
                                                isSelected={rejectedFlowerTypes.includes(ft.id)}
                                                onClick={() => handleToggle(ft.id, setRejectedFlowerTypes, preferredFlowerTypes, setPreferredFlowerTypes)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" onClick={handleBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button size="lg" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : 'Save & Continue'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PreferenceSelectionPage;