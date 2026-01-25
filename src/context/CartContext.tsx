import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../data/menuData';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orderNotes, setOrderNotes] = useState('');

    const addItem = (item: MenuItem, variant?: string) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
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
        setItems((prevItems) =>
            prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setOrderNotes('');
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
