import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../data/menuData';
import { useTheme } from '../context';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MenuCategoryProps {
    name: string;
    icon: string;
    items: MenuItemType[];
    initiallyExpanded?: boolean;
    onAddItem: (item: MenuItemType) => void;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({
    name,
    icon,
    items,
    initiallyExpanded = false,
    onAddItem,
}) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>
                    <Text style={styles.categoryName}>{name}</Text>
                </View>
                <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.itemsContainer}>
                    {items.map((item) => (
                        <MenuItem
                            key={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            onAdd={() => onAddItem(item)}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.categoryBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 18,
    },
    categoryName: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: theme.divider,
    },
});

export default MenuCategory;
