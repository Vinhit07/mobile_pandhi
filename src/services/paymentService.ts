// Payment Service - Razorpay integration for wallet recharge and order payment
import api from './api';

// ============================================================
// API TYPES
// ============================================================

interface RazorpayKeyResponse {
    keyId: string;
}

interface CreateOrderResponse {
    order: {
        id: string;
        amount: number;
        currency: string;
    };
    breakdown?: {
        walletAmount: number;
        serviceCharge: number;
        totalPayable: number;
        serviceChargePercentage: number;
    };
    message: string;
}

interface VerifyPaymentResponse {
    success?: boolean;
    message: string;
    wallet?: {
        balance: number;
        totalRecharged: number;
        lastRecharged: string;
    };
    transaction?: {
        id: number;
        amount: number;
        method: string;
        createdAt: string;
    };
}

// ============================================================
// API CALLS
// ============================================================

/**
 * Get Razorpay public key from backend
 */
export const getRazorpayKey = async (): Promise<string | null> => {
    const response = await api.get<RazorpayKeyResponse>('/customer/outlets/razorpay-key');
    if (response.error || !response.data) {
        console.warn('[PaymentService] Failed to get Razorpay key:', response.error);
        return null;
    }
    return response.data.keyId;
};

/**
 * Create wallet recharge order
 */
export const createWalletRechargeOrder = async (
    amount: number
): Promise<{ success: boolean; orderId?: string; amount?: number; error?: string }> => {
    const response = await api.post<CreateOrderResponse>(
        '/customer/outlets/create-wallet-recharge-order',
        { amount }
    );

    if (response.error || !response.data) {
        return { success: false, error: response.error || 'Failed to create order' };
    }

    return {
        success: true,
        orderId: response.data.order.id,
        amount: response.data.order.amount, // in paise
    };
};

/**
 * Verify wallet recharge payment
 */
export const verifyWalletRecharge = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): Promise<{ success: boolean; balance?: number; error?: string }> => {
    const response = await api.post<VerifyPaymentResponse>(
        '/customer/outlets/verify-wallet-recharge',
        {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
        }
    );

    if (response.error || !response.data) {
        return { success: false, error: response.error || 'Verification failed' };
    }

    return {
        success: true,
        balance: response.data.wallet?.balance,
    };
};

/**
 * Create Razorpay order for direct order payment
 */
export const createOrderPayment = async (
    amount: number
): Promise<{ success: boolean; orderId?: string; amount?: number; error?: string }> => {
    const response = await api.post<{ order: { id: string; amount: number }; success: boolean }>(
        '/customer/outlets/create-razorpay-order',
        { amount }
    );

    if (response.error || !response.data) {
        return { success: false, error: response.error || 'Failed to create order' };
    }

    return {
        success: true,
        orderId: response.data.order.id,
        amount: response.data.order.amount,
    };
};

/**
 * Verify direct order payment
 */
export const verifyOrderPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): Promise<{ success: boolean; error?: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
        '/customer/outlets/verify-razorpay-payment',
        {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
        }
    );

    if (response.error || !response.data) {
        return { success: false, error: response.error || 'Verification failed' };
    }

    return { success: response.data.success };
};

export default {
    getRazorpayKey,
    createWalletRechargeOrder,
    verifyWalletRecharge,
    createOrderPayment,
    verifyOrderPayment,
};
