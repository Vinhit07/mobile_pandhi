import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
    StatusBar,
    Dimensions,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { useTheme, useCart } from '../context';
import { formatCurrency } from '../utils/currency';
import { ViewCartPopup } from '../components';

const { width } = Dimensions.get('window');

interface PopupMenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface PopupData {
    id: string;
    name: string;
    category: string;
    rating: number;
    heroImage: string;
    menuItems: PopupMenuItem[];
}

// Sample popup data
const popupData: { [key: string]: PopupData } = {
    dominos: {
        id: 'dominos',
        name: "Domino's",
        category: 'Pizza • Italian • Fast Food',
        rating: 4.5,
        heroImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
        menuItems: [
            {
                id: 'dom1',
                name: 'Farmhouse Pizza',
                description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom',
                price: 399,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop',
            },
            {
                id: 'dom2',
                name: 'Peppy Paneer',
                description: 'Chunky paneer with spicy red pepper and spicy citrus black olives',
                price: 449,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop',
            },
            {
                id: 'dom3',
                name: 'Garlic Breadsticks',
                description: 'Freshly baked breadsticks seasoned with garlic and herbs',
                price: 149,
                image: 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=100&h=100&fit=crop',
            },
            {
                id: 'dom4',
                name: 'Choco Lava Cake',
                description: 'Molten chocolate inside, pure indulgence',
                price: 129,
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop',
            },
        ],
    },
};

const PopupDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const { addItem, items, getTotal } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    // Get popup ID from route params
    const popupId = (route.params as any)?.popupId || 'dominos';
    const popup = popupData[popupId] || popupData['dominos'];

    const styles = createStyles(theme);

    const handleAddItem = (item: PopupMenuItem) => {
        Alert.alert(
            'Coming Soon',
            'This is mock data, just for viewing. This feature will be implemented soon!',
            [{ text: 'OK' }]
        );
    };

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = getTotal();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Hero Image */}
            <ImageBackground
                source={{ uri: popup.heroImage }}
                style={styles.heroImage}
            >
                <View style={styles.heroOverlay}>
                    <SafeAreaView edges={['top']} style={styles.heroHeader}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => setIsFavorite(!isFavorite)}
                            >
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={22}
                                    color={isFavorite ? "#FF6B35" : "#FFFFFF"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <Ionicons name="share-outline" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    <View style={styles.heroContent}>
                        <View style={styles.badgeRow}>
                            <View style={styles.popupBadge}>
                                <Text style={styles.popupBadgeText}>POP-UP COUNTER</Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Text style={styles.ratingText}>{popup.rating}</Text>
                            </View>
                        </View>
                        <Text style={styles.popupName}>{popup.name}</Text>
                        <Text style={styles.popupCategory}>{popup.category}</Text>
                    </View>
                </View>
            </ImageBackground>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color={theme.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search menu items..."
                        placeholderTextColor={theme.textMuted}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.sectionTitle}>{popup.name.toUpperCase()}'S CLASSICS</Text>

                {popup.menuItems.map((item) => (
                    <View key={item.id} style={styles.menuItem}>
                        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                        <View style={styles.menuItemContent}>
                            <Text style={styles.menuItemName}>{item.name}</Text>
                            <Text style={styles.menuItemDescription} numberOfLines={2}>
                                {item.description}
                            </Text>
                            <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddItem(item)}
                        >
                            <Ionicons name="add" size={20} color="#541C0D" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* View Cart Popup */}
            <ViewCartPopup />
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    heroImage: {
        width: width,
        height: 220,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    heroContent: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    popupBadge: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    popupBadgeText: {
        fontSize: 10,
        fontWeight: Typography.weights.bold,
        color: '#000000',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    ratingText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: '#FFFFFF',
    },
    popupName: {
        fontSize: 32,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    popupCategory: {
        fontSize: Typography.sizes.md,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: Typography.sizes.md,
        color: theme.textPrimary,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    sectionTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        letterSpacing: 1,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: theme.categoryBackground,
    },
    menuItemContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuItemName: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
        lineHeight: 18,
        marginBottom: 6,
    },
    menuItemPrice: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: theme.priceOrange,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 30,
    },
    cartBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    cartBadge: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cartBadgeText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
    },
    cartInfo: {
        flex: 1,
    },
    cartViewText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
    },
    cartFromText: {
        fontSize: Typography.sizes.xs,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    cartTotalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cartTotal: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
    },
});

export default PopupDetailScreen;
