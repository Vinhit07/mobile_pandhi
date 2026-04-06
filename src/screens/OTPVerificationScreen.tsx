import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';
import Typography from '../constants/Typography';
import { verifyOtp } from '../services/authService';

const OTPVerificationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { badgeId, email, name } = route.params;
    const { theme } = useTheme();
    const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']); // 8 digits
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 7) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const token = otp.join('');
        if (token.length !== 8) {
            setError('Please enter an 8-digit OTP');
            return;
        }

        setError('');
        setIsLoading(true);
        const result = await verifyOtp(email, token);
        setIsLoading(false);

        if (result.success) {
            navigation.navigate('ProfileSetup', { badgeId, email, initialName: name });
        } else {
            setError(result.error || 'Invalid OTP');
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
                    <Text style={styles.title}>Verify Email</Text>
                    <Text style={styles.subtitle}>We've sent an 8-digit OTP to {email}. Please enter it below.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[styles.otpInput, { borderColor: digit ? theme.primary : theme.border }]}
                                value={digit}
                                onChangeText={(val) => handleOtpChange(val.replace(/[^0-9]/g, ''), index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                        onPress={handleVerify}
                        disabled={isLoading || otp.join('').length < 8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Verify OTP</Text>
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
    form: { gap: 24 },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    otpInput: { width: 35, height: 48, backgroundColor: theme.cardBackground, borderRadius: 8, borderWidth: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: theme.textPrimary },
    errorText: { color: theme.error, fontSize: Typography.sizes.sm, textAlign: 'center' },
    primaryButton: { backgroundColor: theme.primary, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { opacity: 0.6 },
    primaryButtonText: { color: '#FFF', fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold },
});

export default OTPVerificationScreen;
