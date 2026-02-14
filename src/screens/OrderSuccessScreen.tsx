import React from 'react';
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
import { useTheme } from '../context';
import { formatCurrency } from '../utils/currency';

type RootStackParamList = {
    OrderSuccess: { items: any[], total: number };
};

const OrderSuccessScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'OrderSuccess'>>();
    const { theme } = useTheme();

    // Data passed from PaymentScreen
    const items = route.params?.items || [];
    // Mock items if empty (e.g. direct nav testing)
    const displayItems = items.length > 0 ? items : [
        { id: '1', name: 'Masala Dosa', quantity: 1, price: 80, category: 'Main Meal' },
        { id: '2', name: 'Cold Coffee', quantity: 1, price: 100, category: 'Hot Brews' }
    ];

    const totalPaid = route.params?.total || 180; // Default mock

    const styles = createStyles(theme);

    const handleDone = () => {
        // Clear cart or other cleanup if needed
        (navigation as any).navigate('MainTabs', { screen: 'Orders' });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />

            {/* Header removed as requested */}
            <View style={{ height: 20 }} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Success Icon */}
                <View style={styles.successIconWrapper}>
                    <View style={styles.successIconBg}>
                        <MaterialIcons name="check" size={48} color={theme.background} />
                    </View>
                    <View style={[styles.dot, { top: -8, right: -8, width: 16, height: 16, opacity: 0.5 }]} />
                    <View style={[styles.dot, { top: '50%', left: -16, width: 8, height: 8, opacity: 0.6 }]} />
                    <View style={[styles.dot, { bottom: 0, right: -12, width: 12, height: 12, opacity: 0.4 }]} />
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Success!</Text>
                    <Text style={styles.subtitle}>Your food is being prepared.</Text>
                </View>

                {/* Order Summary Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Order Summary</Text>
                        <View style={styles.orderIdBadge}>
                            <Text style={styles.orderIdText}>#2049</Text>
                        </View>
                    </View>

                    <View style={styles.itemList}>
                        {displayItems.map((item: any, index: number) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={styles.itemLeft}>
                                    <View style={styles.itemIcon}>
                                        <MaterialIcons
                                            name={item.category === 'Hot Brews' ? 'local-cafe' : 'lunch-dining'}
                                            size={20}
                                            color={theme.primary}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQty}>x{item.quantity}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Paid</Text>
                        <Text style={styles.totalValue}>{formatCurrency(totalPaid)}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Show this screen at the counter to collect your order
                </Text>
                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneButtonText}>DONE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 8,
        alignItems: 'flex-start',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
    },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingBottom: 100,
    },
    successIconWrapper: {
        marginTop: 24,
        position: 'relative',
        marginBottom: 32,
    },
    successIconBg: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    dot: {
        position: 'absolute',
        backgroundColor: theme.primary,
        borderRadius: 999,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 32,
        gap: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.textPrimary + 'CC',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    card: {
        width: '100%',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    orderIdBadge: {
        backgroundColor: theme.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
    orderIdText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textPrimary + 'CC',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    itemList: {
        gap: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemLeft: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    itemQty: {
        fontSize: 12,
        color: theme.textPrimary + '99',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    totalRow: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary + 'B3',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: theme.textPrimary + '99',
        fontStyle: 'italic',
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 24,
    },
    doneButton: {
        backgroundColor: theme.primary,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.background,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default OrderSuccessScreen;
