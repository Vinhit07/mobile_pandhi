// API Service Layer - Base configuration and utilities
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// CONFIGURATION
// ============================================================

// Base URL for the backend API
// Use localhost for PC/emulator testing
// Use your computer's local IP (e.g., 192.168.29.163) for physical phone testing
export const API_BASE_URL = 'http://192.168.29.92:5500/api';

// Storage key for auth token
const TOKEN_KEY = 'auth_token';

// ============================================================
// TEMPORARY TEST TOKEN
// Replace this with actual token from login, or set to null to use mock data
// To get a real token:
// 1. POST to /api/auth/signin with email/password
// 2. Copy the token from response
// ============================================================
const TEST_TOKEN: string | null = null; // Set your token here for testing

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export const setAuthToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
    // First check for test token
    if (TEST_TOKEN) {
        return TEST_TOKEN;
    }
    // Otherwise get from storage
    return await AsyncStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getAuthToken();
    return token !== null;
};

// ============================================================
// HTTP CLIENT
// ============================================================

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    requireAuth?: boolean;
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
    const { method = 'GET', body, requireAuth = true } = options;

    console.log(`[API] ${method} ${endpoint} - Auth required: ${requireAuth}`);

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add auth header if required
        if (requireAuth) {
            const token = await getAuthToken();
            console.log(`[API] Token status:`, token ? `Token found (${token.substring(0, 20)}...)` : 'NO TOKEN');

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // No token available - return early for auth-required endpoints
                return {
                    data: null,
                    error: 'No authentication token available',
                    status: 401,
                };
            }
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body && method !== 'GET') {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        console.log(`[API] ${method} ${endpoint} - Response status: ${response.status}`);

        if (!response.ok) {
            return {
                data: null,
                error: data.message || 'Request failed',
                status: response.status,
            };
        }

        return {
            data,
            error: null,
            status: response.status,
        };
    } catch (error) {
        console.error(`[API] Error [${endpoint}]:`, error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Network error',
            status: 0,
        };
    }
};

// ============================================================
// CONVENIENCE METHODS
// ============================================================

export const api = {
    get: <T>(endpoint: string, requireAuth = true) =>
        apiRequest<T>(endpoint, { method: 'GET', requireAuth }),

    post: <T>(endpoint: string, body: any, requireAuth = true) =>
        apiRequest<T>(endpoint, { method: 'POST', body, requireAuth }),

    put: <T>(endpoint: string, body: any, requireAuth = true) =>
        apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth }),

    delete: <T>(endpoint: string, requireAuth = true) =>
        apiRequest<T>(endpoint, { method: 'DELETE', requireAuth }),
};

export default api;
