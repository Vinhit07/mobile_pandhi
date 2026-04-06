import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';
import Typography from '../constants/Typography';
import { verifyBadge } from '../services/authService';

const BadgeVerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { theme } = useTheme();
    const [badgeId, setBadgeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleNext = async () => {
        setError('');
        if (badgeId.length !== 12) {
            setError('Badge ID must be exactly 12 digits');
            return;
        }

        setIsLoading(true);
        const result = await verifyBadge(badgeId);
        setIsLoading(false);

        if (result.success && result.email) {
            navigation.navigate('OTPVerification', {
                badgeId,
                email: result.email,
                name: result.name
            });
        } else {
            setError(result.error || 'Verification failed');
        }
    };

    const styles = createStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Enter Badge ID</Text>
                    <Text style={styles.subtitle}>Please enter the 12-digit badge ID to begin the registration process.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="card-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="12-digit Badge ID"
                            placeholderTextColor={theme.textMuted}
                            value={badgeId}
                            onChangeText={(text) => setBadgeId(text.replace(/[^0-9]/g, '').slice(0, 12))}
                            keyboardType="number-pad"
                            maxLength={12}
                        />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                        onPress={handleNext}
                        disabled={isLoading || badgeId.length < 12}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Verify & Next</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
    backButton: { position: 'absolute', top: 20, left: 20, padding: 8, zIndex: 10 },
    header: { marginBottom: 40 },
    title: { fontSize: 28, fontWeight: Typography.weights.bold, color: theme.textPrimary, marginBottom: 8 },
    subtitle: { fontSize: Typography.sizes.md, color: theme.textSecondary, lineHeight: 22 },
    form: { gap: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: 56, color: theme.textPrimary, fontSize: Typography.sizes.md, letterSpacing: 2 },
    errorText: { color: theme.error, fontSize: Typography.sizes.sm, marginTop: -8 },
    primaryButton: { backgroundColor: theme.primary, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
    buttonDisabled: { opacity: 0.6 },
    primaryButtonText: { color: '#FFF', fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold },
});

export default BadgeVerificationScreen;
