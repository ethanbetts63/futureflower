
import { handleResponse } from './helpers';
import type { TermsAndConditions } from "@/types";

export async function getTermsByType(type: 'florist' | 'customer' | 'affiliate'): Promise<TermsAndConditions> {
    const response = await fetch(`/api/data/terms/latest/?type=${type}`);
    return handleResponse(response);
}
