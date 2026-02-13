// Wallet Service - Fetch wallet details and transaction history
import { api } from './api';

export interface WalletDetails {
    balance: number;
    totalRecharged: number;
    totalUsed: number;
    lastRecharged: string | null;
    lastOrder: string | null;
}

export interface WalletTransaction {
    id: number;
    amount: number;
    method: string;
    status: string; // 'RECHARGE', 'DEDUCT', 'CREDIT'
    description: string;
    createdAt: string;
}

export interface WalletDetailsResponse {
    message: string;
    wallet: WalletDetails;
}

export interface RecentTransactionsResponse {
    message: string;
    transactions: WalletTransaction[];
}

/**
 * Get wallet details (balance, totals)
 */
export const getWalletDetails = async (): Promise<WalletDetails | null> => {
    const response = await api.get<WalletDetailsResponse>('/customer/outlets/get-wallet-details');

    if (response.error || !response.data) {
        console.log('[WalletService] Error fetching wallet details:', response.error);
        return null;
    }

    return response.data.wallet;
};

/**
 * Get recent wallet transactions
 */
export const getRecentTransactions = async (): Promise<WalletTransaction[]> => {
    const response = await api.get<RecentTransactionsResponse>('/customer/outlets/get-recent-recharge');

    if (response.error || !response.data) {
        console.log('[WalletService] Error fetching transactions:', response.error);
        return [];
    }

    return response.data.transactions || [];
};

export default {
    getWalletDetails,
    getRecentTransactions,
};
