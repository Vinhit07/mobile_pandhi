import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context';

interface FavoriteCardProps {
    name: string;
    lastOrdered: string;
    price: number;
    image?: string; // Optional, not used in new design
    onOrderAgain: () => void;
}

const showMockAlert = () => {
    Alert.alert(
        'Coming Soon',
        'This is mock data, just for viewing. This feature will be implemented soon!',
        [{ text: 'OK' }]
    );
};

const FavoriteCard: React.FC<FavoriteCardProps> = ({
    name,
    lastOrdered,
    price,
    onOrderAgain,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={showMockAlert}
            activeOpacity={0.95}
        >
            <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.price}>{formatCurrency(price)}</Text>
            </View>
            <Text style={styles.lastOrdered}>Last ordered on {lastOrdered}</Text>
            <TouchableOpacity style={styles.reorderButton} onPress={showMockAlert} activeOpacity={0.8}>
                <Text style={styles.reorderText}>REORDER</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        minWidth: 180,
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
        gap: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        flex: 1,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    lastOrdered: {
        fontSize: 10,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 12,
    },
    reorderButton: {
        backgroundColor: theme.primary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    reorderText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.brownDark,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 0.5,
    },
});

export default FavoriteCard;
