// foreverflower/frontend/src/pages/flow/CustomMessagePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';

const CustomMessagePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage a flower plan.");
            navigate('/login');
            return;
        }
        // Fetching logic will go here
        setIsLoading(false);
    }, [isAuthenticated, navigate, planId]);

    const handleSave = () => {
        // Saving logic will go here
        navigate(`/flower-plan/${planId}/confirmation`);
    };

    const handleSkip = () => {
        toast.info("You can add messages later from your dashboard.");
        navigate(`/flower-plan/${planId}/confirmation`);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-12">
                <Seo title="Add Custom Messages | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Step 4: Add Custom Messages (Optional)</CardTitle>
                        <CardDescription className="text-black">
                            Add a personal touch to your deliveries. You can write one message for all, or customize each one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                            {/* Form UI will go here */}
                            <p>Message form will be here.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" onClick={handleSkip}>Skip for Now</Button>
                        <Button size="lg" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : 'Save & Continue'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default CustomMessagePage;
