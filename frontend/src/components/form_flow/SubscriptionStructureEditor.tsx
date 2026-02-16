// futureflower/frontend/src/components/SubscriptionStructureEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '../../types/SubscriptionPlan';
import type { PartialSubscriptionPlan } from '../../types/PartialSubscriptionPlan';
import SubscriptionStructureForm from '@/forms/SubscriptionStructureForm';
import type { SubscriptionStructureData } from '../../types/SubscriptionStructureData';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { SubscriptionStructureEditorProps } from '../../types/SubscriptionStructureEditorProps';
import { MIN_DAYS_BEFORE_FIRST_DELIVERY } from '@/utils/systemConstants';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + MIN_DAYS_BEFORE_FIRST_DELIVERY);
    return minDate.toISOString().split('T')[0];
};

const SubscriptionStructureEditor: React.FC<SubscriptionStructureEditorProps> = ({
    mode,
    title = "Define Your Subscription",
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

    const handleFormChange = (field: keyof SubscriptionStructureData, value: number | string) => {
        setFormData((prev: SubscriptionStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        setIsSaving(true);
        try {
            const payload: PartialSubscriptionPlan = {
                ...formData,
                budget: formData.budget,
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
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-6 md:pt-10">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8">
                        <SubscriptionStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={() => {}}
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

export default SubscriptionStructureEditor;