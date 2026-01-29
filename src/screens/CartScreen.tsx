import React, { useState, useMemo } from 'react';
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
import Typography from '../constants/Typography';
import { CartItemCard, OrderConfirmationModal } from '../components';
import { useCart, useTheme, CartItem } from '../context';
import { formatCurrency } from '../utils/currency';

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

    // Check if there are popup items (items not from favorites or regular menu)
    const popupCategories = Object.keys(groupedItems).filter(
        cat => !['beverages', 'snacks', 'meals', 'juices', 'main', 'favorites'].includes(cat.toLowerCase())
    );
    const regularCategories = Object.keys(groupedItems).filter(
        cat => ['beverages', 'snacks', 'meals', 'juices', 'main', 'favorites'].includes(cat.toLowerCase())
    );

    const handlePlaceOrder = () => {
        setOrderId(generateOrderId());
        setOrderedItems([...items]);
        setOrderTotal(getTotal());
        setShowOrderModal(true);
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

                    <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                        <Text style={styles.placeOrderText}>Place Order</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
        color: theme.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default CartScreen;
