import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DarkTheme, LightTheme, ThemeColors } from '../constants/ThemeColors';

interface ThemeContextType {
    theme: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
    setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(false); // Default to light mode

    const theme = isDark ? DarkTheme : LightTheme;

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const setDarkMode = (dark: boolean) => {
        setIsDark(dark);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
