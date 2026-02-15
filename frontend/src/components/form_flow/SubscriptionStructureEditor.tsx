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
import type { SubscriptionPlan } from '../../types/SubscriptionPlan';
import type { PartialSubscriptionPlan } from '../../types/PartialSubscriptionPlan';
import SubscriptionStructureForm from '@/forms/SubscriptionStructureForm';
import type { SubscriptionStructureData } from '../../types/SubscriptionStructureData';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import { debounce } from '@/utils/debounce';
import type { SubscriptionStructureEditorProps } from '../../types/SubscriptionStructureEditorProps';
import { MIN_DAYS_BEFORE_FIRST_DELIVERY } from '@/utils/systemConstants';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + MIN_DAYS_BEFORE_FIRST_DELIVERY);
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
    
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
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
                let startDate = plan.start_date || getMinDateString();
                
                // Auto-correct if date is too soon and plan is not yet active
                if (plan.status !== 'active') {
                    const minDateStr = getMinDateString();
                    if (startDate < minDateStr) {
                        startDate = minDateStr;
                    }
                }

                setFormData({
                    budget: Number(plan.budget) || 75,
                    frequency: plan.frequency || 'annually',
                    start_date: startDate,
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
        setTotalAmount(null);

        try {
            const data = await calculateSubscriptionPrice(planId, budget);
            setTotalAmount(data.total_amount);
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
        if (!planId || totalAmount === null) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialSubscriptionPlan = {
                ...formData,
                budget: formData.budget,
                total_amount: totalAmount,
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
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-black/5">
                        <FlowBackButton 
                            to={backPath.replace('{planId}', planId || '')} 
                            className="w-full sm:w-auto"
                        />
                        <FlowNextButton 
                            label={saveButtonText} 
                            onClick={handleSave} 
                            isLoading={isSaving}
                            disabled={isApiCalculating || isDebouncePending || totalAmount === null}
                            className="w-full sm:w-auto"
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionStructureEditor;