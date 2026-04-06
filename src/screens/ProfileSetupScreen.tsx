import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useAuth } from '../context';
import Typography from '../constants/Typography';

const ProfileSetupScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { badgeId, email, initialName } = route.params;
    const { theme } = useTheme();
    const { completeProfileSetup } = useAuth();

    const [name, setName] = useState(initialName || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSetup = async () => {
        setError('');
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        // completeProfileSetup updates AuthContext, which will trigger the app navigator to switch to MainTabs
        const result = await completeProfileSetup(badgeId, email, name, password);
        setIsLoading(false);

        if (!result.success) {
            setError(result.error || 'Failed to setup profile');
        }
    };

    const styles = createStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.header}>
                    <Text style={styles.title}>Setup Profile</Text>
                    <Text style={styles.subtitle}>Final step! Choose your name and a secure password.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={theme.textMuted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.textMuted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                        onPress={handleSetup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Complete Setup</Text>
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
    header: { marginBottom: 40 },
    title: { fontSize: 28, fontWeight: Typography.weights.bold, color: theme.textPrimary, marginBottom: 8 },
    subtitle: { fontSize: Typography.sizes.md, color: theme.textSecondary, lineHeight: 22 },
    form: { gap: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: 56, color: theme.textPrimary, fontSize: Typography.sizes.md },
    errorText: { color: theme.error, fontSize: Typography.sizes.sm },
    primaryButton: { backgroundColor: theme.primary, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
    buttonDisabled: { opacity: 0.6 },
    primaryButtonText: { color: '#FFF', fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold },
});

export default ProfileSetupScreen;
