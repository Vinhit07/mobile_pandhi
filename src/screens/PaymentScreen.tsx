
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme, useCart } from '../context';
import { formatCurrency } from '../utils/currency';

// Define route params if needed, though we can also rely on context
type RootStackParamList = {
    Payment: { total: number };
    OrderSuccess: { items: any[], total: number };
};

const PaymentScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'Payment'>>();
    const { theme } = useTheme();
    const { items, clearCart } = useCart();

    // Total passed from Cart or safe default
    // We should ideally use the calculation from CartScreen logic or pass it.
    // For now, let's assume route.params?.total or calculate from items + tax
    const cartTotal = route.params?.total || 0;

    const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'upi' | 'card'>('wallet');

    const styles = createStyles(theme);

    const handlePayNow = () => {
        // Simulate payment processing
        // Clear cart here or in next screen? 
        // Better here before navigating to success to prevent "back" navigation showing full cart
        // But we need the items for the success screen summary.
        // So we grab items first.
        const orderedItems = [...items];
        const paidTotal = cartTotal;

        clearCart(); // Clear the cart context

        (navigation as any).navigate('OrderSuccess', {
            items: orderedItems,
            total: paidTotal
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back-ios-new" size={18} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Total Amount Display */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                    <View style={styles.amountWrapper}>
                        <Text style={styles.amountText}>{formatCurrency(cartTotal)}</Text>
                        <View style={styles.glowEffect} />
                    </View>
                </View>

                {/* Payment Options */}
                <View style={styles.optionsContainer}>
                    {/* Wallet Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedMethod === 'wallet' && styles.optionSelected]}
                        onPress={() => setSelectedMethod('wallet')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="account-balance-wallet" size={24} color={theme.primary} />
                        </View>
                        <View style={styles.optionInfo}>
                            <View style={styles.walletHeader}>
                                <Text style={styles.optionTitle}>Wallet Balance</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>ENOUGH</Text>
                                </View>
                            </View>
                            <Text style={styles.optionSubtitle}>
                                Current balance: <Text style={styles.balanceText}>₹450.00</Text>
                            </Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <View style={[styles.radioOuter, selectedMethod === 'wallet' && styles.radioSelected]}>
                                {selectedMethod === 'wallet' && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* UPI Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedMethod === 'upi' && styles.optionSelected]}
                        onPress={() => setSelectedMethod('upi')}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.iconContainer]}>
                            <MaterialIcons name="qr-code-scanner" size={24} color={theme.textPrimary + 'B3'} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionTitle}>UPI</Text>
                            <Text style={styles.optionSubtitle}>Google Pay, PhonePe</Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <View style={[styles.radioOuter, selectedMethod === 'upi' && styles.radioSelected]}>
                                {selectedMethod === 'upi' && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Card Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, selectedMethod === 'card' && styles.optionSelected]}
                        onPress={() => setSelectedMethod('card')}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.iconContainer]}>
                            <MaterialIcons name="credit-card" size={24} color={theme.textPrimary + 'B3'} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionTitle}>Credit / Debit Card</Text>
                            <Text style={styles.optionSubtitle}>Visa, Mastercard</Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <View style={[styles.radioOuter, selectedMethod === 'card' && styles.radioSelected]}>
                                {selectedMethod === 'card' && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                    <Text style={styles.payButtonText}>PAY NOW</Text>
                    <View style={styles.dot} />
                    <Text style={styles.payButtonText}>{formatCurrency(cartTotal)}</Text>
                </TouchableOpacity>
            </View>

            {/* Fade Gradient Overlay for footer is tricky in RN without LinearGradient, 
                but we can skip it or use a simple view with opacity if needed. 
                Focus on the button. 
            */}
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: -0.5,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 120, // Space for footer
        alignItems: 'center',
    },
    totalContainer: {
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
    },
    totalLabel: {
        color: theme.textPrimary + '99', // 60% opacity
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    amountWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountText: {
        fontSize: 48,
        fontWeight: '800',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: -2,
    },
    glowEffect: {
        position: 'absolute',
        width: 96,
        height: 96,
        backgroundColor: theme.primary,
        opacity: 0.1,
        borderRadius: 48,
        zIndex: -1,
    },
    optionsContainer: {
        width: '100%',
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.cardBackground,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'transparent', // Default border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    optionSelected: {
        borderColor: theme.primary + '80', // 50% opacity primary
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: theme.primary + '1A', // 10% opacity
    },
    optionInfo: {
        flex: 1,
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    badge: {
        backgroundColor: theme.primary + '33', // 20% opacity
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.primary + '33',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    optionSubtitle: {
        fontSize: 14,
        color: theme.textPrimary + '99',
        marginTop: 2,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    balanceText: {
        color: theme.textPrimary,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    radioContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6d4c41',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: theme.primary,
        backgroundColor: theme.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.cardBackground, // Creates the dot effect
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: 24,
        paddingBottom: 40, // Ensure safe area
    },
    payButton: {
        backgroundColor: theme.primary,
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        gap: 8,
    },
    payButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.background,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.background,
        opacity: 0.4,
    },
});

export default PaymentScreen;
