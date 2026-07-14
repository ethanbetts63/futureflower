// futureflower/frontend/src/pages/flow/CreateAccountPage.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ProfileCreationForm } from '@/forms/ProfileCreationForm';
import type { ProfileCreationData } from '../types/ProfileCreationData';
import { registerUser } from '@/api';
import { getOrCreateDraftOrder } from '@/api/orders';
import { clearHomepageBrief, readHomepageBrief, startOrderFromBrief } from '@/lib/homepageBrief';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const PLAN_NAME = 'Single Delivery Plan';
const TOTAL_STEPS = 4;

const CreateAccountPage = () => {
    const router = useRouter();
    const { handleLoginSuccess } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: ProfileCreationData) => {
        setIsSubmitting(true);
        try {
            await registerUser(data);
            await handleLoginSuccess();
        } catch (error: any) {
            const errorData = error.data || {};
            const description = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ');

            toast.error("Failed to create profile", {
                description: description || "An unknown error occurred. Please try again.",
            });
            setIsSubmitting(false);
            return;
        }

        // Registration succeeded. Turn the homepage brief (if the visitor started
        // one before signing up) into a draft order and drop them at the first
        // editable step. This is the work the old /event-gate route used to do.
        try {
            const brief = readHomepageBrief();
            const plan = brief ? await startOrderFromBrief(brief) : await getOrCreateDraftOrder();
            clearHomepageBrief();
            router.push(`/single-delivery-flow/plan/${plan.id}/recipient`);
        } catch (error: any) {
            toast.error("Could not start your order", {
                description: error.message || "Your account is ready — please try again from your dashboard.",
            });
            router.push('/dashboard');
        }
    };

    return (
        <>
        <StepProgressBar currentStep={1} totalSteps={TOTAL_STEPS} planName={PLAN_NAME} />
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
