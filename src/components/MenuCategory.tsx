import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../data/menuData';

// Enable LayoutAnimation on Android
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

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleExpand}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>
                    <Text style={styles.title}>{name}</Text>
                </View>
                <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={Colors.textSecondary}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.categoryBackground,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 18,
    },
    title: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
});

export default MenuCategory;
