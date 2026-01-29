import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { formatCurrency } from '../utils/currency';

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

const styles = StyleSheet.create({
    container: {
        width: 160,
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: 100,
        backgroundColor: Colors.categoryBackground,
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    details: {
        fontSize: Typography.sizes.xs,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    orderButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    orderButtonText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
    },
});

export default FavoriteCard;
