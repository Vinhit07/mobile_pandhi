
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useCart } from '../context';

interface BottomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

const TAB_ICONS: Record<string, { default: string; active: string }> = {
    Home: { default: 'home', active: 'home' },
    Orders: { default: 'receipt-long', active: 'receipt-long' },
    Cart: { default: 'shopping-cart', active: 'shopping-cart' },
    Wallet: { default: 'account-balance-wallet', active: 'account-balance-wallet' },
    Profile: { default: 'person', active: 'person' },
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();
    const { items } = useCart();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme, insets.bottom);

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = route.name;
                const isFocused = state.index === index;
                const isCart = route.name === 'Cart';

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const iconName = isFocused
                    ? TAB_ICONS[route.name]?.active
                    : TAB_ICONS[route.name]?.default;

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabButton}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name={iconName as any}
                                size={24}
                                color={isFocused ? theme.primary : theme.textMuted}
                            />
                            {isCart && cartItemCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.label,
                            isFocused && { color: theme.primary }
                        ]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const createStyles = (theme: any, bottomInset: number) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.cardBackground,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: Math.max(bottomInset, 24), // Increased bottom padding slightly
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 20,
        },
        tabButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingVertical: 4,
        },
        iconContainer: {
            position: 'relative',
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            fontSize: 10,
            fontWeight: '600',
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontFamily: 'PlusJakartaSans_600SemiBold',
        },
        badge: {
            position: 'absolute',
            top: -2,
            right: -4,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#DC2626', // Red for visibility
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: theme.cardBackground,
            paddingHorizontal: 2,
        },
        badgeText: {
            fontSize: 9,
            fontWeight: '800',
            color: '#FFFFFF', // White text on Red
            fontFamily: 'PlusJakartaSans_700Bold',
        },
    });

export default BottomTabBar;
