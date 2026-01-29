import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';

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
                    <Ionicons name="remove" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
                    <Ionicons name="add" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: Colors.categoryBackground,
    },
    content: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    variant: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    price: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.priceOrange,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.categoryBackground,
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
        color: Colors.textPrimary,
        minWidth: 24,
        textAlign: 'center',
    },
});

export default CartItemCard;
