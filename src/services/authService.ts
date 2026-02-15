import { API_BASE_URL, setAuthToken, clearAuthToken, getAuthToken } from './api';

// ============================================================
// TYPES
// ============================================================

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

// ============================================================
// AUTH FUNCTIONS
// ============================================================

/**
 * Sign in with email and password
 */
export const signIn = async (
    email: string,
    password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // DEBUG: Log the entire response to see structure
        console.log('[AuthService] Signin response:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            return { success: false, error: data.message || 'Sign in failed' };
        }

        // Store token
        const token = data.token || data.data?.token;
        console.log('[AuthService] Extracted token:', token ? 'Token found' : 'NO TOKEN IN RESPONSE');

        if (token) {
            await setAuthToken(token);
        }

        const user: AuthUser = {
            id: data.user?.id || data.data?.user?.id || 0,
            name: data.user?.name || data.data?.user?.name || '',
            email: data.user?.email || data.data?.user?.email || email,
            role: data.user?.role || data.data?.user?.role || 'CUSTOMER',
        };

        return { success: true, user };
    } catch (error) {
        console.error('[AuthService] Sign in error:', error);
        return { success: false, error: 'Network error. Check your connection.' };
    }
};

/**
 * Sign up with name, email, and password
 */
export const signUp = async (
    name: string,
    email: string,
    password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Sign up failed' };
        }

        const token = data.token || data.data?.token;
        if (token) {
            await setAuthToken(token);
        }

        const user: AuthUser = {
            id: data.user?.id || data.data?.user?.id || 0,
            name: data.user?.name || data.data?.user?.name || name,
            email: data.user?.email || data.data?.user?.email || email,
            role: data.user?.role || data.data?.user?.role || 'CUSTOMER',
        };

        return { success: true, user };
    } catch (error) {
        console.error('[AuthService] Sign up error:', error);
        return { success: false, error: 'Network error. Check your connection.' };
    }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
    await clearAuthToken();
};

/**
 * Check if user is authenticated
 */
export const checkAuth = async (): Promise<{
    authenticated: boolean;
    user?: AuthUser;
}> => {
    console.log('[AuthService] checkAuth called');
    const token = await getAuthToken();
    console.log('[AuthService] Token exists:', token ? 'YES' : 'NO');

    if (!token) {
        console.log('[AuthService] No token found, returning unauthenticated');
        return { authenticated: false };
    }

    try {
        console.log('[AuthService] Verifying token with /auth/me');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('[AuthService] /auth/me response status:', response.status);

        if (!response.ok) {
            console.log('[AuthService] Token invalid, clearing and returning unauthenticated');
            await clearAuthToken();
            return { authenticated: false };
        }

        const data = await response.json();
        const userData = data.user || data.data?.user || data;

        console.log('[AuthService] Token valid, user authenticated:', userData.email);
        return {
            authenticated: true,
            user: {
                id: userData.id || 0,
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'CUSTOMER',
            },
        };
    } catch (error) {
        console.log('[AuthService] checkAuth error:', error);
        console.log('[AuthService] Clearing token and returning unauthenticated');
        await clearAuthToken();
        return { authenticated: false };
    }
};

export default { signIn, signUp, signOut, checkAuth };
