// futureflower/frontend/src/components/UpfrontStructureEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';
import type { UpfrontPlan, PartialUpfrontPlan, PlanStructureData } from '@/types';
import PlanStructureForm from '@/forms/PlanStructureForm';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { UpfrontStructureEditorProps } from '../../types/UpfrontStructureEditorProps';
import { MIN_DAYS_BEFORE_CREATE, MIN_DAYS_BEFORE_EDIT } from '@/utils/systemConstants';

const getMinDateString = (isEdit: boolean) => {
    const minDate = new Date();
    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;
    minDate.setDate(minDate.getDate() + leadTime);
    return minDate.toISOString().split('T')[0];
};

const UpfrontStructureEditor: React.FC<UpfrontStructureEditorProps> = ({
    mode,
    title = "Define the Plan's Structure",
    saveButtonText,
    onSaveNavigateTo,
    backPath,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const isEditMode = mode === 'edit';

    // Core State
    const [formData, setFormData] = useState<PlanStructureData>({
        budget: 150,
        frequency: 'annually',
        years: 5,
        start_date: getMinDateString(isEditMode),
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!planId) {
            toast.error("No plan specified.");
            navigate('/dashboard');
            return;
        }

        setIsLoading(true);
        getUpfrontPlan(planId)
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
                    budget: Number(plan.budget) || 150,
                    frequency: plan.frequency || 'annually',
                    years: plan.years || 5,
                    start_date: startDate,
                });
            })
            .catch(error => {
                toast.error("Failed to load plan details", { description: error.message });
                navigate(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, navigate, backPath, isEditMode]);

    const handleFormChange = (field: keyof PlanStructureData, value: number | string) => {
        setFormData((prev: PlanStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        setIsSaving(true);
        try {
            const payload: PartialUpfrontPlan = { ...formData, budget: formData.budget };
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
    
    const isActionDisabled = isSaving;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8">
                        <PlanStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={() => {}} // No-op now
                            isEdit={mode === 'edit'}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <FlowBackButton to={backPath} />
                        <FlowNextButton 
                            label={saveButtonText} 
                            onClick={handleSave} 
                            isLoading={isSaving}
                            disabled={isActionDisabled}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default UpfrontStructureEditor;