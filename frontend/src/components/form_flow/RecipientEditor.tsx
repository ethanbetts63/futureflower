// futureflower/frontend/src/components/RecipientEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import type { PartialUpfrontPlan } from '../../types/PartialUpfrontPlan';
import type { PartialSubscriptionPlan } from '../../types/PartialSubscriptionPlan';
import type { RecipientData } from '../../types/RecipientData';
import RecipientForm from '@/forms/RecipientForm';
import Seo from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { RecipientEditorProps } from '../../types/RecipientEditorProps';


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
        recipient_country: '',
        delivery_notes: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
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
                    delivery_notes: plan.delivery_notes || '',
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
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    const backButtonTo = planId ? onCancelNavigateTo.replace('{planId}', planId) : onCancelNavigateTo;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-8">
                        <RecipientForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            title="" // Title is handled by the CardHeader
                        />

                        <div className="grid gap-2 mt-2 pb-4">
                            <Label htmlFor="delivery-notes">Delivery Notes (Optional)</Label>
                            <Textarea
                                id="delivery-notes"
                                placeholder="e.g., Leave at the front door, ring the bell twice, etc."
                                value={formData.delivery_notes}
                                onChange={(e) => handleFormChange('delivery_notes', e.target.value)}
                                rows={3}
                            />
                            <p className="text-sm text-muted-foreground">Any special instructions for the delivery driver.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <FlowBackButton to={backButtonTo} />
                        <FlowNextButton 
                            label={saveButtonText} 
                            onClick={handleSave} 
                            isLoading={isSaving}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default RecipientEditor;