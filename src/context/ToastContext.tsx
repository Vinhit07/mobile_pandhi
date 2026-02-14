
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useTheme } from './ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Timer ref to clear timeout if needed
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
        setVisible(true);

        // Clear existing timer if any
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto hide after 2 seconds
        timerRef.current = setTimeout(() => {
            hideToast();
        }, 2000);
    }, [fadeAnim]);

    const hideToast = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            timerRef.current = null;
        });
    }, [fadeAnim]);

    const styles = createStyles(theme, insets.bottom);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.container,
                        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
                    ]}
                    pointerEvents="none"
                >
                    <View style={styles.content}>
                        <Text style={styles.text}>{message}</Text>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const createStyles = (theme: any, bottomInset: number) => StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: bottomInset + 80, // Above ViewCartPopup (which is around 80px or 20px depending on screen)
        // If ViewCartPopup is present, it might overlap.
        // But ViewCartPopup is mainly in Menu screens.
        // In HomeScreen, this is fine.
        // User asked for "simple message in bottom".
        // Let's position it reasonably high to clear bottom tabs/popups.
        left: 24,
        right: 24,
        alignItems: 'center',
        zIndex: 9999,
    },
    content: {
        backgroundColor: 'rgba(53, 28, 21, 0.95)', // theme.brownDark with opacity
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    text: {
        color: '#FFFFFF', // theme.background usually
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        textAlign: 'center',
    },
});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
