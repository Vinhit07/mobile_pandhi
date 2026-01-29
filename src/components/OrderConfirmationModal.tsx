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
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { CartItem } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

interface OrderConfirmationModalProps {
    visible: boolean;
    orderId: string;
    items: CartItem[];
    total: number;
    onDone: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
    visible,
    orderId,
    items,
    total,
    onDone,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Order Placed</Text>
                    <Text style={styles.titleBold}>Successfully!</Text>
                    <Text style={styles.subtitle}>Thank you for your order.</Text>

                    {/* Order ID */}
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdLabel}>ORDER ID</Text>
                        <Text style={styles.orderId}>#{orderId}</Text>
                    </View>

                    {/* Order Items */}
                    <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                        {items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Paid</Text>
                        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                    </View>

                    {/* Done Button */}
                    <TouchableOpacity style={styles.doneButton} onPress={onDone}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: Colors.cardBackground,
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
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    titleBold: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: Typography.sizes.md,
        color: Colors.textSecondary,
        marginBottom: 24,
    },
    orderIdContainer: {
        backgroundColor: Colors.categoryBackground,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    orderIdLabel: {
        fontSize: Typography.sizes.xs,
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    orderId: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
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
        color: Colors.textPrimary,
        marginRight: 8,
        minWidth: 28,
    },
    itemName: {
        flex: 1,
        fontSize: Typography.sizes.md,
        color: Colors.textPrimary,
    },
    itemPrice: {
        fontSize: Typography.sizes.md,
        color: Colors.textSecondary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: Typography.sizes.md,
        color: Colors.textSecondary,
    },
    totalValue: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: Colors.priceOrange,
    },
    doneButton: {
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 80,
        width: '100%',
    },
    doneButtonText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
});

export default OrderConfirmationModal;
