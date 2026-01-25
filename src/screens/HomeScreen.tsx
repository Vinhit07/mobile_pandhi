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
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { Header, SearchBar, FavoriteCard, MenuCategory } from '../components';
import { menuCategories, favoriteItems, MenuItem as MenuItemType } from '../data/menuData';
import { useCart } from '../context';

// Helper function to get time-based greeting
const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
};

const HomeScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { addItem } = useCart();

    const handleOrderAgain = (item: MenuItemType) => {
        addItem(item);
    };

    const handleAddItem = (item: MenuItemType) => {
        addItem(item);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        color: Colors.textPrimary,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    seeAll: {
        fontSize: Typography.sizes.sm,
        color: Colors.primary,
        fontWeight: Typography.weights.medium,
    },
    favoritesContainer: {
        paddingHorizontal: 20,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
