
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { FaqItem } from "@/types";

export async function getFaqs(page: string): Promise<FaqItem[]> {
    const response = await authedFetch(`/api/data/faqs/?page=${page}`, {
        method: 'GET',
    });
    return handleResponse(response);
}
