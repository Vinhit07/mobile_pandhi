import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../constants/Typography';
import { useTheme } from '../context';

interface HeaderProps {
    userName: string;
    greeting: string;
}

const Header: React.FC<HeaderProps> = ({ userName, greeting }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>👋</Text>
                </View>
                <View>
                    <Text style={styles.greeting}>{greeting}</Text>
                    <Text style={styles.userName}>{userName}! 👋</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="options-outline" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarEmoji: {
        fontSize: 20,
    },
    greeting: {
        fontSize: Typography.sizes.xs,
        color: theme.textSecondary,
        letterSpacing: 1,
        marginBottom: 2,
    },
    userName: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Header;
