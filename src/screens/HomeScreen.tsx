import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import { Header, SearchBar, FavoriteCard, MenuCategory, PopupCard, CategoryCard } from '../components';
import { MenuItem as MenuItemType, MenuCategory as MenuCategoryType, favoriteItems, popupItems } from '../data/menuData';
import { useCart, useTheme, useAuth } from '../context';
import { getProducts, getOutlets } from '../services/productService';
import { formatCurrency } from '../utils/currency';

// Helper function to get time-based greeting
const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
};

// Category data for horizontal grid
// Categories data matching HTML reference

const HomeScreen: React.FC = ({ navigation }: any) => {
    const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>([]);
    const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFromAPI, setIsFromAPI] = useState(false);

    const { addItem } = useCart();
    const { theme } = useTheme();
    const { user } = useAuth();

    // Fetch products and outlets from API on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('[HomeScreen] Starting to fetch products and outlets...');
                setIsLoading(true);

                // Fetch products
                const result = await getProducts();
                console.log('[HomeScreen] Got products - Categories count:', result.categories.length);
                console.log('[HomeScreen] From API:', result.fromAPI);

                setMenuCategories(result.categories);
                setIsFromAPI(result.fromAPI);

                // Fetch outlets to use as categories
                const outletsData = await getOutlets();
                console.log('[HomeScreen] Got outlets:', outletsData.length);

                // Transform outlets into category format
                const outletCategories = outletsData.map((outlet: any) => ({
                    id: String(outlet.id),
                    name: outlet.name,
                    icon: 'restaurant'
                }));

                setCategories(outletCategories);
                console.log('[HomeScreen] ✅ Data loaded successfully');
            } catch (error) {
                console.log('[HomeScreen] ❌ Error fetching data:', error);
                setMenuCategories([]);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOrderAgain = (item: MenuItemType) => {
        addItem(item);
    };

    const styles = createStyles(theme);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Header
                    userName={user?.name?.split(' ')[0] || 'User'}
                    greeting={getGreeting()}
                    onTicketPress={() => (navigation as any).navigate('TicketList')}
                />

                {/* Favorites Section - Mock data (API endpoint pending) */}
                <View style={[styles.section, { marginTop: 16 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Favorites</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'This is mock data, just for viewing. This feature will be implemented soon!', [{ text: 'OK' }])}>
                            <Text style={styles.viewAll}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={favoriteItems}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <FavoriteCard
                                name={item.name}
                                lastOrdered={item.lastOrdered}
                                price={item.price}
                                image={item.image}
                                onOrderAgain={() => handleOrderAgain({
                                    id: item.id,
                                    name: item.name,
                                    description: '',
                                    price: item.price,
                                    image: item.image,
                                    category: 'favorites',
                                    isVeg: true
                                })}
                            />
                        )}
                    />
                </View>

                {/* Pop ups Section - Mock data (API endpoint pending) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pop up counters</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={popupItems}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <PopupCard
                                id={item.id}
                                title={item.title}
                                subtitle={item.subtitle}
                                image={item.image}
                                isLive={item.isLive}
                            />
                        )}
                    />
                </View>

                {/* Categories Section - API Data */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Explore Food Counters</Text>
                    </View>
                    <View style={styles.categoryList}>
                        {categories.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.categoryListItem}
                                activeOpacity={0.7}
                                onPress={() => {
                                    console.log('[HomeScreen] Outlet clicked:', item.name, 'Outlet ID:', item.id);

                                    const allProducts = menuCategories.flatMap(cat => cat.items || []);
                                    const outletId = parseInt(item.id);
                                    const outletProducts = allProducts.filter((product: any) => product.outletId === outletId);

                                    const outletCategory = {
                                        id: item.id,
                                        name: item.name,
                                        items: outletProducts
                                    };

                                    navigation.navigate('CategoryDetail', {
                                        categoryData: outletCategory,
                                        categoryName: item.name
                                    });
                                }}
                            >
                                <View style={styles.categoryListIcon}>
                                    <MaterialIcons name={item.icon as any} size={24} color={theme.primary} />
                                </View>
                                <Text style={styles.categoryListName}>{item.name}</Text>
                                <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 0.5,
    },
    horizontalList: {
        paddingHorizontal: 24,
    },
    categoryList: {
        paddingHorizontal: 24,
        gap: 10,
    },
    categoryListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    categoryListIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: theme.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    categoryListName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    emptySearchContainer: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 60,
        gap: 12,
    },
    emptySearchText: {
        fontSize: 14,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_400Regular',
        textAlign: 'center' as const,
    },
    searchResultsList: {
        paddingHorizontal: 24,
        gap: 2,
    },
    searchResultItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        backgroundColor: theme.cardBackground,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.border,
    },
    searchResultInfo: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flex: 1,
        gap: 12,
    },
    vegIcon: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#22C55E',
        borderRadius: 2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: 2,
    },
    vegIconInner: {
        width: 8,
        height: 8,
        backgroundColor: '#22C55E',
        borderRadius: 4,
    },
    searchResultText: {
        flex: 1,
    },
    searchResultName: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    searchResultDesc: {
        fontSize: 12,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_400Regular',
        marginTop: 2,
    },
    searchResultRight: {
        alignItems: 'flex-end' as const,
        gap: 6,
    },
    searchResultPrice: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: theme.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    addButton: {
        backgroundColor: theme.primary,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    addButtonText: {
        fontSize: 11,
        fontWeight: '700' as const,
        color: theme.background,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 0.5,
    },
});

export default HomeScreen;
