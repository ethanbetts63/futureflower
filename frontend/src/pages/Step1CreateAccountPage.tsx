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

const CreateAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleLoginSuccess } = useAuth(); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: ProfileCreationData) => {
        setIsSubmitting(true);
        try {
            const authResponse = await registerUser(data);
            await handleLoginSuccess(authResponse);
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

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Account | FutureFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Create Your Account</CardTitle>
                        <CardDescription className="text-black">
                            Welcome! Let's get your account set up so you can create your first order. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileCreationForm initialData={{}} onSubmit={handleFormSubmit} />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button 
                            size="lg"
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
    );
};

export default CreateAccountPage;
