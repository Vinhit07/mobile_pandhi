import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context';

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
    const { theme } = useTheme();
    const styles = createStyles(theme);

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
                <Ionicons name="add" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
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
        backgroundColor: theme.categoryBackground,
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
        color: theme.textPrimary,
        flex: 1,
    },
    price: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.priceOrange,
        marginLeft: 8,
    },
    description: {
        fontSize: Typography.sizes.xs,
        color: theme.textSecondary,
        lineHeight: 16,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MenuItem;
