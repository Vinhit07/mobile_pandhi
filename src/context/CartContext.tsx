import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useToast } from './ToastContext';
import { MenuItem } from '../data/menuData';
import { getCurrentQuota } from '../services/productService';

export interface CartItem extends MenuItem {
    quantity: number;
    variant?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: MenuItem, variant?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getDeliveryFee: () => number;
    getTotal: () => number;
    orderNotes: string;
    setOrderNotes: (notes: string) => void;
    remainingQuota: number;
    refreshQuota: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orderNotes, setOrderNotes] = useState('');
    const [remainingQuota, setRemainingQuota] = useState(5);
    const { showToast } = useToast();

    // Fetch quota on mount
    const refreshQuota = async () => {
        try {
            const quota = await getCurrentQuota();
            if (quota !== null) {
                setRemainingQuota(quota.remainingQuota);
            }
        } catch (e) {
            // Silently fail, keep default
        }
    };

    useEffect(() => {
        refreshQuota();
    }, []);

    // Count company-paid items currently in cart
    const getCartCompanyPaidCount = (currentItems: CartItem[]) => {
        return currentItems.reduce((sum, item) => {
            if (item.companyPaid) return sum + item.quantity;
            return sum;
        }, 0);
    };

    const addItem = (item: MenuItem, variant?: string) => {
        // Block out-of-stock items
        if (item.isAvailable === false || (item.availableQuantity !== undefined && item.availableQuantity <= 0)) {
            showToast('This item is out of stock');
            return;
        }

        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            const currentQty = existingItem ? existingItem.quantity : 0;

            // Check stock limit
            if (item.availableQuantity !== undefined && currentQty + 1 > item.availableQuantity) {
                showToast(`Only ${item.availableQuantity} available in stock`);
                return prevItems;
            }

            // Check quota threshold for company-paid items
            if (item.companyPaid) {
                const companyPaidCount = getCartCompanyPaidCount(prevItems);
                // Show warning only when crossing the threshold (first time going over)
                if (companyPaidCount + 1 > remainingQuota && companyPaidCount < remainingQuota + 1) {
                    // We can't show Alert inside setState, so we handle it differently
                    // The warning will be shown via the MenuLayout component before calling addItem
                }
            }

            showToast('Item added to cart');
            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1, variant }];
        });
    };

    const removeItem = (itemId: string) => {
        setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }

        // Check stock limit
        const item = items.find(i => i.id === itemId);
        if (item && item.availableQuantity !== undefined && quantity > item.availableQuantity) {
            showToast(`Only ${item.availableQuantity} available in stock`);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setOrderNotes('');
        refreshQuota(); // Instantly sync quota with backend after order success
    };

    const getSubtotal = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getDeliveryFee = () => {
        // For cafeteria pickup, this could be a service fee or 0
        return items.length > 0 ? 2.50 : 0;
    };

    const getTotal = () => {
        return getSubtotal() + getDeliveryFee();
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getSubtotal,
                getDeliveryFee,
                getTotal,
                orderNotes,
                setOrderNotes,
                remainingQuota,
                refreshQuota,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
