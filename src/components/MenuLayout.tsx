
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useCart } from '../context';
import ViewCartPopup from './ViewCartPopup';

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    isVeg: boolean;
}

export interface MenuCategory {
    id: string;
    title: string;
    items: MenuItem[];
    isOpen: boolean;
}

interface MenuLayoutProps {
    title: string;
    searchPlaceholder: string;
    data: MenuCategory[];
    categoryTitleColor?: string; // Optional custom color for category titles
}

const MenuLayout: React.FC<MenuLayoutProps> = ({
    title,
    searchPlaceholder,
    data,
    categoryTitleColor,
}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [categories, setCategories] = useState<MenuCategory[]>(data);
    const [isVegOnly, setIsVegOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { addItem } = useCart();

    // Update categories when data prop changes
    React.useEffect(() => {
        console.log('[MenuLayout] Data prop changed, updating categories. Count:', data.length);
        setCategories(data);
    }, [data]);

    const toggleCategory = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === id ? { ...cat, isOpen: !cat.isOpen } : cat
            )
        );
    };

    const styles = createStyles(theme, categoryTitleColor);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={styles.vegToggleContainer}>
                        <Text style={styles.vegToggleLabel}>VEG ONLY</Text>
                        <Switch
                            value={isVegOnly}
                            onValueChange={setIsVegOnly}
                            trackColor={{ false: theme.cardBackground, true: '#16A34A' }} // green-600
                            thumbColor={theme.textPrimary}
                            ios_backgroundColor={theme.cardBackground}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color={theme.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={searchPlaceholder}
                        placeholderTextColor={theme.textMuted + '99'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {categories.map((category) => (
                    <View key={category.id} style={styles.categoryContainer}>
                        <TouchableOpacity
                            style={styles.categoryHeader}
                            onPress={() => toggleCategory(category.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <MaterialIcons
                                name="expand-more"
                                size={24}
                                color={theme.textMuted}
                                style={{
                                    transform: [{ rotate: category.isOpen ? '180deg' : '0deg' }],
                                }}
                            />
                        </TouchableOpacity>

                        {category.isOpen && (
                            <View style={styles.categoryContent}>
                                {category.items.map((item, index) => (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.itemContainer,
                                            index < category.items.length - 1 && styles.itemSeparator,
                                        ]}
                                    >
                                        {/* Veg Icon */}
                                        <View style={styles.vegIconContainer}>
                                            <View style={styles.vegIconOuter}>
                                                <View style={styles.vegIconInner} />
                                            </View>
                                        </View>

                                        <View style={styles.itemDetails}>
                                            <View style={styles.itemHeader}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={styles.itemPrice}>₹{item.price}</Text>
                                            </View>
                                            <Text style={styles.itemDescription}>{item.description}</Text>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => addItem({
                                                    ...item,
                                                    image: 'https://via.placeholder.com/150',
                                                    category: category.title
                                                } as any)}
                                            >
                                                <Text style={styles.addButtonText}>ADD</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <ViewCartPopup />
        </SafeAreaView>
    );
};

const createStyles = (theme: any, categoryTitleColor?: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBackground,
            backgroundColor: theme.background,
            zIndex: 10,
        },
        headerTop: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        backButton: {
            padding: 8,
            borderRadius: 20,
            marginLeft: -8,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.textPrimary,
            letterSpacing: -0.5,
            fontFamily: 'PlusJakartaSans_700Bold',
        },
        vegToggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        vegToggleLabel: {
            fontSize: 11,
            fontWeight: '700',
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontFamily: 'PlusJakartaSans_700Bold',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBackground,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 1,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            color: theme.textPrimary,
            fontSize: 14,
            fontFamily: 'PlusJakartaSans_400Regular',
            height: '100%',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 100,
            gap: 16,
        },
        categoryContainer: {
            backgroundColor: theme.cardBackground,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            overflow: 'hidden',
        },
        categoryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: theme.cardBackground,
        },
        categoryTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: categoryTitleColor || theme.textPrimary, // Use custom color if provided, else default
            fontFamily: 'PlusJakartaSans_700Bold',
        },
        categoryContent: {
            paddingHorizontal: 16,
            paddingBottom: 8,
            borderTopWidth: 1,
            borderTopColor: theme.background,
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingTop: 16,
            gap: 16,
        },
        itemSeparator: {},
        vegIconContainer: {
            marginTop: 4,
        },
        vegIconOuter: {
            width: 16,
            height: 16,
            borderWidth: 1,
            borderColor: '#22C55E',
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
        },
        vegIconInner: {
            width: 8,
            height: 8,
            backgroundColor: '#22C55E',
            borderRadius: 4,
        },
        itemDetails: {
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            paddingBottom: 20,
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
        },
        itemName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.textPrimary,
            fontFamily: 'PlusJakartaSans_600SemiBold',
            flex: 1,
            marginRight: 8,
            lineHeight: 20,
        },
        itemPrice: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.primary,
            fontFamily: 'PlusJakartaSans_700Bold',
        },
        itemDescription: {
            fontSize: 12,
            color: theme.textMuted,
            marginBottom: 12,
            lineHeight: 18,
            width: '95%',
            fontFamily: 'PlusJakartaSans_400Regular',
        },
        addButton: {
            backgroundColor: theme.primary,
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignSelf: 'flex-start',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        addButtonText: {
            fontSize: 11,
            fontWeight: '700',
            color: theme.background,
            fontFamily: 'PlusJakartaSans_700Bold',
            letterSpacing: 0.5,
        },
    });

export default MenuLayout;
