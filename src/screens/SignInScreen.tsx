import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../context';
import Typography from '../constants/Typography';

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { login } = useAuth();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        console.log('[SignIn] handleSubmit called');
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter email and password.');
            return;
        }

        setIsLoading(true);
        let result;

        try {
            console.log('[SignIn] Attempting login with email:', email.trim().toLowerCase());
            result = await login(email.trim().toLowerCase(), password);
            console.log('[SignIn] Result:', JSON.stringify(result));
        } catch (err) {
            console.error('[SignIn] Unexpected error:', err);
            result = { success: false, error: 'Unexpected error occurred' };
        }

        setIsLoading(false);

        if (!result.success) {
            Alert.alert(
                'Sign In Failed',
                result.error || 'Please try again.'
            );
        }
    };

    const styles = createStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.brandSection}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="flash" size={40} color={theme.primary} />
                    </View>
                    <Text style={styles.brandName}>Pandhi</Text>
                    <Text style={styles.brandTagline}>
                        Sign in to continue
                    </Text>
                </View>

                <View style={styles.formSection}>
                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={theme.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Password */}
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
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={theme.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Toggle */}
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => navigation.navigate('BadgeVerification')}
                    >
                        <Text style={styles.toggleText}>
                            Don't have an account?{' '}
                            <Text style={styles.toggleHighlight}>
                                Sign Up
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },
    brandName: {
        fontSize: 32,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginBottom: 8,
    },
    brandTagline: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    formSection: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        color: theme.textPrimary,
        fontSize: Typography.sizes.md,
    },
    primaryButton: {
        backgroundColor: theme.primary,
        borderRadius: 16,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
    },
    toggleButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    toggleText: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
    },
    toggleHighlight: {
        color: theme.primary,
        fontWeight: Typography.weights.semibold,
    },
});

export default SignInScreen;
