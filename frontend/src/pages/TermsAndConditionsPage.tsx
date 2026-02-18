import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getTermsByType } from '@/api';
import type { TermsAndConditions } from '@/types/TermsAndConditions';
import Seo from '@/components/Seo';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const VALID_TYPES = ['florist', 'customer', 'affiliate'] as const;
type TermsType = typeof VALID_TYPES[number];

const TYPE_LABELS: Record<TermsType, string> = {
    florist: 'Florist',
    customer: 'Customer',
    affiliate: 'Affiliate',
};

const TermsAndConditionsPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const [terms, setTerms] = useState<TermsAndConditions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const validType = VALID_TYPES.includes(type as TermsType) ? (type as TermsType) : null;

    useEffect(() => {
        if (!validType) return;

        const fetchTerms = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getTermsByType(validType);
                setTerms(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load terms and conditions.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTerms();
    }, [validType]);

    if (!validType) {
        return <Navigate to="/terms-and-conditions/customer" replace />;
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 mr-2" />
                    <p>Loading...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (terms) {
            return <div dangerouslySetInnerHTML={{ __html: terms.content }} />;
        }

        return null;
    };

    return (
        <>
            <Seo title={`${TYPE_LABELS[validType]} Terms & Conditions | FutureFlower`} />
            <div className="container mx-auto px-4 py-8 max-w-4xl prose dark:prose-invert">
                {renderContent()}
            </div>
        </>
    );
};

export default TermsAndConditionsPage;
