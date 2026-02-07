import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, SearchBar, FavoriteCard, PopupCard, CategoryCard } from '../components';
import { menuCategories, favoriteItems, popupItems, MenuItem as MenuItemType } from '../data/menuData';
import { useCart, useTheme } from '../context';

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
    // Categories data matching HTML reference
    const [categories] = useState([
        { id: '1', name: 'Main Meal', icon: 'restaurant' },
        { id: '2', name: 'Snacks', icon: 'cookie' },
        { id: '3', name: 'Hot Brews', icon: 'coffee' },
    ]);
    const { addItem } = useCart();
    const { theme } = useTheme();

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
                <Header userName="Alex" greeting={getGreeting()} />

                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for your favorite meal..."
                />

                {/* Favorites Section */}
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

                {/* Pop ups Section */}
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

                {/* Categories Section */}
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
                                    if (item.name === 'Snacks') {
                                        navigation.navigate('Snacks');
                                    } else if (item.name === 'Main Meal') {
                                        navigation.navigate('MainMeal');
                                    } else if (item.name === 'Hot Brews') {
                                        navigation.navigate('HotBeverages');
                                    } else {
                                        console.log('Category pressed:', item.name);
                                    }
                                }}
                            />
                        )}
                    />
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
