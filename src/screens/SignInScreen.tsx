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
import { useAuth } from '../context';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

const SignInScreen: React.FC = () => {
    const { login, register } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter email and password.');
            return;
        }

        if (isSignUp && !name.trim()) {
            Alert.alert('Missing Name', 'Please enter your name.');
            return;
        }

        setIsLoading(true);
        let result;

        if (isSignUp) {
            result = await register(name.trim(), email.trim().toLowerCase(), password);
        } else {
            result = await login(email.trim().toLowerCase(), password);
        }

        setIsLoading(false);

        if (!result.success) {
            Alert.alert(
                isSignUp ? 'Sign Up Failed' : 'Sign In Failed',
                result.error || 'Please try again.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Logo */}
                <View style={styles.brandSection}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="flash" size={40} color={Colors.primary} />
                    </View>
                    <Text style={styles.brandName}>Quick Byte</Text>
                    <Text style={styles.brandTagline}>
                        {isSignUp ? 'Create your account' : 'Sign in to continue'}
                    </Text>
                </View>

                <View style={styles.formSection}>
                    {/* Name (sign up only) */}
                    {isSignUp && (
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full name"
                                placeholderTextColor={Colors.textMuted}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    )}

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={Colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={Colors.textMuted}
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
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Toggle */}
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setIsSignUp(!isSignUp)}
                    >
                        <Text style={styles.toggleText}>
                            {isSignUp
                                ? 'Already have an account? '
                                : "Don't have an account? "}
                            <Text style={styles.toggleHighlight}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    brandName: {
        fontSize: 32,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    brandTagline: {
        fontSize: Typography.sizes.md,
        color: Colors.textSecondary,
    },
    formSection: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        color: Colors.textPrimary,
        fontSize: Typography.sizes.md,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
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
        color: Colors.textSecondary,
    },
    toggleHighlight: {
        color: Colors.primary,
        fontWeight: Typography.weights.semibold,
    },
});

export default SignInScreen;
