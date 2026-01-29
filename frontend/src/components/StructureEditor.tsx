// foreverflower/frontend/src/components/StructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlan, updateUpfrontPlan, calculateUpfrontPriceForPlan } from '@/api';
import type { UpfrontPlan, PartialUpfrontPlan, PlanStructureData } from '@/types';
import PlanStructureForm from '@/forms/PlanStructureForm';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';
import type { StructureEditorProps } from '../types/StructureEditorProps';
import PaymentInitiatorButton from './PaymentInitiatorButton';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const StructureEditor: React.FC<StructureEditorProps> = ({
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

    // Core State
    const [formData, setFormData] = useState<PlanStructureData>({
        budget: 75,
        deliveries_per_year: 1,
        years: 5,
        start_date: getMinDateString(),
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Price calculation state
    const [amountOwing, setAmountOwing] = useState<number | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(true);
    const [calculationError, setCalculationError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage a plan.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No plan specified.");
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getUpfrontPlan(planId)
            .then((plan: UpfrontPlan) => {
                setFormData({
                    budget: Number(plan.budget) || 75,
                    deliveries_per_year: plan.deliveries_per_year || 1,
                    years: plan.years || 5,
                    start_date: plan.start_date || getMinDateString(),
                });
            })
            .catch(error => {
                toast.error("Failed to load plan details", { description: error.message });
                navigate(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, navigate, backPath]);

    const calculateAmountOwing = useCallback(async (budget: number, deliveries: number, years: number) => {
        if (!planId) {
             setIsApiCalculating(false);
             setIsDebouncePending(false);
             return;
        }

        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setCalculationError(null);
        setAmountOwing(null);

        try {
            const data = await calculateUpfrontPriceForPlan(planId, { budget, deliveries_per_year: deliveries, years });
            setAmountOwing(data.amount_owing);
        } catch (err: any) {
            setCalculationError(err.message);
            toast.error("Price Calculation Error", { description: err.message });
        } finally {
            setIsApiCalculating(false);
        }
    }, [planId]);

    const debouncedCalculate = useMemo(() => debounce(calculateAmountOwing, 500), [calculateAmountOwing]);

    useEffect(() => {
        if (!isLoading) {
            setIsDebouncePending(true);
            debouncedCalculate(formData.budget, formData.deliveries_per_year, formData.years);
        }
        return () => debouncedCalculate.cancel?.();
    }, [formData.budget, formData.deliveries_per_year, formData.years, isLoading, debouncedCalculate]);

    const handleFormChange = (field: keyof PlanStructureData, value: number | string) => {
        setFormData((prev: PlanStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        // For 'create' mode, save details and navigate to confirmation.
        // For 'edit' mode, this only handles saves that do not require payment (e.g., if amountOwing is 0).
        setIsSaving(true);
        try {
            const payload: PartialUpfrontPlan = { ...formData, budget: String(formData.budget) };
            if (mode === 'create' && amountOwing !== null) {
                payload.total_amount = amountOwing;
            }
            await updateUpfrontPlan(planId, payload);
            if (mode === 'edit') {
                toast.success("Plan structure updated successfully!");
            }
            navigate(onSaveNavigateTo);
        } catch (err: any) {
            toast.error("Failed to save plan structure.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    }
    
    const showPaymentButton = mode === 'edit' && amountOwing !== null && amountOwing > 0;
    const isActionDisabled = Boolean(isSaving || isApiCalculating || isDebouncePending || amountOwing === null || calculationError);

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title={`${title} | ForeverFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <PlanStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={setIsDebouncePending}
                        />
                        <div className="mt-8 text-center h-12 flex flex-col items-center justify-center">
                            {(isApiCalculating || isDebouncePending) ? (
                                <Spinner className="h-8 w-8" />
                            ) : amountOwing !== null ? (
                                <>
                                    <div className="text-2xl font-bold">${amountOwing.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-gray-600">
                                        {mode === 'edit' ? 'Amount to pay for this change' : 'Total amount for this plan'} (inc. fees)
                                    </p>
                                </>
                            ) : calculationError ? (
                                 <div className="text-red-500 text-sm">{calculationError}</div>
                            ) : null}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath} />
                        {showPaymentButton ? (
                            <PaymentInitiatorButton
                                size="lg"
                                itemType="UPFRONT_PLAN_MODIFY"
                                details={{
                                    upfront_plan_id: planId,
                                    budget: formData.budget,
                                    years: formData.years,
                                    deliveries_per_year: formData.deliveries_per_year,
                                }}
                                disabled={isActionDisabled}
                            >
                                Proceed to Payment
                            </PaymentInitiatorButton>
                        ) : (
                            <Button size="lg" onClick={handleSave} disabled={isActionDisabled}>
                                {isSaving && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Saving...' : saveButtonText}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default StructureEditor;