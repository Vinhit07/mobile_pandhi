import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface RouteParams {
    ticket: {
        id: string;
        ticketNumber: string;
        title: string;
        description: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        status: string;
        progress: string;
        progressPercentage: number;
        dateIssued: string;
        resolvedDate?: string;
        resolutionNote?: string;
        issueType: string;
    };
}

const TicketDetailScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { ticket } = route.params as RouteParams;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return '#EF4444';
            case 'MEDIUM': return '#F59E0B';
            case 'LOW': return '#10B981';
            default: return theme.textMuted;
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'closed' ? '#10B981' : '#F59E0B';
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Ticket Number Card */}
                <View style={styles.card}>
                    <View style={styles.ticketNumberRow}>
                        <MaterialIcons name="confirmation-number" size={24} color={theme.primary} />
                        <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                                {ticket.status.toUpperCase()}
                            </Text>
                        </View>
                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
                            <Text style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                                {ticket.priority}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Progress Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Progress</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${ticket.progressPercentage}%`, backgroundColor: theme.primary }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>{ticket.progress} ({ticket.progressPercentage}%)</Text>
                    </View>
                </View>

                {/* Information Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Information</Text>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="category" size={20} color={theme.textMuted} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Issue Type</Text>
                            <Text style={styles.infoValue}>{ticket.issueType}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="calendar-today" size={20} color={theme.textMuted} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Date Issued</Text>
                            <Text style={styles.infoValue}>{ticket.dateIssued}</Text>
                        </View>
                    </View>

                    {ticket.resolvedDate && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="check-circle" size={20} color={theme.textMuted} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Resolved Date</Text>
                                <Text style={styles.infoValue}>{ticket.resolvedDate}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Title & Description Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Title</Text>
                    <Text style={styles.title}>{ticket.title}</Text>

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Description</Text>
                    <Text style={styles.description}>{ticket.description}</Text>
                </View>

                {/* Resolution Note Card (if exists) */}
                {ticket.resolutionNote && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Resolution Note</Text>
                        <View style={styles.resolutionContainer}>
                            <MaterialIcons name="support-agent" size={20} color={theme.primary} />
                            <Text style={styles.resolutionNote}>{ticket.resolutionNote}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
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
        paddingTop: 48,
        paddingBottom: 16,
        backgroundColor: theme.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    ticketNumberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    ticketNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statusRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: theme.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_700Bold',
        lineHeight: 24,
    },
    description: {
        fontSize: 15,
        color: theme.textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
        lineHeight: 22,
    },
    resolutionContainer: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: theme.primary + '10',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
    },
    resolutionNote: {
        flex: 1,
        fontSize: 14,
        color: theme.textPrimary,
        fontFamily: 'PlusJakartaSans_500Medium',
        lineHeight: 20,
    },
});

export default TicketDetailScreen;
