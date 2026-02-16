import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { createTicket } from '../services/ticketService';
import Typography from '../constants/Typography';

const CreateTicketScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [issueType, setIssueType] = useState('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const styles = createStyles(theme);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await createTicket({
                title,
                description,
                priority,
                issueType,
            });
            Alert.alert('Success', 'Ticket created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    const issueTypes = ['Payment Problems', 'Order Issues', 'Account Issues', 'Technical Support', 'Others'];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Ticket</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Brief summary of the issue"
                            placeholderTextColor={theme.textMuted}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Issue Type</Text>
                        <View style={styles.pillsContainer}>
                            {issueTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.pill,
                                        issueType === type && styles.activePill
                                    ]}
                                    onPress={() => setIssueType(type)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        issueType === type && styles.activePillText
                                    ]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.pillsContainer}>
                            {priorities.map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.pill,
                                        priority === p && styles.activePill,
                                        priority === p && p === 'HIGH' && { backgroundColor: '#ef4444', borderColor: '#ef4444' },
                                        priority === p && p === 'MEDIUM' && { backgroundColor: '#f97316', borderColor: '#f97316' },
                                        priority === p && p === 'LOW' && { backgroundColor: '#22c55e', borderColor: '#22c55e' },
                                    ]}
                                    onPress={() => setPriority(p)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        priority === p && styles.activePillText
                                    ]}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Detailed explanation of the issue..."
                            placeholderTextColor={theme.textMuted}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Ticket</Text>
                        )}
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    content: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    required: {
        color: '#ef4444',
    },
    input: {
        backgroundColor: theme.cardBackground,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    textArea: {
        minHeight: 120,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.cardBackground,
        borderWidth: 1,
        borderColor: theme.border,
    },
    activePill: {
        backgroundColor: theme.primary,
        borderColor: theme.primary,
    },
    pillText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    activePillText: {
        color: '#fff',
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: theme.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default CreateTicketScreen;
