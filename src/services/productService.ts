// Product Service - Fetches products from backend or falls back to mock data
import api, { isAuthenticated } from './api';
import { menuCategories, MenuItem, MenuCategory } from '../data/menuData';

// ============================================================
// API RESPONSE TYPES (matching backend)
// ============================================================

export interface APIProduct {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    outletId: number;
    category: string;
    minValue: number | null;
    isVeg: boolean;
    ratingSum30d: number;
    ratingCount30d: number;
    trendScore: number;
    ratingSumLifetime: number;
    ratingCountLifetime: number;
    averageRatingLifetime: number;
    companyPaid: boolean;
    availableQuantity: number;
    remainingQuota: number;
    isAvailable: boolean;
}

interface GetProductsResponse {
    products: APIProduct[];
}

// ============================================================
// TRANSFORMERS
// ============================================================

// Map backend category to UI icon
const categoryIcons: Record<string, string> = {
    BEVERAGE: '☕',
    SNACKS: '🍪',
    MEALS: '🍽️',
    JUICES: '🧃',
    MAIN: '🍛',
};

// Convert API product to MenuItem format
export const transformProduct = (product: APIProduct): MenuItem => ({
    id: String(product.id),
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: product.imageUrl || 'https://via.placeholder.com/100',
    category: product.category.toLowerCase(),
    outletId: product.outletId, // IMPORTANT: Preserve outletId for filtering
    isVeg: product.isVeg,
    companyPaid: product.companyPaid,
});

// Group products into categories
export const groupProductsIntoCategories = (products: APIProduct[]): MenuCategory[] => {
    const categoryMap: Record<string, MenuItem[]> = {};

    products.forEach((product) => {
        const categoryKey = product.category;
        if (!categoryMap[categoryKey]) {
            categoryMap[categoryKey] = [];
        }
        categoryMap[categoryKey].push(transformProduct(product));
    });

    return Object.entries(categoryMap).map(([key, items]) => ({
        id: key.toLowerCase(),
        name: key.charAt(0) + key.slice(1).toLowerCase(),
        icon: categoryIcons[key] || '🍴',
        items,
    }));
};

// ============================================================
// API CALLS
// ============================================================

export const getProducts = async (): Promise<{
    categories: MenuCategory[];
    products: APIProduct[];
    fromAPI: boolean;
}> => {
    console.log('[ProductService] ========== FETCHING PRODUCTS ==========');

    // Check if user is authenticated
    const authenticated = await isAuthenticated();
    console.log('[ProductService] Authentication status:', authenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');

    if (!authenticated) {
        // Return mock data if not authenticated
        console.log('[ProductService] No auth token, using mock data');
        return {
            categories: menuCategories,
            products: [],
            fromAPI: false,
        };
    }

    // Fetch from API
    console.log('[ProductService] Making API call to /customer/outlets/get-product/');
    const response = await api.get<GetProductsResponse>('/customer/outlets/get-product/');
    console.log('[ProductService] API Response status:', response.status);
    console.log('[ProductService] API Response error:', response.error || 'None');
    console.log('[ProductService] API Response has data:', response.data ? 'YES' : 'NO');

    if (response.error || !response.data) {
        console.log('[ProductService] API error, falling back to mock data:', response.error);
        return {
            categories: menuCategories,
            products: [],
            fromAPI: false,
        };
    }

    const products = response.data.products;
    console.log('[ProductService] ✅ GOT REAL DATA FROM API - Product count:', products.length);
    const categories = groupProductsIntoCategories(products);

    return {
        categories,
        products,
        fromAPI: true,
    };
};

// Get current user quota (for company-paid items)
export const getCurrentQuota = async (): Promise<{
    remainingQuota: number;
    quantityUsed: number;
    totalQuota: number;
} | null> => {
    const response = await api.get<{
        remainingQuota: number;
        quantityUsed: number;
        totalQuota: number;
    }>('/customer/outlets/get-current-quota');

    if (response.error || !response.data) {
        return null;
    }

    return response.data;
};

// Get available outlets (public - no auth required)
export const getOutlets = async (): Promise<Array<{
    id: number;
    name: string;
    address: string | null;
    isActive: boolean;
}>> => {
    const response = await api.get<{ outlets: any[] }>('/customer/get-outlets/', false);

    if (response.error || !response.data) {
        return [];
    }

    return response.data.outlets;
};

export default {
    getProducts,
    getCurrentQuota,
    getOutlets,
};
