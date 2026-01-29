import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context';

interface FavoriteCardProps {
    name: string;
    lastOrdered: string;
    price: number;
    image: string;
    onOrderAgain: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
    name,
    lastOrdered,
    price,
    image,
    onOrderAgain,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.details}>Ordered {lastOrdered} • {formatCurrency(price)}</Text>
                <TouchableOpacity style={styles.orderButton} onPress={onOrderAgain}>
                    <Text style={styles.orderButtonText}>Order Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        width: 160,
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: 100,
        backgroundColor: theme.categoryBackground,
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    details: {
        fontSize: Typography.sizes.xs,
        color: theme.textSecondary,
        marginBottom: 10,
    },
    orderButton: {
        backgroundColor: theme.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    orderButtonText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.semibold,
        color: '#FFFFFF',
    },
});

export default FavoriteCard;
