import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import { CartItem } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context';

interface OrderConfirmationModalProps {
    visible: boolean;
    orderId: string;
    items: CartItem[];
    total: number;
    onDone: () => void;
    token?: number | null;   // ending token assigned by backend
    tokenQty?: number;       // how many company-paid beverages were in this order
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
    visible,
    orderId,
    items,
    total,
    onDone,
    token,
    tokenQty = 1,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                    </View>

                    <Text style={styles.title}>Order Placed</Text>
                    <Text style={styles.titleBold}>Successfully!</Text>
                    <Text style={styles.subtitle}>Thank you for your order.</Text>

                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdLabel}>ORDER ID</Text>
                        <Text style={styles.orderId}>#{orderId}</Text>
                    </View>

                    {/* Beverage Token Badge */}
                    {token != null && (
                        <View style={styles.tokenContainer}>
                            <Text style={styles.tokenLabel}>BEVERAGE TOKEN</Text>
                            <Text style={styles.tokenValue}>
                                {tokenQty > 1
                                    ? `Token: [${token - tokenQty + 1} - ${token}] (${tokenQty})`
                                    : `Token: ${token} (1)`}
                            </Text>
                        </View>
                    )}

                    <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                        {items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Paid</Text>
                        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                    </View>

                    <TouchableOpacity style={styles.doneButton} onPress={onDone}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: theme.cardBackground,
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        textAlign: 'center',
    },
    titleBold: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
        marginBottom: 24,
    },
    orderIdContainer: {
        backgroundColor: theme.categoryBackground,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    orderIdLabel: {
        fontSize: Typography.sizes.xs,
        color: theme.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    orderId: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    itemsList: {
        width: '100%',
        maxHeight: 150,
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemQuantity: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginRight: 8,
        minWidth: 28,
    },
    itemName: {
        flex: 1,
        fontSize: Typography.sizes.md,
        color: theme.textPrimary,
    },
    itemPrice: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    totalValue: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.priceOrange,
    },
    doneButton: {
        backgroundColor: theme.primary,
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 80,
        width: '100%',
    },
    doneButtonText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    tokenContainer: {
        width: '100%',
        backgroundColor: typeof theme.primary === 'string' ? theme.primary + '1A' : 'rgba(234, 179, 8, 0.1)',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: typeof theme.primary === 'string' ? theme.primary + '66' : 'rgba(234, 179, 8, 0.4)',
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
        gap: 4,
    },
    tokenLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.primary,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    tokenValue: {
        fontSize: 15,
        fontWeight: '800',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 1,
    },
    tokenHint: {
        fontSize: 11,
        color: theme.textSecondary,
        opacity: 0.7,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
});

export default OrderConfirmationModal;
