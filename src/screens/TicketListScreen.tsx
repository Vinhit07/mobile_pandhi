import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context';
import { getTickets, Ticket } from '../services/ticketService';
import Typography from '../constants/Typography';

const TicketListScreen: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [ongoingTickets, setOngoingTickets] = useState<Ticket[]>([]);
    const [completedTickets, setCompletedTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

    const styles = createStyles(theme);

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            const data = await getTickets();
            setOngoingTickets(data.ongoing);
            setCompletedTickets(data.completed);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTickets();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTickets();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open': return '#3b82f6'; // Blue
            case 'closed': return '#22c55e'; // Green
            case 'pending': return '#eab308'; // Yellow
            default: return theme.textMuted;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'HIGH': return '#ef4444'; // Red
            case 'MEDIUM': return '#f97316'; // Orange
            case 'LOW': return '#22c55e'; // Green
            default: return theme.textMuted;
        }
    };

    const renderTicketItem = ({ item }: { item: Ticket }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => (navigation as any).navigate('TicketDetail', { ticket: item })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.ticketIdContainer}>
                    <Text style={styles.ticketId}>{item.ticketNumber || `#${item.id}`}</Text>
                    <Text style={styles.date}>{new Date(item.dateIssued).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

            <View style={styles.cardFooter}>
                <View style={[styles.priorityBadge, { borderColor: getPriorityColor(item.priority) }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority} PRIORITY</Text>
                </View>
                {item.issueType && (
                    <Text style={styles.issueType}>{item.issueType}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Tickets</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => (navigation as any).navigate('CreateTicket')}
                >
                    <MaterialIcons name="add" size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
                    onPress={() => setActiveTab('ongoing')}
                >
                    <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>Ongoing</Text>
                    {ongoingTickets.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{ongoingTickets.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={activeTab === 'ongoing' ? ongoingTickets : completedTickets}
                    renderItem={renderTicketItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="assignment" size={64} color={theme.textMuted} />
                            <Text style={styles.emptyText}>No {activeTab} tickets found</Text>
                            {activeTab === 'ongoing' && (
                                <TouchableOpacity
                                    style={styles.createButton}
                                    onPress={() => (navigation as any).navigate('CreateTicket')}
                                >
                                    <Text style={styles.createButtonText}>Create New Ticket</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                />
            )}
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
    addButton: {
        padding: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: theme.cardBackground,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: theme.border,
    },
    activeTab: {
        backgroundColor: theme.primary,
        borderColor: theme.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textSecondary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    activeTabText: {
        color: '#fff',
    },
    badge: {
        backgroundColor: '#ef4444',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ticketIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ticketId: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.textSecondary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    date: {
        fontSize: 12,
        color: theme.textMuted,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 8,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    description: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 12,
        fontFamily: 'PlusJakartaSans_400Regular',
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingTop: 12,
    },
    priorityBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    issueType: {
        fontSize: 12,
        color: theme.textMuted,
        fontStyle: 'italic',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: theme.textMuted,
        marginTop: 16,
        marginBottom: 24,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    createButton: {
        backgroundColor: theme.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default TicketListScreen;
