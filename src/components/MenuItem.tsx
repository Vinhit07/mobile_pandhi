import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';

interface MenuItemProps {
    name: string;
    description: string;
    price: number;
    image: string;
    onAdd: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    name,
    description,
    price,
    image,
    onAdd,
}) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.price}>{formatCurrency(price)}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                <Ionicons name="add" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: Colors.categoryBackground,
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
        flex: 1,
    },
    price: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: Colors.priceOrange,
        marginLeft: 8,
    },
    description: {
        fontSize: Typography.sizes.xs,
        color: Colors.textSecondary,
        lineHeight: 16,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MenuItem;
