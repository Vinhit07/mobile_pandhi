import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { CartItemCard, OrderConfirmationModal } from '../components';
import { useCart, useTheme, useAuth, CartItem } from '../context';
import { formatCurrency } from '../utils/currency';
import { placeOrder, PlaceOrderRequest } from '../services/orderService';
import { isAuthenticated } from '../services/api';
import { getRazorpayKey, createOrderPayment, verifyOrderPayment } from '../services/paymentService';
import RazorpayCheckout from '../components/RazorpayCheckout';

const generateOrderId = (): string => {
    const letters = 'FD';
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `${letters}-${numbers}`;
};

// Group items by their category (source)
interface GroupedItems {
    [category: string]: CartItem[];
}

const CartScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { user } = useAuth();
    const {
        items,
        updateQuantity,
        getSubtotal,
        getDeliveryFee,
        getTotal,
        orderNotes,
        setOrderNotes,
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

    const styles = createStyles(theme);

    // Group items by category
    const groupedItems = useMemo(() => {
        return items.reduce<GroupedItems>((groups, item) => {
            const category = item.category || 'Menu Items';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
            return groups;
        }, {});
    }, [items]);

    const popupCategories = Object.keys(groupedItems).filter(
        cat => !['beverages', 'snacks', 'meals', 'juices', 'main', 'favorites'].includes(cat.toLowerCase())
    );
    const regularCategories = Object.keys(groupedItems).filter(
        cat => ['beverages', 'snacks', 'meals', 'juices', 'main', 'favorites'].includes(cat.toLowerCase())
    );

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

    const handleOrderDone = () => {
        setShowOrderModal(false);
        clearCart();
        navigation.navigate('Home' as never);
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="cart-outline" size={64} color={theme.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Browse the menu and add your favorite items to get started!
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderItemsForCategory = (category: string, categoryItems: CartItem[]) => (
        <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
                <View style={styles.categoryBadge}>
                    <Ionicons name="storefront" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
            </View>
            {categoryItems.map((item) => (
                <CartItemCard
                    key={item.id}
                    name={item.name}
                    variant={item.variant}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                />
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Pop-up Items Section */}
                {popupCategories.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.sectionLabel}>POP-UP ORDERS</Text>
                        {popupCategories.map(category =>
                            renderItemsForCategory(category, groupedItems[category])
                        )}
                    </View>
                )}

                {/* Regular Menu Items Section */}
                {regularCategories.length > 0 && (
                    <View style={styles.itemsSection}>
                        {popupCategories.length > 0 && (
                            <Text style={styles.sectionLabel}>MENU ITEMS</Text>
                        )}
                        {regularCategories.map(category => (
                            <View key={category}>
                                {groupedItems[category].map((item) => (
                                    <CartItemCard
                                        key={item.id}
                                        name={item.name}
                                        variant={item.variant}
                                        price={item.price}
                                        quantity={item.quantity}
                                        image={item.image}
                                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.notesSection}>
                    <Text style={styles.notesTitle}>ORDER NOTES</Text>
                    <View style={styles.notesInputContainer}>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Do you have any special instructions for the restaurant?"
                            placeholderTextColor={theme.textMuted}
                            value={orderNotes}
                            onChangeText={setOrderNotes}
                            multiline
                            numberOfLines={3}
                        />
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color={theme.textMuted}
                            style={styles.notesIcon}
                        />
                    </View>
                </View>

                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(getSubtotal())}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(getDeliveryFee())}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(getTotal())}</Text>
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
                            <>
                                <Text style={styles.placeOrderText}>
                                    {paymentMethod === 'ONLINE' ? 'Pay & Place Order' : 'Place Order'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    itemsSection: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    sectionLabel: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
        color: theme.textSecondary,
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    },
    categorySection: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    categoryBadge: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
    },
    notesSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    notesTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: theme.textSecondary,
        letterSpacing: 1,
        marginBottom: 12,
    },
    notesInputContainer: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
    },
    notesInput: {
        flex: 1,
        fontSize: Typography.sizes.md,
        color: theme.textPrimary,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    notesIcon: {
        marginLeft: 8,
    },
    summarySection: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: theme.cardBackground,
        borderRadius: 20,
        padding: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    summaryValue: {
        fontSize: Typography.sizes.md,
        color: theme.textPrimary,
        fontWeight: Typography.weights.medium,
    },
    divider: {
        height: 1,
        backgroundColor: theme.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    totalValue: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.priceOrange,
    },
    placeOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primary,
        borderRadius: 30,
        paddingVertical: 16,
        gap: 8,
    },
    placeOrderText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
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
});

export default CartScreen;
