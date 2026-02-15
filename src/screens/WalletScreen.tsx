import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { formatCurrency, CURRENCY_SYMBOL } from '../utils/currency';
import { useTheme, useAuth } from '../context';
import { getWalletDetails, getRecentTransactions, WalletTransaction } from '../services/walletService';
import { getRazorpayKey, createWalletRechargeOrder, verifyWalletRecharge } from '../services/paymentService';
import RazorpayCheckout from '../components/RazorpayCheckout';

interface DisplayTransaction {
    id: string;
    amount: number;
    type: 'debit' | 'credit';
    date: string;
    time: string;
    description: string;
}

const formatTransactionDate = (dateStr: string): { date: string; time: string } => {
    const d = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const txDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let date: string;
    if (txDate.getTime() === today.getTime()) {
        date = 'Today';
    } else if (txDate.getTime() === yesterday.getTime()) {
        date = 'Yesterday';
    } else {
        date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { date, time };
};

const mapTransactions = (transactions: WalletTransaction[]): DisplayTransaction[] => {
    return transactions.map((tx) => {
        const { date, time } = formatTransactionDate(tx.createdAt);
        const isCredit = tx.status === 'RECHARGE' || tx.status === 'CREDIT' || tx.amount > 0;

        return {
            id: String(tx.id),
            amount: Math.abs(tx.amount),
            type: isCredit ? 'credit' : 'debit',
            date,
            time,
            description: tx.description || 'Transaction',
        };
    });
};

const WalletScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [totalRecharged, setTotalRecharged] = useState(0);
    const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRecharging, setIsRecharging] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Razorpay WebView checkout state
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState<{ orderId: string; amount: number; keyId: string } | null>(null);
    const [pendingRechargeAmount, setPendingRechargeAmount] = useState(0);
    const [showAmountModal, setShowAmountModal] = useState(false);
    const [customAmount, setCustomAmount] = useState('');

    const styles = createStyles(theme);

    useFocusEffect(
        useCallback(() => {
            fetchWalletData();
        }, [])
    );

    const fetchWalletData = async () => {
        try {
            setIsLoading(true);
            const [walletDetails, recentTx] = await Promise.all([
                getWalletDetails(),
                getRecentTransactions(),
            ]);

            if (walletDetails) {
                setBalance(walletDetails.balance);
                setTotalRecharged(walletDetails.totalRecharged);
            }

            if (recentTx.length > 0) {
                setTransactions(mapTransactions(recentTx));
            }
        } catch (error) {
            console.log('[WalletScreen] Error fetching wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecharge = useCallback(async (amount: number) => {
        console.log('[WalletScreen] handleRecharge called with amount:', amount);

        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
            return;
        }

        try {
            // Step 1: Get Razorpay key
            console.log('[WalletScreen] Fetching Razorpay key...');
            const keyId = await getRazorpayKey();
            console.log('[WalletScreen] Got keyId:', keyId);

            if (!keyId) {
                throw new Error('Payment gateway not configured');
            }

            // Step 2: Create order from backend
            console.log('[WalletScreen] Creating order for amount:', amount);
            const orderResponse = await createWalletRechargeOrder(amount);
            console.log('[WalletScreen] Order response:', orderResponse);

            if (!orderResponse.success || !orderResponse.orderId) {
                throw new Error(orderResponse.error || 'Failed to create payment order.');
            }

            const { orderId, amount: payableAmountRaw } = orderResponse;

            // Step 3: Prepare Razorpay options (EXACT same format as working app)
            const options = {
                description: `Wallet Recharge - ₹${amount}`,
                currency: 'INR',
                key: keyId,
                amount: payableAmountRaw, // Amount in paise
                name: 'UPS Wallet',
                order_id: orderId,
                prefill: {
                    email: user?.email || 'customer@ups.com',
                    name: user?.name || 'Customer'
                },
                theme: { color: '#FF6B35' }
            };

            // Step 4: Open Razorpay via WebView checkout component
            setPendingRechargeAmount(amount);
            setCheckoutData({
                orderId,
                amount: payableAmountRaw || 0,
                keyId,
            });
            setShowCheckout(true);
            console.log('[WalletScreen] Showing Razorpay WebView checkout');

        } catch (apiError) {
            console.error('[WalletScreen] Recharge initiation error:', apiError);
            const message = apiError instanceof Error ? apiError.message : 'Could not initiate the recharge process.';
            Alert.alert('Error', message);
        }
    }, [user?.email, user?.name, fetchWalletData]);

    const handlePaymentSuccess = async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        setShowCheckout(false);
        setIsVerifying(true);

        try {
            const verifyResponse = await verifyWalletRecharge(
                data.razorpay_order_id,
                data.razorpay_payment_id,
                data.razorpay_signature
            );

            if (verifyResponse.success) {
                Alert.alert('Success! 🎉', `₹${pendingRechargeAmount} added to your wallet successfully!`);
                await fetchWalletData();
            } else {
                throw new Error(verifyResponse.error || 'Payment verification failed.');
            }
        } catch (error) {
            console.error('[WalletScreen] Verification Error:', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            Alert.alert('Verification Failed', message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wallet</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={styles.loadingText}>Loading wallet...</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.balanceCard}>
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <View style={styles.creditsBadge}>
                                <Text style={styles.creditsText}>CREDITS</Text>
                            </View>
                        </View>
                        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                        <Text style={styles.monthlyAdded}>
                            Total recharged: {formatCurrency(totalRecharged)}
                        </Text>
                        <View style={styles.activeAccount}>
                            <View style={styles.activeIndicator} />
                            <Text style={styles.activeText}>Active Account</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>QUICK TOP-UP</Text>

                    {/* Add Money with custom amount */}
                    <TouchableOpacity
                        style={styles.addMoneyButton}
                        onPress={() => {
                            setCustomAmount('');
                            setShowAmountModal(true);
                        }}
                    >
                        <Ionicons name="add" size={20} color="#541C0D" />
                        <Text style={styles.addMoneyText}>Add Money</Text>
                    </TouchableOpacity>

                    {/* Quick amount buttons */}
                    <View style={styles.quickAmounts}>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => handleRecharge(500)}
                        >
                            <Text style={styles.quickAmountText}>+ {CURRENCY_SYMBOL}500</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => handleRecharge(1000)}
                        >
                            <Text style={styles.quickAmountText}>+ {CURRENCY_SYMBOL}1000</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.transactionsTitle}>Recent Transactions</Text>
                    <View style={styles.transactionsList}>
                        {transactions.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="receipt-outline" size={48} color={theme.textMuted} />
                                <Text style={styles.emptyText}>No transactions yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Your transaction history will appear here
                                </Text>
                            </View>
                        ) : (
                            transactions.map((transaction) => (
                                <View
                                    key={transaction.id}
                                    style={[
                                        styles.transactionItem,
                                        transaction.type === 'credit' && styles.creditTransaction
                                    ]}
                                >
                                    <View style={styles.transactionLeft}>
                                        <View style={[
                                            styles.transactionIcon,
                                            transaction.type === 'credit'
                                                ? styles.creditIconBg
                                                : styles.debitIconBg
                                        ]}>
                                            <Ionicons
                                                name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                color={transaction.type === 'credit' ? '#22C55E' : theme.primary}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.transactionDescription}>
                                                {transaction.description}
                                            </Text>
                                            <Text style={styles.transactionDate}>
                                                {transaction.date} · {transaction.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[
                                        styles.transactionAmount,
                                        transaction.type === 'credit' && styles.creditAmount
                                    ]}>
                                        {transaction.type === 'credit' ? '+ ' : '- '}
                                        {CURRENCY_SYMBOL}{transaction.amount.toFixed(2)}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}

            {/* Verification overlay - only shows AFTER payment is complete */}
            {isVerifying && (
                <View style={styles.processingOverlay}>
                    <View style={styles.processingCard}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={styles.processingText}>Verifying payment...</Text>
                    </View>
                </View>
            )}

            {/* Razorpay WebView Checkout */}
            {checkoutData && (
                <RazorpayCheckout
                    visible={showCheckout}
                    orderId={checkoutData.orderId}
                    amount={checkoutData.amount}
                    keyId={checkoutData.keyId}
                    description={`Wallet Recharge - ₹${pendingRechargeAmount}`}
                    prefillEmail={user?.email || ''}
                    prefillName={user?.name || ''}
                    onSuccess={handlePaymentSuccess}
                    onDismiss={() => setShowCheckout(false)}
                />
            )}

            {/* Custom Amount Input Modal */}
            <Modal
                visible={showAmountModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAmountModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Money to Wallet</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencyPrefix}>{CURRENCY_SYMBOL}</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={customAmount}
                                onChangeText={setCustomAmount}
                                placeholder="Enter amount"
                                placeholderTextColor={theme.textMuted}
                                keyboardType="numeric"
                                autoFocus
                            />
                        </View>
                        <View style={styles.modalQuickAmounts}>
                            {[100, 200, 500, 1000, 2000].map((amt) => (
                                <TouchableOpacity
                                    key={amt}
                                    style={styles.modalQuickBtn}
                                    onPress={() => setCustomAmount(String(amt))}
                                >
                                    <Text style={styles.modalQuickText}>{CURRENCY_SYMBOL}{amt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setShowAmountModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalPayBtn}
                                onPress={() => {
                                    const numAmount = parseFloat(customAmount || '0');
                                    if (numAmount > 0) {
                                        setShowAmountModal(false);
                                        handleRecharge(numAmount);
                                    } else {
                                        Alert.alert('Invalid Amount', 'Please enter a valid amount');
                                    }
                                }}
                            >
                                <Text style={styles.modalPayText}>Proceed to Pay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: Typography.sizes.md,
        color: theme.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    balanceCard: {
        backgroundColor: theme.cardBackground,
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
        color: theme.textSecondary,
    },
    creditsBadge: {
        backgroundColor: theme.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    creditsText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.semibold,
        color: '#541C0D',
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    monthlyAdded: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
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
        color: theme.textSecondary,
    },
    sectionTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: theme.textSecondary,
        letterSpacing: 1,
        marginBottom: 16,
    },
    addMoneyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primary,
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 16,
    },
    addMoneyText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: '#541C0D',
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    quickAmountButton: {
        flex: 1,
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    quickAmountText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: theme.textPrimary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    transactionsTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginBottom: 16,
    },
    transactionsList: {
        gap: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 8,
    },
    emptyText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textSecondary,
    },
    emptySubtext: {
        fontSize: Typography.sizes.sm,
        color: theme.textMuted,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 18,
    },
    creditTransaction: {
        borderLeftWidth: 3,
        borderLeftColor: '#22C55E',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditIconBg: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    debitIconBg: {
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
    },
    transactionDescription: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: theme.textPrimary,
        marginBottom: 2,
    },
    transactionAmount: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
    },
    creditAmount: {
        color: '#22C55E',
    },
    transactionDate: {
        fontSize: Typography.sizes.sm,
        color: theme.textSecondary,
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    processingCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        gap: 16,
    },
    processingText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.cardBackground,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: Typography.weights.bold,
        color: theme.textPrimary,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        height: 56,
        fontSize: 24,
        fontWeight: Typography.weights.semibold,
        color: theme.textPrimary,
    },
    modalQuickAmounts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    modalQuickBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme.background,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border || 'rgba(255,255,255,0.1)',
    },
    modalQuickText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: theme.textPrimary,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: theme.background,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: theme.textSecondary,
    },
    modalPayBtn: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: theme.primary,
        alignItems: 'center',
    },
    modalPayText: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: '#541C0D',
    },
});

export default WalletScreen;