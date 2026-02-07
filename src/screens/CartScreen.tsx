import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart, useTheme } from '../context';
import { formatCurrency } from '../utils/currency';

const CartScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const {
        items,
        updateQuantity,
    } = useCart();

    const mockItems = [
        {
            id: 'mock1',
            name: 'Masala Dosa',
            variant: 'Regular, Extra Chutney',
            price: 80,
            quantity: 1,
            image: '',
            category: 'Main Meal'
        },
        {
            id: 'mock2',
            name: 'Iced Latte',
            variant: 'Oat Milk, No Sugar',
            price: 120,
            quantity: 1,
            image: '',
            category: 'Hot Brews'
        }
    ];

    const displayItems = items.length > 0 ? items : mockItems;

    const subtotal = displayItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxesAndCharges = 10;
    const grandTotal = subtotal + taxesAndCharges;

    const styles = createStyles(theme);

    const handlePlaceOrder = () => {
        // Navigate to payment screen instead of alert
        (navigation as any).navigate('Payment', { total: grandTotal });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {displayItems.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="shopping-cart" size={64} color={theme.cardBackground} />
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
                            <Text style={styles.browseText}>Browse Menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.itemsContainer}>
                            {displayItems.map((item) => (
                                <View key={item.id} style={styles.itemCard}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemVariant}>
                                            {item.variant || 'Regular, Extra Chutney'}
                                        </Text>
                                        <Text style={styles.itemPrice}>
                                            {formatCurrency(item.price)}
                                        </Text>
                                    </View>

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                if (items.find(i => i.id === item.id)) {
                                                    updateQuantity(item.id, item.quantity - 1);
                                                } else {
                                                    Alert.alert("Mock Item", "Cannot update quantity of mock item.");
                                                }
                                            }}
                                        >
                                            <MaterialIcons name="remove" size={16} color={theme.background} />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => {
                                                if (items.find(i => i.id === item.id)) {
                                                    updateQuantity(item.id, item.quantity + 1);
                                                } else {
                                                    Alert.alert("Mock Item", "Cannot update quantity of mock item.");
                                                }
                                            }}
                                        >
                                            <MaterialIcons name="add" size={16} color={theme.background} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={{ flex: 1, minHeight: 16 }} />

                        <View style={styles.billSummary}>
                            <Text style={styles.billHeader}>BILL SUMMARY</Text>

                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Subtotal</Text>
                                <Text style={styles.billValue}>{formatCurrency(subtotal)}</Text>
                            </View>

                            <View style={[styles.billRow, styles.billRowBorder]}>
                                <Text style={styles.billLabel}>Taxes & Charges</Text>
                                <Text style={styles.billValue}>{formatCurrency(taxesAndCharges)}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                                <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.payButton} onPress={handlePlaceOrder}>
                            <Text style={styles.payButtonText}>PROCEED TO PAY</Text>
                            <View style={styles.payButtonPriceContainer}>
                                <Text style={styles.payButtonPrice}>{formatCurrency(grandTotal)}</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: theme.background,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        letterSpacing: -0.5,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
        flexGrow: 1,
    },
    itemsContainer: {
        gap: 12,
        marginBottom: 16,
    },
    itemCard: {
        backgroundColor: theme.cardBackground,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    itemInfo: {
        flex: 1,
        paddingRight: 16,
        gap: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        lineHeight: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    itemVariant: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(249, 244, 224, 0.6)',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.primary,
        marginTop: 4,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(53, 28, 21, 0.3)',
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        height: 36,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        width: 32,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    emptyText: {
        color: 'rgba(249, 244, 224, 0.6)',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    browseText: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    billSummary: {
        backgroundColor: theme.cardBackground,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    billHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(249, 244, 224, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    billRowBorder: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed',
    },
    billLabel: {
        fontSize: 14,
        color: 'rgba(249, 244, 224, 0.7)',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    grandTotalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    payButton: {
        width: '100%',
        backgroundColor: theme.primary,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    payButtonText: {
        color: theme.background,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    payButtonPriceContainer: {
        backgroundColor: 'rgba(53, 28, 21, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    payButtonPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.background,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default CartScreen;
