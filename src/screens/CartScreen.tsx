import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { CartItemCard, OrderConfirmationModal } from '../components';
import { useCart, CartItem } from '../context';
import { formatCurrency } from '../utils/currency';

// Generate random order ID
const generateOrderId = (): string => {
    const letters = 'FD';
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `${letters}-${numbers}`;
};

const CartScreen: React.FC = () => {
    const navigation = useNavigation();
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

    // Modal state
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
    const [orderTotal, setOrderTotal] = useState(0);

    const handlePlaceOrder = () => {
        // Save order details before clearing cart
        setOrderId(generateOrderId());
        setOrderedItems([...items]);
        setOrderTotal(getTotal());

        // Show modal
        setShowOrderModal(true);
    };

    const handleOrderDone = () => {
        setShowOrderModal(false);
        clearCart();
        // Navigate to home
        navigation.navigate('Home' as never);
    };

    // Empty cart state
    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="cart-outline" size={64} color={Colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Browse the menu and add your favorite items to get started!
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Cart Items */}
                <View style={styles.itemsSection}>
                    {items.map((item) => (
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

                {/* Order Notes */}
                <View style={styles.notesSection}>
                    <Text style={styles.notesTitle}>ORDER NOTES</Text>
                    <View style={styles.notesInputContainer}>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Do you have any special instructions for the restaurant?"
                            placeholderTextColor={Colors.textMuted}
                            value={orderNotes}
                            onChangeText={setOrderNotes}
                            multiline
                            numberOfLines={3}
                        />
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color={Colors.textMuted}
                            style={styles.notesIcon}
                        />
                    </View>
                </View>

                {/* Order Summary */}
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

                    {/* Place Order Button */}
                    <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                        <Text style={styles.placeOrderText}>Place Order</Text>
                        <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Order Confirmation Modal */}
            <OrderConfirmationModal
                visible={showOrderModal}
                orderId={orderId}
                items={orderedItems}
                total={orderTotal}
                onDone={handleOrderDone}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
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
    notesSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    notesTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: Colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 12,
    },
    notesInputContainer: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
    },
    notesInput: {
        flex: 1,
        fontSize: Typography.sizes.md,
        color: Colors.textPrimary,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    notesIcon: {
        marginLeft: 8,
    },
    summarySection: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: Colors.cardBackground,
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
        color: Colors.textSecondary,
    },
    summaryValue: {
        fontSize: Typography.sizes.md,
        color: Colors.textPrimary,
        fontWeight: Typography.weights.medium,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
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
        color: Colors.textPrimary,
    },
    totalValue: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: Colors.priceOrange,
    },
    placeOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        gap: 8,
    },
    placeOrderText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
    },
    // Empty state styles
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
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: Typography.sizes.md,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default CartScreen;
