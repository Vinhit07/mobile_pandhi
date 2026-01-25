import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface ProfileMenuItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress
}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemIcon}>{icon}</View>
        <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout pressed');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

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
                        <Ionicons name="person" size={40} color={Colors.textSecondary} />
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userEmail}>john.doe@org.com</Text>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Employee ID: #12345</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Joined: Jan 2023</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <ProfileMenuItem
                        icon={<Ionicons name="heart" size={22} color={Colors.primary} />}
                        title="Favorite Items"
                        subtitle="Your most loved dishes"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon={<Ionicons name="time" size={22} color={Colors.primary} />}
                        title="Order History"
                        subtitle="Past meals & reordering"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon={<Ionicons name="star" size={22} color={Colors.primary} />}
                        title="Your Reviews"
                        subtitle="Ratings given to items"
                        onPress={() => { }}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.primary} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: Typography.sizes.xxl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: Typography.sizes.md,
        color: Colors.textSecondary,
    },
    // Tags
    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    tag: {
        backgroundColor: Colors.cardBackground,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    tagText: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
    },
    // Menu Items
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
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
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
    },
    // Logout Button
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.cardBackground,
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 16,
        gap: 10,
    },
    logoutText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: Colors.primary,
    },
});

export default ProfileScreen;
