import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search for your favorite meal...',
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <MaterialIcons name={"search" as any} size={24} color={theme.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.textMuted}
                />
            </View>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground, // bg-dark-card
        borderRadius: 12, // rounded-xl
        paddingHorizontal: 16,
        paddingVertical: 12, // py-4 approx (HTML has py-4 which is 1rem/16px)
        borderWidth: 1,
        borderColor: theme.border, // border-dark-border
        // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12, // pl-12 (48px) - 16px padding = 32px? 
        // Actually HTML: absolute left-4. 
        // React Native: we'll use flex layout. left-4 is 16px. 
        // We have paddingHorizontal 16. So icon is at 16px.
        // Input needs paddingLeft to clear icon.
    },
    input: {
        flex: 1,
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: theme.textPrimary,
        height: 24, // Fix height to ensure vertical alignment
        padding: 0, // Reset padding
        fontFamily: 'PlusJakartaSans_500Medium',
    },
});

export default SearchBar;
