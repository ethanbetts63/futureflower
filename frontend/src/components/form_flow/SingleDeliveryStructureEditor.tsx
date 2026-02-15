// frontend/src/components/SingleDeliveryStructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery, calculateUpfrontPlanSingleDeliveryPrice } from '@/api/singleDeliveryPlans';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { PartialUpfrontPlan } from '../../types/PartialUpfrontPlan';
import SingleDeliveryStructureForm from '@/forms/SingleDeliveryStructureForm';
import type { SingleDeliveryStructureData } from '../../types/SingleDeliveryStructureData';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import { debounce } from '@/utils/debounce';
import type { SingleDeliveryStructureEditorProps } from '../../types/SingleDeliveryStructureEditorProps';
import { MIN_DAYS_BEFORE_FIRST_DELIVERY } from '@/utils/systemConstants';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + MIN_DAYS_BEFORE_FIRST_DELIVERY);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureEditor: React.FC<SingleDeliveryStructureEditorProps> = ({
    mode,
    title = "Delivery Details",
    description = "Set the budget for the bouquet, when it should be delivered, and an optional message.",
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

    useEffect(() => {
        if (!planId) {
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getUpfrontPlanAsSingleDelivery(planId)
            .then((plan: UpfrontPlan) => {
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
                    start_date: startDate,
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
        setTotalAmount(null);

        try {
            const data = await calculateUpfrontPlanSingleDeliveryPrice(planId, budget);
            setTotalAmount(data.new_total_price);
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
                budget: formData.budget,
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
                    <CardContent className="space-y-8 pt-8">
                        <SingleDeliveryStructureForm
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
                            disabled={isApiCalculating || isDebouncePending || typeof totalAmount !== 'number'}
                            className="w-full sm:w-auto"
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SingleDeliveryStructureEditor;