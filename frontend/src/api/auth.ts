
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { AuthResponse } from "@/types";
import type { ProfileCreationData } from "../types/forms";

type PasswordResetConfirmPayload = {
  password: string;
  password_confirm: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  return handleResponse(response);
}

export async function registerUser(userData: ProfileCreationData): Promise<AuthResponse> {
  const response = await fetch('/api/users/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function claimAccount(password: string): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/claim/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
}

export async function confirmPasswordReset(uid: string, token: string, passwordData: PasswordResetConfirmPayload): Promise<{ detail: string }> {
  const response = await fetch(`/api/users/password-reset/confirm/${uid}/${token}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
}

export async function requestPasswordReset(email: string): Promise<{ detail: string }> {
  const response = await fetch('/api/users/password-reset/request/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}
