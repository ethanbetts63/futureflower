// foreverflower/frontend/src/pages/flow/CreateAccountPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ProfileCreationForm, type ProfileCreationData } from '@/forms/ProfileCreationForm';
import { registerUser } from '@/api';
import { toast } from 'sonner';
import Seo from '@/components/Seo';

const CreateAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth(); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: ProfileCreationData) => {
        setIsSubmitting(true);
        try {
            const authResponse = await registerUser(data);
            handleLoginSuccess(authResponse);
            toast.success("Account created successfully!");
            navigate('/book-flow'); // Navigate to the next step
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
                <Seo title="Create Account | ForeverFlower" />
                <Card className="bg-white text-black">
                    <CardHeader>
                        <CardTitle className="text-3xl">Step 1: Create Your Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Welcome! Let's get your account set up so you can create your first flower plan.
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
        </div>    );
};

export default CreateAccountPage;
