// foreverflower/frontend/src/pages/flow/CreatePlanStep1_RecipientPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { RecipientData } from '@/forms/RecipientForm';
import RecipientEditor from '@/components/plan/RecipientEditor';
import Seo from '@/components/Seo';

const CreatePlanStep1_RecipientPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<RecipientData>(() => {
        // Initialize state from local storage or with default values
        const savedData = localStorage.getItem('newPlanRecipientData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            recipient_first_name: '',
            recipient_last_name: '',
            recipient_street_address: '',
            recipient_suburb: '',
            recipient_city: '',
            recipient_state: '',
            recipient_postcode: '',
            recipient_country: 'New Zealand', // Default country
        };
    });
    
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a plan.");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleFormChange = (field: keyof RecipientData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // Basic validation
        if (!formData.recipient_first_name || !formData.recipient_street_address || !formData.recipient_city) {
            toast.error("Please fill in at least the recipient's first name, address, and city.");
            return;
        }
        
        // Save to local storage and proceed to the next step
        localStorage.setItem('newPlanRecipientData', JSON.stringify(formData));
        navigate('/book-flow/flower-plan/step-2');
    };
    
    const handleCancel = () => {
        // Clear local storage and go back to dashboard
        localStorage.removeItem('newPlanRecipientData');
        localStorage.removeItem('newPlanStructureData');
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Plan: Recipient | ForeverFlower" />
                <div className="text-center mb-4 text-black">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-gray-500">Step 1 of 3</h1>
                </div>
                <RecipientEditor
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSave={handleNext}
                    onCancel={handleCancel}
                    isSaving={false} // This page doesn't have a long-running save operation
                    isLoading={false} // No data is loaded on this page
                    title="Who is this plan for?"
                    saveButtonText="Next: Plan Structure"
                    showCancelButton={true}
                    cancelButtonText="Cancel"
                />
            </div>
        </div>
    );
};

export default CreatePlanStep1_RecipientPage;
