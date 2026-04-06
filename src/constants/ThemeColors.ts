// Color themes for the Cafeteria app - Brown/Gold theme
// Based on new HTML design reference

export const DarkTheme = {
    // Backgrounds
    background: '#351C15',       // Deep Brown
    cardBackground: '#4A2820',   // Surface Brown
    categoryBackground: '#351C15', // Same as background for inner elements
    inputBackground: '#4A2820',  // Surface Brown

    // Accent colors
    primary: '#f9d006',          // Gold Yellow
    primaryLight: '#FADC4E',     // Lighter gold
    priceOrange: '#f9d006',      // Same as primary

    // Text colors
    textPrimary: '#F9F4E0',      // Light Beige
    textSecondary: '#C2B2A0',    // Muted Beige
    textMuted: '#C2B2A0',        // Muted Beige

    // Special text
    realWhite: '#FFFFFF',        // Pure white for overlays/images
    brownDark: '#351C15',        // For text on primary buttons

    // Status colors
    success: '#22C55E',
    error: '#EF4444',

    // Border & dividers
    border: '#5D3A32',           // Subtle brown border
    divider: '#5D3A32',

    // Tab bar
    tabBarBackground: '#4A2820',
    tabBarActive: '#f9d006',
    tabBarInactive: '#C2B2A0',

    // Additional
    statusBarStyle: 'light-content' as 'light-content' | 'dark-content',
    isDark: true,

    // Shadows
    shadowColor: 'rgba(0,0,0,0.3)',
};

export const LightTheme = {
    // Backgrounds
    background: '#F9F4E0',       // Light Beige
    cardBackground: '#FFFFFF',
    categoryBackground: '#F5EDD8',
    inputBackground: '#FFFFFF',

    // Accent colors
    primary: '#f9d006',          // Gold Yellow
    primaryLight: '#FADC4E',
    priceOrange: '#f9d006',

    // Text colors
    textPrimary: '#351C15',      // Deep Brown
    textSecondary: '#5D3A32',
    textMuted: '#8B7355',

    // Special text
    realWhite: '#FFFFFF',
    brownDark: '#351C15',

    // Status colors
    success: '#22C55E',
    error: '#EF4444',

    // Border & dividers
    border: '#E8DCC8',
    divider: '#F0E6D2',

    // Tab bar
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#f9d006',
    tabBarInactive: '#8B7355',

    // Additional
    statusBarStyle: 'dark-content' as 'light-content' | 'dark-content',
    isDark: false,

    // Shadows
    shadowColor: 'rgba(0,0,0,0.1)',
};

export type ThemeColors = typeof DarkTheme & typeof LightTheme;

export default { DarkTheme, LightTheme };
