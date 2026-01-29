import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface HeaderProps {
    userName: string;
    greeting: string;
}

const Header: React.FC<HeaderProps> = ({ userName, greeting }) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop' }}
                    style={styles.avatar}
                />
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingText}>{greeting}</Text>
                    <View style={styles.nameRow}>
                        <Text style={styles.userName}>{userName}!</Text>
                        <Text style={styles.emoji}>👋</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="settings-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginRight: 12,
        backgroundColor: Colors.cardBackground,
    },
    greetingContainer: {
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: Typography.sizes.xs,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
    },
    emoji: {
        fontSize: 18,
        marginLeft: 4,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Header;
