// foreverflower/frontend/src/pages/flow/CreatePlanStep2_StructurePage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { createFlowerPlan, type CreateFlowerPlanPayload } from '@/api';
import type { RecipientData } from '@/forms/RecipientForm';
import type { PlanStructureData } from '@/forms/PlanStructureForm';
import StructureEditor from '@/components/plan/StructureEditor';
import { debounce } from '@/utils/debounce';
import { authedFetch } from '@/apiClient';

const CreatePlanStep2_StructurePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [structureData, setStructureData] = useState<PlanStructureData>(() => {
        const savedData = localStorage.getItem('newPlanStructureData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            budget: 75,
            deliveries_per_year: 1,
            years: 5,
        };
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Price calculation state
    const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a plan.");
            navigate('/login');
            return;
        }
        // Ensure recipient data exists, otherwise send back to step 1
        const recipientData = localStorage.getItem('newPlanRecipientData');
        if (!recipientData) {
            toast.error("Please complete Step 1 first.");
            navigate('/book-flow/flower-plan/step-1');
        }
    }, [isAuthenticated, navigate]);

    // Price calculation logic
    const calculateUpfront = useCallback(async (budget: number, deliveries: number, years: number) => {
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setUpfrontPrice(null);

        try {
            const response = await authedFetch('/api/events/calculate-price/', {
                method: 'POST',
                body: JSON.stringify({ budget, deliveries_per_year: deliveries, years }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Something went wrong');
            }
            const data = await response.json();
            setUpfrontPrice(data.upfront_price);
        } catch (err: any) {
            setError(err.message || 'Price calculation failed.');
            toast.error("Calculation Error", { description: err.message });
        } finally {
            setIsApiCalculating(false);
        }
    }, []);

    const debouncedCalculateUpfront = useMemo(() => debounce(calculateUpfront, 500), [calculateUpfront]);

    useEffect(() => {
        debouncedCalculateUpfront(structureData.budget, structureData.deliveries_per_year, structureData.years);
        localStorage.setItem('newPlanStructureData', JSON.stringify(structureData));
        return () => { debouncedCalculateUpfront.cancel?.(); };
    }, [structureData, debouncedCalculateUpfront]);

    const handleFormChange = (field: keyof PlanStructureData, value: number) => {
        setStructureData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = async () => {
        if (upfrontPrice === null) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }
        
        const recipientDataString = localStorage.getItem('newPlanRecipientData');
        if (!recipientDataString) {
            toast.error("Recipient data is missing. Please return to Step 1.");
            navigate('/book-flow/flower-plan/step-1');
            return;
        }

        setIsSubmitting(true);
        try {
            const recipientData: RecipientData = JSON.parse(recipientDataString);
            const payload: CreateFlowerPlanPayload = {
                ...recipientData,
                ...structureData,
            };

            const newPlan = await createFlowerPlan(payload);
            
            // Clear stored data on success
            localStorage.removeItem('newPlanRecipientData');
            localStorage.removeItem('newPlanStructureData');
            
            toast.success("Plan created! Now for the fun part.");
            navigate(`/book-flow/flower-plan/${newPlan.id}/preferences`);
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to create plan.", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCancel = () => {
        localStorage.removeItem('newPlanRecipientData');
        localStorage.removeItem('newPlanStructureData');
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Plan: Structure | ForeverFlower" />
                <div className="text-center mb-4 text-black">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-gray-500">Step 2 of 3</h1>
                </div>
                <StructureEditor
                    formData={structureData}
                    onFormChange={handleFormChange}
                    onSave={handleNext}
                    onCancel={handleCancel}
                    isSaving={isSubmitting}
                    isLoading={false}
                    title="Define the Plan's Structure"
                    saveButtonText="Next: Select Preferences"
                    amountOwing={upfrontPrice}
                    isApiCalculating={isApiCalculating}
                    isDebouncePending={isDebouncePending}
                    calculationError={error}
                    setIsDebouncePending={setIsDebouncePending}
                    backButtonTo="/book-flow/flower-plan/step-1"
                />
            </div>
        </div>
    );
};

export default CreatePlanStep2_StructurePage;
