import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface CategoryCardProps {
    name: string;
    icon: string;
    onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.98} // active:scale-[0.98]
        >
            <View style={styles.iconContainer}>
                <MaterialIcons name={icon as any} size={24} color={theme.primary} />
            </View>
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            minWidth: 100, // min-w-[100px]
            aspectRatio: 1, // aspect-square
            padding: 16, // p-4
            borderRadius: 24, // rounded-3xl
            backgroundColor: theme.cardBackground, // bg-dark-card
            borderWidth: 1,
            borderColor: theme.border, // border-dark-border
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            // shadow-none in HTML, but maybe basic elevation? 
            // HTML says hover:shadow-none... actually "shadow-none".
            // Let's keep it flat as per "shadow-none".
        },
        iconContainer: {
            width: 48, // size-12
            height: 48,
            borderRadius: 16, // rounded-2xl
            backgroundColor: theme.background, // bg-dark-bg
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12, // mb-3
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.05)', // border-white/5
            // shadow-inner equivalent... hard in RN.
            // We can simulate with a slight border or specific background.
        },
        name: {
            fontSize: 12, // text-xs
            fontWeight: '700', // font-bold
            color: theme.textPrimary, // text-dark-text
            textAlign: 'center',
            fontFamily: 'PlusJakartaSans_700Bold',
        },
    });

export default CategoryCard;
