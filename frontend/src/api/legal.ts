import { handleResponse } from './helpers';
import { authedFetch } from './apiClient';
import type { TermsAndConditions } from "@/types";

export async function getTermsByType(type: 'florist' | 'customer' | 'affiliate'): Promise<TermsAndConditions> {
    const response = await fetch(`/api/data/terms/latest/?type=${type}`);
    return handleResponse(response);
}

export async function acceptTerms(type: 'florist' | 'customer' | 'affiliate'): Promise<void> {
    const response = await authedFetch('/api/data/terms/accept/', {
        method: 'POST',
        body: JSON.stringify({ terms_type: type }),
    });
    return handleResponse(response);
}
