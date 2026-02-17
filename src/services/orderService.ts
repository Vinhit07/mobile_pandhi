// Order Service - Manages order placement and history
import api from './api';

// ============================================================
// API TYPES (matching backend)
// ============================================================

export interface OrderItem {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface PlaceOrderRequest {
    totalAmount: number;
    paymentMethod: 'WALLET' | 'UPI' | 'CARD' | 'CASH';
    deliverySlot: 'SLOT_11_12' | 'SLOT_12_13' | 'SLOT_13_14' | 'SLOT_14_15' | 'SLOT_15_16' | 'SLOT_16_17';
    outletId: number;
    items: OrderItem[];
    couponCode?: string;
    requestedDeliveryDate?: string;
    paymentDetails?: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    };
}

export interface APIOrderItem {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    status: string;
    product: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
    };
}

export interface APIOrder {
    id: number;
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    deliverySlot: string | null;
    deliveryDate: string | null;
    isPreOrder: boolean;
    createdAt: string;
    items: APIOrderItem[];
}

interface PlaceOrderResponse {
    message: string;
    order: APIOrder;
    stockUpdates: any[];
    couponDiscount: number;
    pricingBreakdown: {
        freeItems: any[];
        paidCompanyItems: any[];
        regularItems: any[];
        freeAmount: number;
        paidCompanyAmount: number;
        regularAmount: number;
        totalCompanyPaidQty: number;
    };
}

interface OrderHistoryResponse {
    orders: APIOrder[];
}

// ============================================================
// API CALLS
// ============================================================

/**
 * Place a new order
 */
export const placeOrder = async (
    orderData: PlaceOrderRequest
): Promise<{
    success: boolean;
    order?: APIOrder;
    error?: string;
}> => {
    const response = await api.post<PlaceOrderResponse>(
        '/customer/outlets/customer-order/',
        orderData
    );

    if (response.error || !response.data) {
        return {
            success: false,
            error: response.error || 'Failed to place order',
        };
    }

    return {
        success: true,
        order: response.data.order,
    };
};

/**
 * Get order history
 */
export const getOrderHistory = async (): Promise<APIOrder[]> => {
    const response = await api.get<OrderHistoryResponse>(
        '/customer/outlets/customer-order-history/'
    );

    if (response.error || !response.data) {
        console.log('[OrderService] Error fetching order history:', response.error);
        return [];
    }

    return response.data.orders || [];
};

/**
 * Get ongoing orders
 */
export const getOngoingOrders = async (): Promise<APIOrder[]> => {
    const response = await api.get<OrderHistoryResponse>(
        '/customer/outlets/customer-ongoing-order/'
    );

    if (response.error || !response.data) {
        console.log('[OrderService] Error fetching ongoing orders:', response.error);
        return [];
    }

    return response.data.orders || [];
};

/**
 * Cancel an order
 */
export const cancelOrder = async (
    orderId: number
): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ message: string }>(
        `/customer/outlets/customer-cancel-order/${orderId}`,
        {}
    );

    if (response.error) {
        return {
            success: false,
            message: response.error,
        };
    }

    return {
        success: true,
        message: response.data?.message || 'Order cancelled',
    };
};

/**
 * Get available delivery dates and slots
 */
export const getAvailableDatesAndSlots = async (
    outletId: number
): Promise<Array<{ date: string; slots: string[] }>> => {
    const response = await api.get<{
        message: string;
        data: Array<{ date: string; slots: string[] }>;
    }>(`/customer/outlets/get-appdates/${outletId}`);

    if (response.error || !response.data) {
        return [];
    }

    return response.data.data || [];
};

export default {
    placeOrder,
    getOrderHistory,
    getOngoingOrders,
    cancelOrder,
    getAvailableDatesAndSlots,
};
