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
import { Header, SearchBar, FavoriteCard, MenuCategory, PopupCard } from '../components';
import { menuCategories as mockMenuCategories, favoriteItems, popupItems, MenuItem as MenuItemType, MenuCategory as MenuCategoryType } from '../data/menuData';
import { useCart, useTheme, useAuth } from '../context';
import { getProducts } from '../services/productService';

// Helper function to get time-based greeting
const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
};

const HomeScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>(mockMenuCategories);
    const [isLoading, setIsLoading] = useState(true);
    const [isFromAPI, setIsFromAPI] = useState(false);
    const { addItem } = useCart();
    const { theme } = useTheme();
    const { user } = useAuth();

    // Fetch products from API on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const result = await getProducts();
                setMenuCategories(result.categories);
                setIsFromAPI(result.fromAPI);
            } catch (error) {
                console.log('[HomeScreen] Error fetching products:', error);
                // Keep mock data on error
                setMenuCategories(mockMenuCategories);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleOrderAgain = (item: MenuItemType) => {
        addItem(item);
    };

    const handleAddItem = (item: MenuItemType) => {
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
                <Header userName={user?.name?.split(' ')[0] || 'User'} greeting={getGreeting()} />

                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="What are you craving?"
                />

                {/* Favorites Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Favorites</Text>
                        <Text style={styles.seeAll}>See all</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={favoriteItems}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.favoritesContainer}
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

                {/* Pop ups Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pop ups</Text>
                    <FlatList
                        horizontal
                        data={popupItems}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popupsContainer}
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

                {/* Explore Menu Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Explore Menu</Text>
                    <View style={styles.categoriesContainer}>
                        {menuCategories.map((category, index) => (
                            <MenuCategory
                                key={category.id}
                                name={category.name}
                                icon={category.icon}
                                items={category.items}
                                initiallyExpanded={index === 0}
                                onAddItem={handleAddItem}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    seeAll: {
        fontSize: Typography.sizes.sm,
        color: theme.primary,
        fontWeight: Typography.weights.medium,
    },
    favoritesContainer: {
        paddingHorizontal: 20,
    },
    popupsContainer: {
        paddingHorizontal: 20,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
