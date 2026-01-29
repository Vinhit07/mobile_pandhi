import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context';

interface CartItemCardProps {
    name: string;
    variant?: string;
    price: number;
    quantity: number;
    image: string;
    onIncrease: () => void;
    onDecrease: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
    name,
    variant,
    price,
    quantity,
    image,
    onIncrease,
    onDecrease,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                {variant && <Text style={styles.variant}>{variant}</Text>}
                <Text style={styles.price}>{formatCurrency(price)}</Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
                    <Ionicons name="remove" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
                    <Ionicons name="add" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: theme.categoryBackground,
    },
    content: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginBottom: 2,
    },
    variant: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
        marginBottom: 4,
    },
    price: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.priceOrange,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.categoryBackground,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: theme.textPrimary,
        minWidth: 24,
        textAlign: 'center',
    },
});

export default CartItemCard;
