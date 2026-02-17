import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { useTheme, useAuth } from '../context';

interface ProfileMenuItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    theme: any;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    theme,
}) => {
    const styles = createStyles(theme);
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemIcon}>{icon}</View>
            <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{title}</Text>
                <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>
    );
};

const ProfileScreen: React.FC = ({ navigation }: any) => {
    const { theme, isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const styles = createStyles(theme);

    const showComingSoon = () => {
        Alert.alert(
            'Coming Soon',
            'This is mock data, just for viewing. This feature will be implemented soon!',
            [{ text: 'OK' }]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color={theme.textSecondary} />
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
                </View>

                {/* Theme Toggle */}
                <View style={styles.themeToggleContainer}>
                    <View style={styles.themeToggleLeft}>
                        <View style={styles.themeIconContainer}>
                            <Ionicons
                                name={isDark ? "moon" : "sunny"}
                                size={22}
                                color={theme.primary}
                            />
                        </View>
                        <View>
                            <Text style={styles.themeToggleTitle}>Dark Mode</Text>
                            <Text style={styles.themeToggleSubtitle}>
                                {isDark ? "Currently using dark theme" : "Currently using light theme"}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#E0E0E0', true: theme.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {/* <ProfileMenuItem
                        icon={<Ionicons name="heart" size={22} color={theme.primary} />}
                        title="Favorite Items"
                        subtitle="Your most loved dishes"
                        onPress={showComingSoon}
                        theme={theme}
                    /> */}
                    <ProfileMenuItem
                        icon={<Ionicons name="time" size={22} color={theme.primary} />}
                        title="Order History"
                        subtitle="Past meals & reordering"
                        onPress={() => navigation.navigate('Orders', { initialTab: 'history' })}
                        theme={theme}
                    />
                    {/* <ProfileMenuItem
                        icon={<Ionicons name="star" size={22} color={theme.primary} />}
                        title="Your Reviews"
                        subtitle="Ratings given to items"
                        onPress={showComingSoon}
                        theme={theme}
                    /> */}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={theme.primary} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    tag: {
        backgroundColor: theme.cardBackground,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    tagText: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
    },
    // Theme Toggle
    themeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    themeToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    themeToggleTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginBottom: 2,
    },
    themeToggleSubtitle: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
    },
    // Menu Items
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        // backgroundColor: 'rgba(255, 107, 53, 0.15)', // Removed background as requested
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.cardBackground,
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 16,
        gap: 10,
    },
    logoutText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: theme.primary,
    },
});

export default ProfileScreen;
