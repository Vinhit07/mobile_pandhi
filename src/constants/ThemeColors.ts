// Color themes for the Quick Byte app - Light and Dark themes

export const DarkTheme = {
    // Backgrounds
    background: '#1A1A1A',
    cardBackground: '#2A2A2A',
    categoryBackground: '#3A3A3A',
    inputBackground: '#2A2A2A',

    // Accent colors
    primary: '#FF6B35',
    primaryLight: '#FF8B5E',
    priceOrange: '#FF9500',

    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#9A9A9A',
    textMuted: '#6A6A6A',

    // Status colors
    success: '#4CAF50',
    error: '#FF5252',

    // Border & dividers
    border: '#3A3A3A',
    divider: '#2A2A2A',

    // Tab bar
    tabBarBackground: '#1A1A1A',
    tabBarActive: '#FF6B35',
    tabBarInactive: '#6A6A6A',

    // Additional
    statusBarStyle: 'light-content' as 'light-content' | 'dark-content',
    isDark: true,
};

export const LightTheme = {
    // Backgrounds
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    categoryBackground: '#F0F0F0',
    inputBackground: '#FFFFFF',

    // Accent colors
    primary: '#FF6B35',
    primaryLight: '#FF8B5E',
    priceOrange: '#FF9500',

    // Text colors
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',

    // Status colors
    success: '#4CAF50',
    error: '#FF5252',

    // Border & dividers
    border: '#E0E0E0',
    divider: '#EEEEEE',

    // Tab bar
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#FF6B35',
    tabBarInactive: '#999999',

    // Additional
    statusBarStyle: 'dark-content' as 'light-content' | 'dark-content',
    isDark: false,
};

export type ThemeColors = typeof DarkTheme & typeof LightTheme;

export default { DarkTheme, LightTheme };
