
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { UserProfile } from "@/types";

export async function getDashboardAnalytics(): Promise<any[]> {
    const response = await authedFetch('/api/data/analytics/dashboard/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getUserProfile(): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
}

export async function changePassword(passwordData: { old_password: string, new_password: string, new_password_confirm: string }): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/change-password/', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
}

export async function deleteAccount(): Promise<void> {
  const response = await authedFetch('/api/users/delete/', {
    method: 'DELETE',
  });
  await handleResponse(response);
}
