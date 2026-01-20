// foreverflower/frontend/src/pages/flow/PreferenceSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';

// Mock data types for now - will be replaced with API-fetched data
interface ApiColor {
    id: number;
    name: string;
    hex_code: string;
}

interface ApiFlowerType {
    id: number;
    name: string;
}

const PreferenceSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();
    const { planId } = useParams<{ planId: string }>(); // Assuming the flower plan ID is in the URL

    // State for available options
    const [availableColors, setAvailableColors] = useState<ApiColor[]>([]);
    const [availableFlowerTypes, setAvailableFlowerTypes] = useState<ApiFlowerType[]>([]);
    
    // State for user selections
    const [preferredColors, setPreferredColors] = useState<number[]>([]);
    const [rejectedColors, setRejectedColors] = useState<number[]>([]);
    const [preferredFlowerTypes, setPreferredFlowerTypes] = useState<number[]>([]);
    const [rejectedFlowerTypes, setRejectedFlowerTypes] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to set preferences.");
            navigate('/login');
            return;
        }

        const fetchOptions = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, replace fetch with our api utility
                const colorsPromise = fetch('/api/events/colors/', { headers: { 'Authorization': `Bearer ${token}` } });
                const flowerTypesPromise = fetch('/api/events/flower-types/', { headers: { 'Authorization': `Bearer ${token}` } });

                const [colorsResponse, flowerTypesResponse] = await Promise.all([colorsPromise, flowerTypesPromise]);
                
                if (!colorsResponse.ok || !flowerTypesResponse.ok) {
                    throw new Error('Failed to fetch preference options.');
                }

                const colorsData: ApiColor[] = await colorsResponse.json();
                const flowerTypesData: ApiFlowerType[] = await flowerTypesResponse.json();

                setAvailableColors(colorsData);
                setAvailableFlowerTypes(flowerTypesData);

            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOptions();
    }, [isAuthenticated, navigate, token]);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            // This is where the PATCH request to update the flower plan would go
            // e.g., await api.updateFlowerPlan(planId, { ... });
            toast.success("Preferences saved successfully!");
            // Navigate to the next step, e.g., payment or summary
            navigate(`/`); 
        } catch (error) {
            toast.error("Failed to save preferences.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isAuthenticated) {
        return null; // Render nothing while redirecting
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-12">
                <Seo title="Set Preferences | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Step 3: Add Your Preferences (Optional)</CardTitle>
                        <CardDescription className="text-black">
                            Help us tailor your deliveries. Select your favorite (and not-so-favorite) colors and flowers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Color Selections will go here */}
                        <div id="color-preferences">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Color Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-medium mb-3">Your Favorites</h4>
                                    <div className="p-4 rounded-lg bg-gray-50 min-h-[100px]">Placeholder for preferred color swatches</div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Colors to Avoid</h4>
                                    <div className="p-4 rounded-lg bg-gray-50 min-h-[100px]">Placeholder for rejected color swatches</div>
                                </div>
                            </div>
                        </div>

                        {/* Flower Type Selections will go here */}
                        <div id="flower-type-preferences">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Flower Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-medium mb-3">Your Favorites</h4>
                                    <div className="p-4 rounded-lg bg-gray-50 min-h-[100px]">Placeholder for preferred flower type tags</div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Flowers to Avoid</h4>
                                    <div className="p-4 rounded-lg bg-gray-50 min-h-[100px]">Placeholder for rejected flower type tags</div>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/')}>Skip for Now</Button>
                        <Button size="lg" disabled={isSubmitting} onClick={handleSaveChanges}>
                            {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                            Save & Continue
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PreferenceSelectionPage;
