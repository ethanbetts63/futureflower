// frontend/src/components/SingleDeliveryStructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery, calculateUpfrontPlanSingleDeliveryPrice } from '@/api/singleDeliveryPlans';
import type { UpfrontPlan } from '../types/UpfrontPlan';
import type { PartialUpfrontPlan } from '../types/PartialUpfrontPlan';
import SingleDeliveryStructureForm from '@/forms/SingleDeliveryStructureForm';
import type { SingleDeliveryStructureData } from '../types/SingleDeliveryStructureData';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';
import type { SingleDeliveryStructureEditorProps } from '../types/SingleDeliveryStructureEditorProps';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureEditor: React.FC<SingleDeliveryStructureEditorProps> = ({
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

    const [formData, setFormData] = useState<SingleDeliveryStructureData>({
        budget: 75,
        start_date: getMinDateString(),
        card_message: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(true);
    const [calculationError, setCalculationError] = useState<string | null>(null);

    useEffect(() => {
        if (!planId) {
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getUpfrontPlanAsSingleDelivery(planId)
            .then((plan: UpfrontPlan) => {
                setFormData({
                    budget: Number(plan.budget) || 75,
                    start_date: plan.start_date || getMinDateString(),
                    card_message: plan.draft_card_messages?.['0'] || '',
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
        setCalculationError(null);
        setTotalAmount(null);

        try {
            const data = await calculateUpfrontPlanSingleDeliveryPrice(planId, budget);
            setTotalAmount(data.new_total_price);
        } catch (err: any) {
            setCalculationError(err.message);
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

    const handleFormChange = (field: keyof SingleDeliveryStructureData, value: number | string) => {
        setFormData((prev: SingleDeliveryStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId || typeof totalAmount !== 'number') {
            toast.error("Please wait for the price to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialUpfrontPlan = {
                budget: String(formData.budget),
                start_date: formData.start_date,
                frequency: 'annually',
                years: 1,
                total_amount: totalAmount,
                draft_card_messages: { '0': formData.card_message },
            };
            await updateUpfrontPlanAsSingleDelivery(planId, payload);
            
            if (mode === 'edit') {
                toast.success("Plan details updated successfully!");
            }
            navigate(onSaveNavigateTo.replace('{planId}', planId));
        } catch (err: any) {
            toast.error("Failed to save plan details.", { description: err.message });
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
                        <SingleDeliveryStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={setIsDebouncePending}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath.replace('{planId}', planId || '')} />
                        <Button size="lg" onClick={handleSave} disabled={isSaving || isApiCalculating || isDebouncePending || typeof totalAmount !== 'number'}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSaving ? 'Saving...' : saveButtonText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SingleDeliveryStructureEditor;