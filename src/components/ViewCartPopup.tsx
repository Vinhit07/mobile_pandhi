
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useCart } from '../context';
import { formatCurrency } from '../utils/currency';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ViewCartPopup: React.FC = () => {
    const { items, getSubtotal } = useCart();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Only show if there are items in the cart
    if (items.length === 0) return null;

    const styles = createStyles(theme, insets.bottom);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getSubtotal();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <Text style={styles.itemCount}>
                        {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
                    </Text>
                    <View style={styles.separator} />
                    <Text style={styles.totalPrice}>
                        {formatCurrency(totalPrice)}
                    </Text>
                    <Text style={styles.plusTaxes}>(plus taxes)</Text>
                </View>

                <TouchableOpacity
                    style={styles.viewCartButton}
                    onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Cart' })}
                >
                    <Text style={styles.viewCartText}>View Cart</Text>
                    <MaterialIcons name="arrow-right" size={20} color={theme.brownDark} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: any, bottomInset: number) => StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20, // Inside MenuLayout, adjust position if needed. bottom: 20 from SafeAreaView bottom edge
        left: 16,
        right: 16,
        zIndex: 100,
    },
    content: {
        backgroundColor: theme.primary, // Gold background
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.brownDark,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 0.5,
    },
    separator: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(53, 28, 21, 0.3)',
        marginHorizontal: 8,
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.brownDark,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginRight: 4,
    },
    plusTaxes: {
        fontSize: 10,
        fontWeight: '500',
        color: 'rgba(53, 28, 21, 0.7)',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    viewCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewCartText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.brownDark,
        fontFamily: 'PlusJakartaSans_700Bold',
        textTransform: 'uppercase',
    },
});

export default ViewCartPopup;
