
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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { formatCurrency } from '../utils/currency';

const OrdersScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const styles = createStyles(theme);

    // Mock Data as per design
    const activeOrders = [
        {
            id: '4920',
            total: 470,
            items: [
                { name: 'Chicken Tikka Bowl', qty: 1, price: 350 },
                { name: 'Mint Lemonade', qty: 1, price: 120 }
            ]
        },
        {
            id: '4925',
            total: 280,
            items: [
                { name: 'Paneer Wraps', qty: 2, price: 280 },
            ]
        }
    ];

    const historyOrders = [
        {
            id: 'h1',
            date: 'Yesterday, 1:30 PM',
            total: 450,
            status: 'Delivered',
            items: [
                { name: 'Cappuccino, Croissant', qty: 1, details: '+ 1 more item' }
            ]
        },
        {
            id: 'h2',
            date: '24 Oct, 12:15 PM',
            total: 120,
            status: 'Delivered',
            items: [
                { name: 'Veg Burger Meal', qty: 1, details: 'Single item' }
            ]
        }
    ];

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
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {activeTab === 'active' ? (
                    <View style={styles.activeList}>
                        {activeOrders.map(order => (
                            <View key={order.id} style={styles.activeCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <View style={styles.glowDot} />
                                </View>

                                <View style={styles.itemList}>
                                    {order.items.map((item, idx) => (
                                        <View key={idx} style={styles.itemRow}>
                                            <Text style={styles.itemName}>{item.qty}x {item.name}</Text>
                                            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>TOTAL</Text>
                                    <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.historyList}>
                        <View style={styles.historySectionHeader}>
                            <View style={styles.line} />
                            <Text style={styles.sectionTitle}>RECENT HISTORY</Text>
                            <View style={styles.line} />
                        </View>

                        {historyOrders.map(order => (
                            <View key={order.id} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <View style={styles.dateInfo}>
                                        <View style={styles.calendarIcon}>
                                            <MaterialIcons name="calendar-today" size={14} color={theme.textMuted} />
                                        </View>
                                        <Text style={styles.dateText}>{order.date}</Text>
                                    </View>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{order.status}</Text>
                                    </View>
                                </View>

                                <View style={styles.historyContent}>
                                    <View>
                                        {order.items.map((item, idx) => (
                                            <View key={idx}>
                                                <Text style={styles.historyItemName}>{item.name}</Text>
                                                <Text style={styles.historyItemDetails}>{item.details}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <Text style={styles.historyTotal}>{formatCurrency(order.total)}</Text>
                                </View>

                                <View style={styles.divider} />

                                <TouchableOpacity style={styles.reorderButton}>
                                    <MaterialIcons name="replay" size={18} color={theme.primary} />
                                    <Text style={styles.reorderText}>Reorder</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
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
