// frontend/src/components/SingleDeliveryStructureEditor.tsx
"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { getOrder, updateOrder } from '@/api/orders';
import type { Order, PartialOrder } from '../../types/Order';
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

const SingleDeliveryStructureEditor = ({
    mode,
    isPaid = false,
    title = "Delivery Details",
    saveButtonText,
    onSaveNavigateTo,
    backPath,
}: SingleDeliveryStructureEditorProps) => {
    const params = useParams();
    const planId = params.planId as string | undefined;
    const router = useRouter();
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
            router.push('/dashboard');
            return;
        }

        setIsLoading(true);
        getOrder(planId)
            .then((plan: Order) => {
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
            .catch((error: any) => {
                toast.error("Failed to load plan details", { description: error.message });
                router.push(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, router, backPath, isEditMode]);

    const handleFormChange = (field: keyof SingleDeliveryStructureData, value: number | string) => {
        setFormData((prev: SingleDeliveryStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        setIsSaving(true);
        try {
            const payload: PartialOrder = isPaid
                ? {
                    start_date: formData.start_date,
                    draft_card_messages: { '0': formData.card_message },
                }
                : {
                    budget: formData.budget,
                    start_date: formData.start_date,
                    draft_card_messages: { '0': formData.card_message },
                };
            await updateOrder(planId, payload);
            
            if (mode === 'edit') {
                toast.success("Plan details updated successfully!");
            }
            router.push(onSaveNavigateTo.replace('{planId}', planId));
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
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-playfair-display">{title}</CardTitle>
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