import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { formatCurrency, CURRENCY_SYMBOL } from '../utils/currency';

interface Transaction {
    id: string;
    amount: number;
    type: 'debit' | 'credit';
    date: string;
    time: string;
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
    { id: 't1', amount: 120.00, type: 'debit', date: 'Today', time: '12:30 PM' },
    { id: 't2', amount: 45.00, type: 'debit', date: 'Today', time: '8:45 AM' },
    { id: 't3', amount: 90.00, type: 'debit', date: 'Yesterday', time: '1:15 PM' },
    { id: 't4', amount: 500.00, type: 'credit', date: 'Yesterday', time: '8:00 AM' },
    { id: 't5', amount: 35.00, type: 'debit', date: 'Oct 24', time: '3:20 PM' },
];

const WalletScreen: React.FC = () => {
    const navigation = useNavigation();
    const [balance] = useState(1450.50);
    const [monthlyAdded] = useState(500.00);
    const [transactions] = useState<Transaction[]>(sampleTransactions);

    const handleAddMoney = () => {
        // TODO: Implement add money flow
        console.log('Add money pressed');
    };

    const handleQuickTopUp = (amount: number) => {
        // TODO: Implement quick top-up
        console.log('Quick top-up:', amount);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wallet</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <View style={styles.creditsBadge}>
                            <Text style={styles.creditsText}>CREDITS</Text>
                        </View>
                    </View>
                    <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                    <Text style={styles.monthlyAdded}>
                        + {formatCurrency(monthlyAdded)} added this month
                    </Text>
                    <View style={styles.activeAccount}>
                        <View style={styles.activeIndicator} />
                        <Text style={styles.activeText}>Active Account</Text>
                    </View>
                </View>

                {/* Quick Top-Up Section */}
                <Text style={styles.sectionTitle}>QUICK TOP-UP</Text>
                <TouchableOpacity style={styles.addMoneyButton} onPress={handleAddMoney}>
                    <Ionicons name="add" size={20} color={Colors.background} />
                    <Text style={styles.addMoneyText}>Add Money</Text>
                </TouchableOpacity>

                <View style={styles.quickAmounts}>
                    <TouchableOpacity
                        style={styles.quickAmountButton}
                        onPress={() => handleQuickTopUp(500)}
                    >
                        <Text style={styles.quickAmountText}>+ {CURRENCY_SYMBOL}500</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAmountButton}
                        onPress={() => handleQuickTopUp(1000)}
                    >
                        <Text style={styles.quickAmountText}>+ {CURRENCY_SYMBOL}1000</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Transactions */}
                <Text style={styles.transactionsTitle}>Recent Transactions</Text>
                <View style={styles.transactionsList}>
                    {transactions.map((transaction) => (
                        <View
                            key={transaction.id}
                            style={[
                                styles.transactionItem,
                                transaction.type === 'credit' && styles.creditTransaction
                            ]}
                        >
                            <Text style={[
                                styles.transactionAmount,
                                transaction.type === 'credit' && styles.creditAmount
                            ]}>
                                {transaction.type === 'credit' ? '+ ' : '- '}
                                {CURRENCY_SYMBOL}{transaction.amount.toFixed(2)}
                            </Text>
                            <View style={styles.transactionMeta}>
                                <Text style={styles.transactionDate}>{transaction.date}</Text>
                                <Text style={styles.transactionTime}>{transaction.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    // Balance Card
    balanceCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        padding: 24,
        marginTop: 8,
        marginBottom: 28,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
    },
    creditsBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    creditsText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    monthlyAdded: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
    activeAccount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
        marginRight: 8,
    },
    activeText: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
    },
    // Quick Top-Up
    sectionTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: Colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 16,
    },
    addMoneyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 16,
    },
    addMoneyText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.background,
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    quickAmountButton: {
        flex: 1,
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    quickAmountText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: Colors.textPrimary,
    },
    // Transactions
    transactionsTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    transactionsList: {
        gap: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        padding: 18,
    },
    creditTransaction: {
        borderLeftWidth: 3,
        borderLeftColor: '#22C55E',
    },
    transactionAmount: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: Colors.textPrimary,
    },
    creditAmount: {
        color: '#22C55E',
    },
    transactionMeta: {
        alignItems: 'flex-end',
    },
    transactionDate: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    transactionTime: {
        fontSize: Typography.sizes.xs,
        color: Colors.textMuted,
    },
});

export default WalletScreen;
