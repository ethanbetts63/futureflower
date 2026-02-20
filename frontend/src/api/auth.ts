
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { AuthResponse } from "@/types";
import type { ProfileCreationData } from "../types/ProfileCreationData";

type PasswordResetConfirmPayload = {
  password: string;
  password_confirm: string;
}

export async function loginUser(email: string, password: string): Promise<{ detail: string }> {
  const response = await authedFetch('/api/token/', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  });
  return handleResponse(response);
}

export async function registerUser(userData: ProfileCreationData): Promise<AuthResponse> {
  const response = await authedFetch('/api/users/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function logoutUser(): Promise<void> {
  await authedFetch('/api/token/logout/', {
    method: 'POST',
  });
}

export async function claimAccount(password: string): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/claim/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
}

export async function confirmPasswordReset(uid: string, token: string, passwordData: PasswordResetConfirmPayload): Promise<{ detail: string }> {
  const response = await authedFetch(`/api/users/password-reset/confirm/${uid}/${token}/`, {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
}

export async function requestPasswordReset(email: string): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/password-reset/request/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}
