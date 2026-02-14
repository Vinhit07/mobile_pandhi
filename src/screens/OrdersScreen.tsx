
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context';
import { formatCurrency } from '../utils/currency';
import { getOngoingOrders, getOrderHistory, APIOrder } from '../services/orderService';

const OrdersScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [activeOrders, setActiveOrders] = useState<APIOrder[]>([]);
    const [historyOrders, setHistoryOrders] = useState<APIOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
                                <View key={order.id} style={styles.activeCard}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.orderId}>Order #{order.orderNumber || order.id}</Text>
                                        <View style={styles.glowDot} />
                                    </View>

                                    <View style={styles.itemList}>
                                        {order.items?.map((item, idx) => (
                                            <View key={idx} style={styles.itemRow}>
                                                <Text style={styles.itemName}>{item.quantity}x {item.product.name}</Text>
                                                <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>TOTAL</Text>
                                        <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                ) : (
                    <View style={styles.historyList}>
                        <View style={styles.historySectionHeader}>
                            <View style={styles.line} />
                            <Text style={styles.sectionTitle}>RECENT HISTORY</Text>
                            <View style={styles.line} />
                        </View>

                        {historyOrders.length === 0 ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <MaterialIcons name="history" size={48} color={theme.textMuted} />
                                <Text style={{ color: theme.textMuted, marginTop: 16, fontSize: 16 }}>No order history</Text>
                            </View>
                        ) : (
                            historyOrders.map(order => (
                                <View key={order.id} style={styles.historyCard}>
                                    <View style={styles.historyHeader}>
                                        <View style={styles.dateInfo}>
                                            <View style={styles.calendarIcon}>
                                                <MaterialIcons name="calendar-today" size={14} color={theme.textMuted} />
                                            </View>
                                            <Text style={styles.dateText}>{formatOrderDate(order.createdAt)}</Text>
                                        </View>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusText}>{order.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.historyContent}>
                                        <View>
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <View key={idx}>
                                                    <Text style={styles.historyItemName}>{item.product.name}</Text>
                                                    {idx === 0 && order.items.length > 1 && (
                                                        <Text style={styles.historyItemDetails}>
                                                            + {order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                                        </Text>
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                        <Text style={styles.historyTotal}>{formatCurrency(order.totalAmount)}</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <TouchableOpacity style={styles.reorderButton}>
                                        <MaterialIcons name="replay" size={18} color={theme.primary} />
                                        <Text style={styles.reorderText}>Reorder</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
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
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: 'rgba(53, 28, 21, 0.8)', // backdrop blur simulation
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
        borderColor: 'rgba(255, 255, 255, 0.05)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        backgroundColor: 'rgba(74, 40, 32, 0.5)', // surface-brown/50
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
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
});

export default OrdersScreen;
