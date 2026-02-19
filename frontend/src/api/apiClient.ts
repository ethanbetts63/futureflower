import { getCsrfToken } from '../utils/utils';

const SAFE_METHODS = /^(GET|HEAD|OPTIONS|TRACE)$/i;

/**
 * Attempts to refresh the access token by hitting the refresh endpoint.
 * The refresh token is sent automatically via its HttpOnly cookie.
 * Returns true if the refresh succeeded.
 */
async function refreshToken(): Promise<boolean> {
    try {
        const response = await fetch('/api/token/refresh/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        return response.ok;
    } catch (error) {
        console.error('Error during token refresh:', error);
        return false;
    }
}


/**
 * A custom fetch wrapper that handles cookie-based JWT authentication.
 * - Sends credentials (cookies) with every request
 * - Injects the CSRF token header for all mutating requests
 * - Automatically attempts a token refresh on 401 and retries once
 */
export async function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    options.credentials = 'include';
    options.headers = { ...(options.headers as Record<string, string>) };
    (options.headers as Record<string, string>)['Content-Type'] = 'application/json';

    if (!SAFE_METHODS.test(options.method || 'GET')) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            (options.headers as Record<string, string>)['X-CSRFToken'] = csrfToken;
        } else {
            console.warn('CSRF token not found. This request may be rejected by the server.');
        }
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
            console.log('Token refreshed, retrying original request...');
            response = await fetch(url, options);
        } else {
            console.error('Token refresh failed. Logging out.');
            window.dispatchEvent(new Event('auth-failure'));
        }
    }

    return response;
}
