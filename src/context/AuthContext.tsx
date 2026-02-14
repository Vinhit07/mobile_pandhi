import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, signIn, signUp, signOut, checkAuth } from '../services/authService';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkExistingAuth = async () => {
            try {
                const result = await checkAuth();
                if (result.authenticated && result.user) {
                    setUser(result.user);
                }
            } catch (error) {
                console.log('[AuthContext] Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkExistingAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const result = await signIn(email, password);
        if (result.success && result.user) {
            setUser(result.user);
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const register = async (name: string, email: string, password: string) => {
        const result = await signUp(name, email, password);
        if (result.success && result.user) {
            setUser(result.user);
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: user !== null,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
