// Cart Service - Manages cart operations with backend
import api from './api';

// ============================================================
// API TYPES (matching backend)
// ============================================================

export interface APICartItem {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        category: string;
        isVeg: boolean;
    };
}

export interface APICart {
    id: number;
    customerId: number;
    items: APICartItem[];
}

interface GetCartResponse {
    cart: APICart | null;
}

interface UpdateCartResponse {
    message: string;
}

// ============================================================
// API CALLS
// ============================================================

/**
 * Get the user's cart from the backend
 */
export const getCart = async (): Promise<APICart | null> => {
    const response = await api.get<GetCartResponse>('/customer/outlets/get-cart');

    if (response.error || !response.data) {
        console.log('[CartService] Error fetching cart:', response.error);
        return null;
    }

    return response.data.cart;
};

/**
 * Add or remove items from the cart
 * @param productId - The product ID
 * @param quantity - Number of items to add/remove
 * @param action - 'add' or 'remove'
 */
export const updateCartItem = async (
    productId: number,
    quantity: number,
    action: 'add' | 'remove'
): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<UpdateCartResponse>('/customer/outlets/update-cart-item', {
        productId,
        quantity,
        action,
    });

    if (response.error) {
        console.log('[CartService] Error updating cart:', response.error);
        return {
            success: false,
            message: response.error,
        };
    }

    return {
        success: true,
        message: response.data?.message || 'Cart updated',
    };
};

/**
 * Add a product to the cart
 */
export const addToCart = async (
    productId: number,
    quantity: number = 1
): Promise<{ success: boolean; message: string }> => {
    return updateCartItem(productId, quantity, 'add');
};

/**
 * Remove a product from the cart
 */
export const removeFromCart = async (
    productId: number,
    quantity: number = 1
): Promise<{ success: boolean; message: string }> => {
    return updateCartItem(productId, quantity, 'remove');
};

export default {
    getCart,
    updateCartItem,
    addToCart,
    removeFromCart,
};
