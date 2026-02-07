import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface HeaderProps {
    userName: string;
    greeting: string;
}

const Header: React.FC<HeaderProps> = ({ userName, greeting }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Placeholder image from HTML reference
    const profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh3Mdf50S6DebXzffQkZI8vfANZDmZIyRk5rvsdKGAfA1IFzRdVXUFiHp4Mab3xIBY-7eTkKAZtIIbZhfBwnnlUKmNY1SYB1wFAGvao4yWc3suQ7ZRnpurRZMKdpcUDm4ft8PPnx-kht6GiJ4jdDM15rZkfYtMJCQt_iWZJndbRrHROoAYVxxkJ2hZH9hps9WmuTFbfC39nDSEYia46QcWTAHl5Ot1Br_2BMsFDTsGkFSluZVU2K8T07jiEH-pDVwlXXrTemrYxRE';

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.avatar}
                    />
                </View>
                <View>
                    <Text style={styles.greeting}>{greeting}</Text>
                    <Text style={styles.userName}>Hi, {userName}! 👋</Text>
                </View>
            </View>
            {/* Notification button removed as requested */}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: theme.primary,
        overflow: 'hidden',
        backgroundColor: theme.background,
        // shadow-sm equivalent
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    greeting: {
        fontSize: 12,
        fontWeight: '500', // font-medium
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 2,
    },
    userName: {
        fontSize: 20, // text-xl
        fontWeight: '700', // font-bold
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        height: 24, // leading-tight approximation
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 12, // rounded-xl
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
        // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    notificationIcon: {
        fontSize: 20,
    },
    notificationBadge: {
        position: 'absolute',
        top: 8, // top-2
        right: 10, // right-2.5
        width: 8, // size-2
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.primary,
        borderWidth: 1,
        borderColor: theme.cardBackground,
    },
});

export default Header;