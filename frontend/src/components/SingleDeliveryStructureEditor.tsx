// foreverflower/frontend/src/components/SingleDeliveryStructureEditor.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
// Assuming these API calls will be created later
// import { getSingleDeliveryOrder, updateSingleDeliveryOrder, calculateSingleDeliveryPrice } from '@/api';
import type { SingleDeliveryStructureData, SingleDeliveryStructureEditorProps, SingleDeliveryOrder, PartialSingleDeliveryOrder, CalculateSingleDeliveryPriceResponse } from '@/types'; // Import from '@/types'
import SingleDeliveryStructureForm from '@/forms/SingleDeliveryStructureForm';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';
import PaymentInitiatorButton from './PaymentInitiatorButton';

// --- Placeholder API Functions (will be replaced by actual implementations) ---


const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureEditor: React.FC<SingleDeliveryStructureEditorProps> = ({
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
    const [formData, setFormData] = useState<SingleDeliveryStructureData>({
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
        getSingleDeliveryOrder(planId)
            .then((order: SingleDeliveryOrder) => {
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
            const data = await calculateSingleDeliveryPrice(planId, budget);
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

    const handleFormChange = (field: keyof SingleDeliveryStructureData, value: number | string | null) => {
        setFormData((prev: SingleDeliveryStructureData) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId || totalAmount === null) {
            toast.error("Please wait for the total amount to be calculated.");
            return;
        }

        setIsSaving(true);
        try {
            const payload: PartialSingleDeliveryOrder = {
                ...formData,
                total_amount: totalAmount, // Save the calculated total amount
            };
            await updateSingleDeliveryOrder(planId, payload);
            
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
                        <SingleDeliveryStructureForm
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
                                itemType="ONE_TIME_DELIVERY_NEW"
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

export default SingleDeliveryStructureEditor;
