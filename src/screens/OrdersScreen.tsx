
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useTheme } from '../context';
import { formatCurrency } from '../utils/currency';
import { getOngoingOrders, getOrderHistory, APIOrder } from '../services/orderService';

const OrdersScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [activeOrders, setActiveOrders] = useState<APIOrder[]>([]);
    const [historyOrders, setHistoryOrders] = useState<APIOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<APIOrder | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const styles = createStyles(theme);

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            console.log('[OrdersScreen] Fetching orders from API...');
            const [ongoing, history] = await Promise.all([
                getOngoingOrders(),
                getOrderHistory(),
            ]);

            console.log('[OrdersScreen] Ongoing orders:', ongoing.length);
            console.log('[OrdersScreen] History orders:', history.length);

            setActiveOrders(ongoing);
            setHistoryOrders(history);
        } catch (error) {
            console.error('[OrdersScreen] Error fetching orders:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch on mount and when screen comes into focus
    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if ((route.params as any)?.initialTab) {
            setActiveTab((route.params as any).initialTab);
        }
    }, [route.params]);

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
    };

    const formatOrderDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        if (days === 1) return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleViewOrder = (order: APIOrder) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const OrderDetailsModal = () => {
        if (!selectedOrder) return null;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Details</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.modalInfoRow}>
                                <Text style={styles.modalLabel}>Order ID</Text>
                                <Text style={styles.modalValue}>#{selectedOrder.orderNumber || selectedOrder.id}</Text>
                            </View>
                            <View style={styles.modalInfoRow}>
                                <Text style={styles.modalLabel}>Date</Text>
                                <Text style={styles.modalValue}>{formatOrderDate(selectedOrder.createdAt)}</Text>
                            </View>
                            <View style={styles.modalInfoRow}>
                                <Text style={styles.modalLabel}>Status</Text>
                                <Text style={[styles.modalValue, { color: theme.primary }]}>{selectedOrder.status}</Text>
                            </View>
                            {selectedOrder.token != null && (
                                <View style={styles.modalInfoRow}>
                                    <Text style={styles.modalLabel}>Beverage Token</Text>
                                    <Text style={[styles.modalValue, { color: '#b45309' }]}>
                                        {selectedOrder.tokenQty && selectedOrder.tokenQty > 1
                                            ? `Token: [${selectedOrder.token - selectedOrder.tokenQty + 1} - ${selectedOrder.token}] (${selectedOrder.tokenQty})`
                                            : `Token: ${selectedOrder.token} (1)`}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <Text style={styles.modalSectionTitle}>Items</Text>
                            {selectedOrder.items?.map((item, idx) => (
                                <View key={idx} style={styles.modalItemRow}>
                                    <Text style={styles.modalItemName}>{item.quantity}x {item.product.name}</Text>
                                    <Text style={styles.modalItemPrice}>{formatCurrency(item.unitPrice * item.quantity)}</Text>
                                </View>
                            ))}

                            <View style={styles.divider} />

                            <View style={styles.modalTotalRow}>
                                <Text style={styles.modalTotalLabel}>Amount Paid</Text>
                                <Text style={styles.modalTotalValue}>{formatCurrency(selectedOrder.totalAmount)}</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'delivered' || s === 'completed') return { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' }; // Green
        if (s === 'cancelled' || s === 'failed') return { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' }; // Red
        if (s === 'pending' || s === 'processing') return { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15', border: 'rgba(234, 179, 8, 0.2)' }; // Yellow
        return { bg: 'rgba(255, 255, 255, 0.1)', text: theme.textMuted, border: 'rgba(255, 255, 255, 0.2)' }; // Default
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => (navigation as any).navigate('Home')}
                    style={styles.headerButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                {/* Notification button removed */}
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <View style={styles.tabWrapper}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'active' ? styles.tabActive : styles.tabInactive]}
                        onPress={() => setActiveTab('active')}
                    >
                        <Text style={[styles.tabText, activeTab === 'active' ? styles.tabTextActive : styles.tabTextInactive]}>
                            Active Orders
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'history' ? styles.tabActive : styles.tabInactive]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' ? styles.tabTextActive : styles.tabTextInactive]}>
                            History
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                }
            >
                {isLoading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={{ color: theme.textMuted, marginTop: 16 }}>Loading orders...</Text>
                    </View>
                ) : activeTab === 'active' ? (
                    <View style={styles.activeList}>
                        {activeOrders.length === 0 ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <MaterialIcons name="receipt-long" size={48} color={theme.textMuted} />
                                <Text style={{ color: theme.textMuted, marginTop: 16, fontSize: 16 }}>No active orders</Text>
                            </View>
                        ) : (
                            activeOrders.map(order => (
                                <View key={order.id} style={styles.historyCard}>
                                    <View style={styles.historyHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.orderIdText}>Order #{order.orderNumber || order.id}</Text>
                                            <Text style={styles.dateText}>{formatOrderDate(order.createdAt)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                                        <View style={[styles.statusBadge, {
                                            backgroundColor: getStatusColor(order.status).bg,
                                            borderColor: getStatusColor(order.status).border
                                        }]}>
                                            <Text style={[styles.statusText, { color: getStatusColor(order.status).text }]}>{order.status}</Text>
                                        </View>
                                        {order.isPreOrder && (
                                            <View style={styles.preOrderBadge}>
                                                <MaterialIcons name="schedule" size={10} color="#60A5FA" />
                                                <Text style={styles.preOrderBadgeText}>PRE-ORDER</Text>
                                            </View>
                                        )}
                                        {order.token != null && (
                                            <View style={styles.tokenBadge}>
                                                <Text style={styles.tokenBadgeText}>
                                                    {order.tokenQty && order.tokenQty > 1
                                                        ? `Token: [${order.token - order.tokenQty + 1} - ${order.token}] (${order.tokenQty})`
                                                        : `Token: ${order.token} (1)`}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.historyContent}>
                                        <View style={{ flex: 1 }}>
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <View key={idx}>
                                                    <Text style={styles.historyItemName}>{item.quantity}x {item.product.name}</Text>
                                                </View>
                                            ))}
                                            {order.items && order.items.length > 2 && (
                                                <Text style={styles.historyItemDetails}>+ {order.items.length - 2} more items</Text>
                                            )}
                                        </View>
                                        <Text style={styles.historyTotal}>{formatCurrency(order.totalAmount)}</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <TouchableOpacity
                                        style={styles.viewOrderButton}
                                        onPress={() => handleViewOrder(order)}
                                    >
                                        <MaterialIcons name="visibility" size={18} color={theme.background} />
                                        <Text style={styles.viewOrderText}>View Order</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                ) : (
                    <View style={styles.historyList}>


                        {historyOrders.length === 0 ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <MaterialIcons name="history" size={48} color={theme.textMuted} />
                                <Text style={{ color: theme.textMuted, marginTop: 16, fontSize: 16 }}>No order history</Text>
                            </View>
                        ) : (
                            historyOrders.map(order => (
                                <View key={order.id} style={styles.historyCard}>
                                    <View style={styles.historyHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.orderIdText}>Order #{order.orderNumber || order.id}</Text>
                                            <Text style={styles.dateText}>{formatOrderDate(order.createdAt)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                                        <View style={[styles.statusBadge, {
                                            backgroundColor: getStatusColor(order.status).bg,
                                            borderColor: getStatusColor(order.status).border
                                        }]}>
                                            <Text style={[styles.statusText, { color: getStatusColor(order.status).text }]}>{order.status}</Text>
                                        </View>
                                        {order.isPreOrder && (
                                            <View style={styles.preOrderBadge}>
                                                <MaterialIcons name="schedule" size={10} color="#60A5FA" />
                                                <Text style={styles.preOrderBadgeText}>PRE-ORDER</Text>
                                            </View>
                                        )}
                                        {order.token != null && (
                                            <View style={styles.tokenBadge}>
                                                <Text style={styles.tokenBadgeText}>
                                                    {order.tokenQty && order.tokenQty > 1
                                                        ? `Token: [${order.token - order.tokenQty + 1} - ${order.token}] (${order.tokenQty})`
                                                        : `Token: ${order.token} (1)`}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.historyContent}>
                                        <View style={{ flex: 1 }}>
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <View key={idx}>
                                                    <Text style={styles.historyItemName}>{item.quantity}x {item.product.name}</Text>
                                                </View>
                                            ))}
                                            {order.items && order.items.length > 2 && (
                                                <Text style={styles.historyItemDetails}>+ {order.items.length - 2} more items</Text>
                                            )}
                                        </View>
                                        <Text style={styles.historyTotal}>{formatCurrency(order.totalAmount)}</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <TouchableOpacity
                                        style={styles.viewOrderButton}
                                        onPress={() => handleViewOrder(order)}
                                    >
                                        <MaterialIcons name="visibility" size={18} color={theme.background} />
                                        <Text style={styles.viewOrderText}>View Order</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            <OrderDetailsModal />
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
        paddingVertical: 20,
        backgroundColor: theme.background,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: -0.5,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.primary,
    },
    tabContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 8,
    },
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: theme.cardBackground,
        borderRadius: 30,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: theme.primary,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabInactive: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    tabTextActive: {
        color: theme.background,
    },
    tabTextInactive: {
        color: theme.textMuted,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 100, // Safe area
    },
    activeList: {
        gap: 16,
    },
    activeCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    glowDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.primary,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8, // Glow effect
        elevation: 5,
    },
    itemList: {
        gap: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    itemPrice: {
        fontSize: 14,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    divider: {
        height: 1,
        backgroundColor: theme.border,
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    historyList: {
        gap: 16,
    },
    historySectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        opacity: 0.8,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.cardBackground,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    historyCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    calendarIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statusBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500/10
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    statusText: {
        color: '#4ade80', // green-400
        fontSize: 10,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    historyContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    historyItemName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    historyItemDetails: {
        fontSize: 12,
        color: theme.textMuted,
        marginTop: 4,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    historyTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
        borderRadius: 8,
    },
    reorderText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    // New Styles
    orderIdText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 4,
    },
    viewOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: theme.primary,
    },
    viewOrderText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.background,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.cardBackground,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    modalInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalLabel: {
        fontSize: 14,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    modalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    modalItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    modalItemName: {
        fontSize: 14,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_500Medium',
        flex: 1,
    },
    modalItemPrice: {
        fontSize: 14,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    modalTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        alignItems: 'center',
    },
    modalTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    modalTotalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    preOrderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.25)',
    },
    preOrderBadgeText: {
        color: '#60A5FA',
        fontSize: 9,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 0.5,
    },
    tokenBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    tokenBadgeText: {
        color: '#d97706',
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default OrdersScreen;
