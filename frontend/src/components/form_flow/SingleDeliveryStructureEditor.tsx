// frontend/src/components/SingleDeliveryStructureEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { PartialUpfrontPlan } from '../../types/PartialUpfrontPlan';
import SingleDeliveryStructureForm from '@/forms/SingleDeliveryStructureForm';
import type { SingleDeliveryStructureData } from '../../types/SingleDeliveryStructureData';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { SingleDeliveryStructureEditorProps } from '../../types/SingleDeliveryStructureEditorProps';
import { MIN_DAYS_BEFORE_CREATE, MIN_DAYS_BEFORE_EDIT } from '@/utils/systemConstants';

const getMinDateString = (isEdit: boolean) => {
    const minDate = new Date();
    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;
    minDate.setDate(minDate.getDate() + leadTime);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureEditor: React.FC<SingleDeliveryStructureEditorProps> = ({
    mode,
    isPaid = false,
    title = "Delivery Details",
    saveButtonText,
    onSaveNavigateTo,
    backPath,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<SingleDeliveryStructureData>({
        budget: 125,
        start_date: getMinDateString(isEditMode),
        card_message: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!planId) {
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getUpfrontPlanAsSingleDelivery(planId)
            .then((plan: UpfrontPlan) => {
                let startDate = plan.start_date || getMinDateString(isEditMode);
                
                // Auto-correct if date is too soon and plan is not yet active
                if (plan.status !== 'active') {
                    const minDateStr = getMinDateString(isEditMode);
                    if (startDate < minDateStr) {
                        startDate = minDateStr;
                    }
                }

                setFormData({
                    budget: Number(plan.budget) || 125,
                    start_date: startDate,
                    card_message: plan.draft_card_messages?.['0'] || '',
                });
            })
            .catch(error => {
                toast.error("Failed to load plan details", { description: error.message });
                navigate(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, navigate, backPath, isEditMode]);

    const handleFormChange = (field: keyof SingleDeliveryStructureData, value: number | string) => {
        setFormData((prev: SingleDeliveryStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        setIsSaving(true);
        try {
            const payload: PartialUpfrontPlan = isPaid
                ? {
                    start_date: formData.start_date,
                    draft_card_messages: { '0': formData.card_message },
                }
                : {
                    budget: formData.budget,
                    start_date: formData.start_date,
                    frequency: 'annually',
                    years: 1,
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
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8">
                        <SingleDeliveryStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={() => {}}
                            isEdit={isEditMode}
                            isPaid={isPaid}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <FlowBackButton 
                            to={backPath.replace('{planId}', planId || '')} 
                        />
                        <FlowNextButton 
                            label={saveButtonText} 
                            onClick={handleSave} 
                            isLoading={isSaving}
                            disabled={isSaving}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SingleDeliveryStructureEditor;