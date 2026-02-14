import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { CartItemCard, OrderConfirmationModal } from '../components';
import { useCart, useTheme, useAuth, CartItem } from '../context';
import { formatCurrency } from '../utils/currency';
import { placeOrder, PlaceOrderRequest } from '../services/orderService';
import { isAuthenticated } from '../services/api';
import { getRazorpayKey, createOrderPayment, verifyOrderPayment } from '../services/paymentService';
import RazorpayCheckout from '../components/RazorpayCheckout';

const CartScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { user } = useAuth();
    const {
        items,
        updateQuantity,
        clearCart,
    } = useCart();

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
    const [orderTotal, setOrderTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'ONLINE'>('WALLET');
    const [isPlacing, setIsPlacing] = useState(false);

    // Razorpay state
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState<{ orderId: string; amount: number; keyId: string } | null>(null);

    // Use real cart items only - no mock data
    const displayItems = items;

    const subtotal = displayItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxesAndCharges = 10;
    const grandTotal = subtotal + taxesAndCharges;

    const buildOrderData = (method: 'WALLET' | 'UPI' | 'CARD' | 'CASH'): PlaceOrderRequest => {
        const orderItems = items.map(item => ({
            productId: parseInt(item.id, 10),
            quantity: item.quantity,
            unitPrice: item.price,
        }));

        return {
            totalAmount: getTotal(),
            paymentMethod: method,
            deliverySlot: 'SLOT_12_13',
            outletId: 1,
            items: orderItems,
        };
    };

    const handlePlaceOrder = async () => {
        const authenticated = await isAuthenticated();

        if (!authenticated) {
            // Fallback: Local order (mock mode)
            setOrderId(generateOrderId());
            setOrderedItems([...items]);
            setOrderTotal(getTotal());

            // Clear cart even in fallback mode
            clearCart();

            setShowOrderModal(true);
            return;
        }

        if (paymentMethod === 'ONLINE') {
            // Razorpay online payment flow
            await initiateOnlinePayment();
        } else {
            // Wallet payment flow
            await placeWalletOrder();
        }
    };

    const placeWalletOrder = async () => {
        setIsPlacing(true);
        try {
            const orderData = buildOrderData('WALLET');
            const result = await placeOrder(orderData);

            if (result.success && result.order) {
                setOrderId(result.order.orderNumber || generateOrderId());
                setOrderedItems([...items]);
                setOrderTotal(result.order.totalAmount);

                // Clear cart after successful order
                clearCart();

                setShowOrderModal(true);
            } else {
                Alert.alert('Order Failed', result.error || 'Failed to place order.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsPlacing(false);
        }
    };

    const initiateOnlinePayment = async () => {
        setIsPlacing(true);
        try {
            const keyId = await getRazorpayKey();
            if (!keyId) {
                Alert.alert('Error', 'Payment gateway not configured.');
                return;
            }

            const result = await createOrderPayment(getTotal());
            if (!result.success || !result.orderId) {
                Alert.alert('Error', result.error || 'Failed to create payment order.');
                return;
            }

            setCheckoutData({
                orderId: result.orderId,
                amount: result.amount!,
                keyId,
            });
            setShowCheckout(true);
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setIsPlacing(false);
        }
    };

    const handlePaymentSuccess = async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        setShowCheckout(false);
        setIsPlacing(true);

        try {
            // Verify payment
            const verifyResult = await verifyOrderPayment(
                data.razorpay_order_id,
                data.razorpay_payment_id,
                data.razorpay_signature
            );

            if (!verifyResult.success) {
                Alert.alert('Payment Failed', verifyResult.error || 'Payment verification failed.');
                return;
            }

            // Payment verified, now place the order
            const orderData = buildOrderData('UPI');
            const result = await placeOrder(orderData);

            if (result.success && result.order) {
                setOrderId(result.order.orderNumber || generateOrderId());
                setOrderedItems([...items]);
                setOrderTotal(result.order.totalAmount);

                // Clear cart after successful order
                clearCart();

                setShowOrderModal(true);
            } else {
                Alert.alert('Order Failed', result.error || 'Payment succeeded but order creation failed. Contact support.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong after payment. Contact support.');
        } finally {
            setIsPlacing(false);
        }
    };

    const generateOrderId = () => `ORD-${Date.now()}`;
    const getTotal = () => grandTotal;

    const handleOrderDone = () => {
        setShowOrderModal(false);
        navigation.navigate('Home' as never);
    };

    const styles = createStyles(theme);

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
                    <React.Fragment>
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

                        {/* Payment Method Selector */}
                        <Text style={styles.paymentMethodLabel}>PAYMENT METHOD</Text>
                        <View style={styles.paymentMethods}>
                            <TouchableOpacity
                                style={[
                                    styles.paymentOption,
                                    paymentMethod === 'WALLET' && styles.paymentOptionActive,
                                ]}
                                onPress={() => setPaymentMethod('WALLET')}
                            >
                                <Ionicons
                                    name="wallet"
                                    size={20}
                                    color={paymentMethod === 'WALLET' ? theme.primary : theme.textMuted}
                                />
                                <Text style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'WALLET' && styles.paymentOptionTextActive,
                                ]}>Wallet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.paymentOption,
                                    paymentMethod === 'ONLINE' && styles.paymentOptionActive,
                                ]}
                                onPress={() => setPaymentMethod('ONLINE')}
                            >
                                <Ionicons
                                    name="card"
                                    size={20}
                                    color={paymentMethod === 'ONLINE' ? theme.primary : theme.textMuted}
                                />
                                <Text style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'ONLINE' && styles.paymentOptionTextActive,
                                ]}>Pay Online</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.placeOrderButton, isPlacing && styles.buttonDisabled]}
                            onPress={handlePlaceOrder}
                            disabled={isPlacing}
                        >
                            {isPlacing ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <React.Fragment>
                                    <Text style={styles.placeOrderText}>
                                        {paymentMethod === 'ONLINE' ? 'Pay & Place Order' : 'Place Order'}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                </React.Fragment>
                            )}
                        </TouchableOpacity>
                    </React.Fragment>
                )}</ScrollView>

            <OrderConfirmationModal
                visible={showOrderModal}
                orderId={orderId}
                items={orderedItems}
                total={orderTotal}
                onDone={handleOrderDone}
            />

            {/* Razorpay Checkout */}
            {checkoutData && (
                <RazorpayCheckout
                    visible={showCheckout}
                    orderId={checkoutData.orderId}
                    amount={checkoutData.amount}
                    keyId={checkoutData.keyId}
                    description="Quick Byte Order"
                    prefillEmail={user?.email || ''}
                    prefillName={user?.name || ''}
                    onSuccess={handlePaymentSuccess}
                    onDismiss={() => setShowCheckout(false)}
                />
            )}
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
    emptySubtitle: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
        textAlign: 'center',
    },
    paymentMethodLabel: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: theme.textSecondary,
        letterSpacing: 1,
        marginTop: 16,
        marginBottom: 12,
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    paymentOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: theme.cardBackground,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    paymentOptionActive: {
        borderColor: theme.primary,
        backgroundColor: 'rgba(255, 107, 53, 0.08)',
    },
    paymentOptionText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: theme.textMuted,
    },
    paymentOptionTextActive: {
        color: theme.primary,
        fontWeight: Typography.weights.semibold,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    placeOrderButton: {
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
    placeOrderText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_700Bold',
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
