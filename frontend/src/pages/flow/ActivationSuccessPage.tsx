// src/pages/ActivationSuccessPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { getFlowerPlan } from '@/api';
import type { FlowerPlan } from '@/api';
import Seo from '@/components/Seo';
import { toast } from 'sonner';

const ActivationSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [, setPlan] = useState<FlowerPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const planId = searchParams.get('plan_id');

        if (!planId) {
            toast.error('No plan specified.');
            navigate('/dashboard');
            return;
        }

        getFlowerPlan(planId)
            .then(data => {
                setPlan(data);
            })
            .catch(err => {
                console.error("Failed to fetch plan:", err);
                toast.error('Failed to load plan details.');
                navigate('/dashboard');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto px-4 max-w-lg">
                <Seo title="Plan Activated | ForeverFlower" />
                <Card className="w-full text-center bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        </div>
                        <CardTitle className="text-3xl">Activation Successful!</CardTitle>
                        <CardDescription className="text-lg pt-2">
                            Your Flower Plan is now active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6">
                            We will begin preparing your flower deliveries. You can view and manage your plan from your dashboard.
                        </p>
                        <Button asChild size="lg">
                            <Link to="/dashboard/plans">Go to My Plans</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ActivationSuccessPage;