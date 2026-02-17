import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { theme } = useTheme();

    const styles = createStyles(theme);

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        const result = await register(name.trim(), email.trim(), password);
        setIsLoading(false);

        if (!result.success) {
            Alert.alert('Sign Up Failed', result.error || 'Registration failed');
        }
        // On success, AuthContext updates and navigation handles the switch
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        {/* Logo & Title */}
                        <View style={styles.headerSection}>
                            <View style={styles.logoContainer}>
                                <Ionicons name="fast-food" size={48} color={theme.primary} />
                            </View>
                            <Text style={styles.appName}>Pandhi</Text>
                            <Text style={styles.subtitle}>Create your account to get started</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Name Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor={theme.textMuted}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={theme.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            {/* Password Input */}
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
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color={theme.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Retype Password"
                                    placeholderTextColor={theme.textMuted}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color={theme.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: theme.textSecondary,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: theme.border,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.textPrimary,
    },
    eyeIcon: {
        padding: 4,
    },
    signUpButton: {
        backgroundColor: theme.primary,
        borderRadius: 14,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    footerLink: {
        fontSize: 14,
        color: theme.primary,
        fontWeight: '600',
    },
});

export default SignUpScreen;
