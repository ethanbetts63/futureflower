// futureflower/frontend/src/components/SubscriptionStructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getSubscriptionPlan, updateSubscriptionPlan, calculateSubscriptionPrice } from '@/api';
import type { SubscriptionPlan } from '../types/SubscriptionPlan';
import type { PartialSubscriptionPlan } from '../types/PartialSubscriptionPlan';
import SubscriptionStructureForm from '@/forms/SubscriptionStructureForm';
import type { SubscriptionStructureData } from '../types/SubscriptionStructureData';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';
import type { SubscriptionStructureEditorProps } from '../types/SubscriptionStructureEditorProps';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const SubscriptionStructureEditor: React.FC<SubscriptionStructureEditorProps> = ({
    mode,
    title,
    description,
    saveButtonText,
    onSaveNavigateTo,
    backPath,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<SubscriptionStructureData>({
        budget: 75,
        frequency: 'annually',
        start_date: getMinDateString(),
        subscription_message: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [pricePerDelivery, setPricePerDelivery] = useState<number | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(true);

    useEffect(() => {
        if (!planId) {
            toast.error("Plan ID is missing.");
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getSubscriptionPlan(planId)
            .then((plan: SubscriptionPlan) => {
                setFormData({
                    budget: Number(plan.budget) || 75,
                    frequency: plan.frequency || 'annually',
                    start_date: plan.start_date || getMinDateString(),
                    subscription_message: plan.subscription_message || '',
                });
            })
            .catch(error => {
                toast.error("Failed to load plan details", { description: error.message });
                navigate(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, navigate, backPath]);

    const calculatePrice = useCallback(async (budget: number) => {
        if (!planId) return;
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setPricePerDelivery(null);

        try {
            const data = await calculateSubscriptionPrice(planId, budget);
            setPricePerDelivery(data.price_per_delivery);
        } catch (err: any) {
            toast.error("Price Calculation Error", { description: err.message });
        } finally {
            setIsApiCalculating(false);
        }
    }, [planId]);

    const debouncedCalculate = useMemo(() => debounce(calculatePrice, 500), [calculatePrice]);

    useEffect(() => {
        if (!isLoading) {
            setIsDebouncePending(true);
            debouncedCalculate(formData.budget);
        }
        return () => debouncedCalculate.cancel?.();
    }, [formData.budget, isLoading, debouncedCalculate]);

    const handleFormChange = (field: keyof SubscriptionStructureData, value: number | string) => {
        setFormData((prev: SubscriptionStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId || pricePerDelivery === null) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialSubscriptionPlan = {
                ...formData,
                budget: String(formData.budget),
                price_per_delivery: pricePerDelivery,
            };
            await updateSubscriptionPlan(planId, payload);
            
            if (mode === 'edit') {
                toast.success("Plan structure updated successfully!");
            }
            navigate(onSaveNavigateTo.replace('{planId}', planId));
        } catch (err: any) {
            toast.error("Failed to save plan structure.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <SubscriptionStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={setIsDebouncePending}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath.replace('{planId}', planId || '')} />
                        <Button size="lg" onClick={handleSave} disabled={isSaving || isApiCalculating || isDebouncePending || pricePerDelivery === null}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSaving ? 'Saving...' : saveButtonText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionStructureEditor;