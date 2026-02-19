// futureflower/frontend/src/pages/flow/CreateAccountPage.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ProfileCreationForm } from '@/forms/ProfileCreationForm';
import type { ProfileCreationData } from '../types/ProfileCreationData';
import { registerUser } from '@/api';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const FLOW_CONFIG: Record<string, { planName: string; totalSteps: number }> = {
    'subscription': { planName: 'Subscription Plan', totalSteps: 4 },
    'single-delivery': { planName: 'Single Delivery Plan', totalSteps: 4 },
};
const DEFAULT_FLOW = { planName: 'Upfront Plan', totalSteps: 5 };

const CreateAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleLoginSuccess } = useAuth(); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: ProfileCreationData) => {
        setIsSubmitting(true);
        try {
            await registerUser(data);
            await handleLoginSuccess();
            const nextUrl = searchParams.get('next') || '/event-gate';
            navigate(nextUrl); // Navigate to the event gate to start the plan creation flow
        } catch (error: any) {
            const errorData = error.data || {};
            const description = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ');

            toast.error("Failed to create profile", { 
                description: description || "An unknown error occurred. Please try again." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextUrl = searchParams.get('next') || '';
    const flowKey = Object.keys(FLOW_CONFIG).find(key => nextUrl.includes(key));
    const { planName, totalSteps } = flowKey ? FLOW_CONFIG[flowKey] : DEFAULT_FLOW;

    return (
        <>
        <StepProgressBar currentStep={1} totalSteps={totalSteps} planName={planName} />
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title="Create Account | FutureFlower" />
                <Card className="bg-white text-black border-none shadow-none md:shadow-md rounded-none md:rounded-xl overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl">Create Your Account</CardTitle>
                        <CardDescription className="text-black">
                            Welcome! Let's get your account set up so you can create your first order. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 md:px-8 py-2">
                        <ProfileCreationForm initialData={{}} onSubmit={handleFormSubmit} />
                    </CardContent>
                    <CardFooter className="flex flex-row justify-end items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <Button 
                            size="lg"
                            className="w-full md:w-auto"
                            disabled={isSubmitting}
                            onClick={() => document.getElementById('profile-creation-submit')?.click()}
                        >
                            {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                            Next: Create Your Plan
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
        </>
    );
};

export default CreateAccountPage;
