// foreverflower/frontend/src/components/RecipientEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import type { PartialUpfrontPlan } from '../types/PartialUpfrontPlan';
import type { PartialSubscriptionPlan } from '../types/PartialSubscriptionPlan';
import type { RecipientData } from '../types/RecipientData';
import RecipientForm from '@/forms/RecipientForm';
import Seo from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import BackButton from '@/components/BackButton';
import type { RecipientEditorProps } from '../types/RecipientEditorProps';


type PartialPlan = PartialUpfrontPlan | PartialSubscriptionPlan;

const RecipientEditor: React.FC<RecipientEditorProps> = ({
    mode,
    title,
    saveButtonText,
    onSaveNavigateTo,
    onCancelNavigateTo,
    getPlan,
    updatePlan,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<RecipientData>({
        recipient_first_name: '',
        recipient_last_name: '',
        recipient_street_address: '',
        recipient_suburb: '',
        recipient_city: '',
        recipient_state: '',
        recipient_postcode: '',
        recipient_country: '', // Default for new plans
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to proceed.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No plan ID was provided.");
            navigate('/dashboard');
            return;
        }

        const fetchPlanData = async () => {
            setIsLoading(true);
            try {
                const plan = await getPlan(planId);
                setFormData({
                    recipient_first_name: plan.recipient_first_name || '',
                    recipient_last_name: plan.recipient_last_name || '',
                    recipient_street_address: plan.recipient_street_address || '',
                    recipient_suburb: plan.recipient_suburb || '',
                    recipient_city: plan.recipient_city || '',
                    recipient_state: plan.recipient_state || '',
                    recipient_postcode: plan.recipient_postcode || '',
                    recipient_country: plan.recipient_country || '',
                });
            } catch (err) {
                toast.error("Failed to load plan data.");
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanData();
    }, [planId, isAuthenticated, navigate, getPlan]);

    const handleFormChange = (field: keyof RecipientData, value: string) => {
        setFormData((prev: RecipientData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        // Simple validation
        if (!formData.recipient_first_name || !formData.recipient_street_address || !formData.recipient_city) {
            toast.error("Please fill in at least the recipient's first name, address, and city.");
            return;
        }
        
        setIsSaving(true);
        try {
            const payload: PartialPlan = { ...formData };
            await updatePlan(planId, payload);

            if (mode === 'edit') {
                toast.success("Recipient details updated successfully!");
            }
            
            const destination = onSaveNavigateTo.replace('{planId}', planId);
            navigate(destination);

        } catch (err) {
            toast.error(mode === 'edit' ? "Failed to update recipient details." : "Failed to save recipient details.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        const destination = onCancelNavigateTo.replace('{planId}', planId || '');
        navigate(destination);
    }
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    const backButtonTo = mode === 'edit' && planId ? onCancelNavigateTo.replace('{planId}', planId) : undefined;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title={`${title} | ForeverFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecipientForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            title="" // Title is handled by the CardHeader
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {backButtonTo ? <BackButton to={backButtonTo} /> : <div />}
                        <div className="flex gap-4">
                            <Button variant="outline" size="lg" onClick={handleCancel} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button size="lg" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : saveButtonText}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default RecipientEditor;