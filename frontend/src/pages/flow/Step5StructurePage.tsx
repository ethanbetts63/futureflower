import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getFlowerPlan, updateFlowerPlan } from '@/api';
import type { PlanStructureData } from '@/forms/PlanStructureForm';
import StructureEditor from '@/components/StructureEditor';
import { debounce } from '@/utils/debounce';
import { authedFetch } from '@/apiClient';

const getMinDateString = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  return minDate.toISOString().split('T')[0];
};

const StructurePage: React.FC = () => {
    const navigate = useNavigate();
    const { planId } = useParams<{ planId: string }>();
    const { isAuthenticated } = useAuth();

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
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a plan.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No plan ID was provided.");
            navigate('/dashboard');
            return;
        }
        
        setIsLoading(true);
        getFlowerPlan(planId)
            .then(plan => {
                setFormData({
                    budget: Number(plan.budget) || 75,
                    deliveries_per_year: plan.deliveries_per_year || 1,
                    years: plan.years || 5,
                    start_date: plan.start_date || getMinDateString(),
                });
            })
            .catch(error => {
                toast.error("Failed to load plan details", { description: error.message });
                navigate('/dashboard');
            })
            .finally(() => setIsLoading(false));

    }, [planId, isAuthenticated, navigate]);

    // Price calculation logic
    const calculateUpfront = useCallback(async (budget: number, deliveries: number, years: number) => {
        if (!planId) return;
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setAmountOwing(null);

        try {
            const response = await authedFetch(`/api/events/flower-plans/${planId}/calculate-modification/`, {
                method: 'POST',
                body: JSON.stringify({ budget, deliveries_per_year: deliveries, years }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Something went wrong');
            }
            const data = await response.json();
            setAmountOwing(data.amount_owing);
        } catch (err: any) {
            setError(err.message || 'Price calculation failed.');
            toast.error("Calculation Error", { description: err.message });
        } finally {
            setIsApiCalculating(false);
        }
    }, [planId]);

    const debouncedCalculateUpfront = useMemo(() => debounce(calculateUpfront, 500), [calculateUpfront]);

    useEffect(() => {
        if (!isLoading) {
            debouncedCalculateUpfront(formData.budget, formData.deliveries_per_year, formData.years);
        }
        return () => { debouncedCalculateUpfront.cancel?.(); };
    }, [formData, isLoading, debouncedCalculateUpfront]);

    const handleFormChange = (field: keyof PlanStructureData, value: number | string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = async () => {
        if (!planId) return;
        if (amountOwing === null) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            await updateFlowerPlan(planId, { ...formData, budget: String(formData.budget), total_amount: amountOwing });
            navigate(`/book-flow/flower-plan/${planId}/confirmation`);
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to save plan structure.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Plan: Structure | ForeverFlower" />
                <StructureEditor
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSave={handleNext}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                    isLoading={isLoading}
                    title="Define the Plan's Structure"
                    saveButtonText="Next: Select Preferences"
                    amountOwing={amountOwing}
                    isApiCalculating={isApiCalculating}
                    isDebouncePending={isDebouncePending}
                    calculationError={error}
                    setIsDebouncePending={setIsDebouncePending}
                    backButtonTo={planId ? `/book-flow/flower-plan/${planId}/recipient` : '/dashboard'}
                />
            </div>
        </div>
    );
};

export default StructurePage;
