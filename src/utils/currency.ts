// Currency formatting utilities for Indian Rupees

export const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
};

export const formatCurrencyShort = (amount: number): string => {
    return `₹${Math.round(amount)}`;
};

export const CURRENCY_SYMBOL = '₹';

export default { formatCurrency, formatCurrencyShort, CURRENCY_SYMBOL };
