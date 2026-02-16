import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../constants/Typography';
import { Header, SearchBar, FavoriteCard, MenuCategory, PopupCard, CategoryCard } from '../components';
import { MenuItem as MenuItemType, MenuCategory as MenuCategoryType, favoriteItems, popupItems } from '../data/menuData';
import { useCart, useTheme, useAuth } from '../context';
import { getProducts, getOutlets } from '../services/productService';

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
    const [searchQuery, setSearchQuery] = useState('');
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
                    icon: 'restaurant' // You can map outlet types to different icons if needed
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

                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for your favorite meal..."
                />

                {/* Favorites Section - Mock data (API endpoint pending) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Favorites</Text>
                        <Text style={styles.viewAll}>VIEW ALL</Text>
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
                        <Text style={styles.sectionTitle}>Categories</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={categories}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <CategoryCard
                                name={item.name}
                                icon={item.icon}
                                onPress={() => {
                                    console.log('[HomeScreen] Outlet clicked:', item.name, 'Outlet ID:', item.id);

                                    // Get all products from all categories
                                    const allProducts = menuCategories.flatMap(cat => cat.items || []);
                                    console.log('[HomeScreen] Total products available:', allProducts.length);

                                    // Filter products by outlet ID
                                    const outletId = parseInt(item.id);
                                    const outletProducts = allProducts.filter((product: any) => {
                                        const matches = product.outletId === outletId;
                                        if (matches) {
                                            console.log('[HomeScreen] Product matched:', product.name, 'outletId:', product.outletId);
                                        }
                                        return matches;
                                    });

                                    console.log('[HomeScreen] Products for outlet', item.name, ':', outletProducts.length);

                                    // Create a category object with all outlet products
                                    const outletCategory = {
                                        id: item.id,
                                        name: item.name,
                                        items: outletProducts
                                    };

                                    // Navigate to CategoryDetailScreen
                                    navigation.navigate('CategoryDetail', {
                                        categoryData: outletCategory,
                                        categoryName: item.name
                                    });
                                }}
                            />
                        )}
                    />
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
});

export default HomeScreen;
