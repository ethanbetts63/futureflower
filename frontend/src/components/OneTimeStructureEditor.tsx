// foreverflower/frontend/src/components/OneTimeStructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
// Assuming these API calls will be created later
// import { getOneTimeOrder, updateOneTimeOrder, calculateOneTimePrice } from '@/api';
import type { OneTimeStructureData, OneTimeStructureEditorProps } from '@/types'; // Import from '@/types'
import OneTimeStructureForm from '@/forms/OneTimeStructureForm';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';
import PaymentInitiatorButton from './PaymentInitiatorButton';

// Placeholder for OneTimeOrder type, will eventually come from '@/types'
// This should match the backend model fields after migration
interface OneTimeOrder {
    id: string;
    budget: number;
    start_date: string;
    preferred_delivery_time: string | null;
    delivery_notes: string | null;
    total_amount: number; // This will be the calculated price
    // ... other fields from OrderBase
}

// Placeholder for PartialOneTimeOrder type, will eventually come from '@/types'
interface PartialOneTimeOrder {
    budget?: number;
    start_date?: string;
    preferred_delivery_time?: string | null;
    delivery_notes?: string | null;
    total_amount?: number;
}


// --- Placeholder API Functions (will be replaced by actual implementations) ---
const getOneTimeOrder = async (orderId: string): Promise<OneTimeOrder> => {
    // Simulate API call
    return new Promise(resolve => setTimeout(() => resolve({
        id: orderId,
        budget: 75,
        start_date: new Date().toISOString().split('T')[0],
        preferred_delivery_time: null,
        delivery_notes: null,
        total_amount: 0,
    }), 500));
};

const updateOneTimeOrder = async (orderId: string, payload: PartialOneTimeOrder): Promise<OneTimeOrder> => {
    // Simulate API call
    console.log(`Updating OneTimeOrder ${orderId} with:`, payload);
    return new Promise(resolve => setTimeout(() => resolve({
        id: orderId,
        budget: payload.budget || 75,
        start_date: payload.start_date || new Date().toISOString().split('T')[0],
        preferred_delivery_time: payload.preferred_delivery_time || null,
        delivery_notes: payload.delivery_notes || null,
        total_amount: payload.total_amount || 0,
    }), 500));
};

interface CalculateOneTimePriceResponse {
    price_per_delivery: number;
}

const calculateOneTimePrice = async (_orderId: string, budget: number): Promise<CalculateOneTimePriceResponse> => {
    // Simulate API call: simple budget + 15 (min fee) + 5%
    const fee = Math.max(budget * 0.05, 15.0);
    const price = budget + fee;
    return new Promise(resolve => setTimeout(() => resolve({ price_per_delivery: price }), 300));
};
// --- End Placeholder API Functions ---


const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const OneTimeStructureEditor: React.FC<OneTimeStructureEditorProps> = ({
    mode,
    title,
    description,
    saveButtonText,
    onSaveNavigateTo,
    backPath,
}) => {
    const { planId } = useParams<{ planId: string }>(); // Using planId for consistency with other editors
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Core State
    const [formData, setFormData] = useState<OneTimeStructureData>({
        budget: 75,
        start_date: getMinDateString(),
        preferred_delivery_time: null,
        delivery_notes: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Price calculation state
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(true);
    const [calculationError, setCalculationError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage an order.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No order specified.");
            navigate('/dashboard'); // Or appropriate fallback
            return;
        }

        setIsLoading(true);
        getOneTimeOrder(planId)
            .then((order: OneTimeOrder) => {
                setFormData({
                    budget: Number(order.budget) || 75,
                    start_date: order.start_date || getMinDateString(),
                    preferred_delivery_time: order.preferred_delivery_time || null,
                    delivery_notes: order.delivery_notes || null,
                });
                setTotalAmount(order.total_amount || null); // Load existing total amount
            })
            .catch(error => {
                toast.error("Failed to load order details", { description: error.message });
                navigate(backPath);
            })
            .finally(() => setIsLoading(false));
    }, [planId, isAuthenticated, navigate, backPath]);

    const calculateAmount = useCallback(async (budget: number) => {
        if (!planId) {
             setIsApiCalculating(false);
             setIsDebouncePending(false);
             return;
        }

        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setCalculationError(null);
        setTotalAmount(null);

        try {
            const data = await calculateOneTimePrice(planId, budget);
            setTotalAmount(data.price_per_delivery);
        } catch (err: any) {
            setCalculationError(err.message);
            toast.error("Price Calculation Error", { description: err.message });
        } finally {
            setIsApiCalculating(false);
        }
    }, [planId]);

    const debouncedCalculate = useMemo(() => debounce(calculateAmount, 500), [calculateAmount]);

    useEffect(() => {
        if (!isLoading) {
            setIsDebouncePending(true);
            debouncedCalculate(formData.budget);
        }
        return () => debouncedCalculate.cancel?.();
    }, [formData.budget, isLoading, debouncedCalculate]);

    const handleFormChange = (field: keyof OneTimeStructureData, value: number | string | null) => {
        setFormData((prev: OneTimeStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId || totalAmount === null) {
            toast.error("Please wait for the total amount to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialOneTimeOrder = {
                ...formData,
                total_amount: totalAmount, // Save the calculated total amount
            };
            await updateOneTimeOrder(planId, payload);
            
            if (mode === 'edit') {
                toast.success("Order details updated successfully!");
            }
            navigate(onSaveNavigateTo.replace('{planId}', planId)); // Replace {planId} with actual planId
        } catch (err: any) {
            toast.error("Failed to save order details.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    }
    
    const showPaymentButton = mode === 'create' || (mode === 'edit' && totalAmount !== null && totalAmount > 0);
    const isActionDisabled = Boolean(isSaving || isApiCalculating || isDebouncePending || totalAmount === null || calculationError);

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title={`${title} | ForeverFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <OneTimeStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                        />
                        <div className="mt-8 text-center h-12 flex flex-col items-center justify-center">
                            {(isApiCalculating || isDebouncePending) ? (
                                <Spinner className="h-8 w-8" />
                            ) : totalAmount !== null ? (
                                <>
                                    <div className="text-2xl font-bold">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-gray-600">Total Price (inc. fees)</p>
                                </>
                            ) : calculationError ? (
                                 <div className="text-red-500 text-sm">{calculationError}</div>
                            ) : null}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath.replace('{planId}', planId || '')} />
                        {showPaymentButton ? (
                            <PaymentInitiatorButton
                                size="lg"
                                itemType="ONE_TIME_DELIVERY"
                                details={{
                                    one_time_order_id: planId, // Use planId as one_time_order_id
                                    budget: formData.budget,
                                    start_date: formData.start_date,
                                    preferred_delivery_time: formData.preferred_delivery_time,
                                    delivery_notes: formData.delivery_notes,
                                    total_amount: totalAmount,
                                }}
                                disabled={isActionDisabled}
                            >
                                {mode === 'create' ? 'Proceed to Payment' : 'Pay for Changes'}
                            </PaymentInitiatorButton>
                        ) : (
                            <Button size="lg" onClick={handleSave} disabled={isActionDisabled}>
                                {isSaving && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Saving...' : saveButtonText}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default OneTimeStructureEditor;
