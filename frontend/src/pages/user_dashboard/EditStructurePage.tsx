// C:\Users\ethan\coding\foreverflower\frontend\src\pages\user_dashboard\EditStructurePage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getFlowerPlan, updateFlowerPlan, type PartialFlowerPlan } from '@/api';
import { authedFetch } from '@/apiClient';
import type { PlanStructureData } from '@/forms/PlanStructureForm';
import StructureEditor from '@/components/plan/StructureEditor';
import { debounce } from '@/utils/debounce';

const getMinDateString = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  return minDate.toISOString().split('T')[0];
};

const EditStructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<PlanStructureData>({
        budget: 75,
        deliveries_per_year: 1,
        years: 5,
        start_date: '',
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
            toast.error("You must be logged in to edit a plan.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No flower plan specified.");
            navigate('/dashboard');
            return;
        }

        const fetchPlanData = async () => {
            setIsLoading(true);
            try {
                const plan = await getFlowerPlan(planId);
                setFormData({
                    budget: plan.budget,
                    deliveries_per_year: plan.deliveries_per_year,
                    years: plan.years,
                    start_date: plan.start_date || getMinDateString(),
                });
            } catch (err) {
                toast.error("Failed to load plan data.");
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanData();
    }, [planId, isAuthenticated, navigate]);

    const calculateModification = useCallback((budget: number, deliveries: number, years: number) => {
        if (!planId) return;
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setAmountOwing(null);

        authedFetch(`/api/events/flower-plans/${planId}/calculate-modification/`, {
            method: 'POST',
            body: JSON.stringify({ budget, deliveries_per_year: deliveries, years }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.detail || "Server error");
                });
            }
            return response.json();
        })
        .then((data: { amount_owing: number }) => {
            setAmountOwing(data.amount_owing);
        })
        .catch(err => {
            setError(err.message);
            toast.error("Calculation Error", { description: err.message });
        })
        .finally(() => {
            setIsApiCalculating(false);
        });
    }, [planId]);

    const debouncedCalculateModification = useMemo(() => debounce(calculateModification, 500), [calculateModification]);

    useEffect(() => {
        if (!isLoading && !isSaving) {
            debouncedCalculateModification(formData.budget, formData.deliveries_per_year, formData.years);
        }
        return () => { debouncedCalculateModification.cancel?.(); };
    }, [formData, isLoading, isSaving, debouncedCalculateModification]);


    const handleFormChange = (field: keyof PlanStructureData, value: number | string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        if (amountOwing && amountOwing > 0) {
            const params = new URLSearchParams({
                source: 'management',
                budget: formData.budget.toString(),
                deliveries_per_year: formData.deliveries_per_year.toString(),
                years: formData.years.toString(),
                amount: amountOwing.toString(),
            });
            navigate(`/book-flow/flower-plan/${planId}/payment?${params.toString()}`);
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialFlowerPlan = { ...formData };
            await updateFlowerPlan(planId, payload);
            toast.success("Plan updated successfully!");
            navigate(`/dashboard/plans/${planId}/overview`);
        } catch (err: any) {
            toast.error("Failed to update plan structure.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (planId) {
            navigate(`/dashboard/plans/${planId}/overview`);
        } else {
            navigate('/dashboard');
        }
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Edit Plan Structure | ForeverFlower" />
                <StructureEditor
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                    isLoading={isLoading}
                    title="Edit Plan Structure"
                    amountOwing={amountOwing}
                    isApiCalculating={isApiCalculating}
                    isDebouncePending={isDebouncePending}
                    calculationError={error}
                    setIsDebouncePending={setIsDebouncePending}
                    backButtonTo={planId ? `/dashboard/plans/${planId}/overview` : '/dashboard'}
                />
            </div>
        </div>
    );
};

export default EditStructurePage;
