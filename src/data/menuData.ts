// Menu data types
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    outletId?: number; // Optional for backward compatibility with mock data
}

export interface MenuCategory {
    id: string;
    name: string;
    icon: string;
    items: MenuItem[];
}

export interface FavoriteItem {
    id: string;
    name: string;
    lastOrdered: string;
    price: number;
    image: string;
}

export interface PopupItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    isLive: boolean;
}

// Sample menu data with Indian Rupee pricing
export const menuCategories: MenuCategory[] = [
    {
        id: 'beverages',
        name: 'Beverages',
        icon: '☕',
        items: [
            {
                id: 'bev1',
                name: 'Classic Cappuccino',
                description: 'Rich espresso with steamed milk foam',
                price: 120,
                image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop',
                category: 'beverages',
            },
            {
                id: 'bev2',
                name: 'Iced Latte',
                description: 'Double shot espresso served over ice',
                price: 150,
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop',
                category: 'beverages',
            },
            {
                id: 'bev3',
                name: 'Berry Smoothie',
                description: 'Mixed berries blended with yogurt',
                price: 180,
                image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=100&h=100&fit=crop',
                category: 'beverages',
            },
        ],
    },
    {
        id: 'snacks',
        name: 'Snacks',
        icon: '🍪',
        items: [
            {
                id: 'snk1',
                name: 'Crispy Samosa',
                description: 'Golden fried pastry with spiced potato filling',
                price: 40,
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop',
                category: 'snacks',
            },
            {
                id: 'snk2',
                name: 'Vegetable Spring Roll',
                description: 'Crispy rolls with mixed vegetables',
                price: 60,
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop',
                category: 'snacks',
            },
        ],
    },
    {
        id: 'meals',
        name: 'Meals',
        icon: '🍽️',
        items: [
            {
                id: 'meal1',
                name: 'Chicken Biryani',
                description: 'Fragrant rice with tender chicken pieces',
                price: 220,
                image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop',
                category: 'meals',
            },
            {
                id: 'meal2',
                name: 'Paneer Butter Masala',
                description: 'Creamy tomato curry with cottage cheese',
                price: 180,
                image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop',
                category: 'meals',
            },
        ],
    },
    {
        id: 'juices',
        name: 'Fresh Juices',
        icon: '🧃',
        items: [
            {
                id: 'juice1',
                name: 'Orange Juice',
                description: 'Freshly squeezed orange juice',
                price: 80,
                image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100&h=100&fit=crop',
                category: 'juices',
            },
            {
                id: 'juice2',
                name: 'Watermelon Juice',
                description: 'Refreshing watermelon with mint',
                price: 70,
                image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=100&h=100&fit=crop',
                category: 'juices',
            },
        ],
    },
    {
        id: 'main',
        name: 'Main Course',
        icon: '🍛',
        items: [
            {
                id: 'main1',
                name: 'Spicy Chicken',
                description: 'Tender chicken in spicy sauce',
                price: 250,
                image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop',
                category: 'main',
            },
            {
                id: 'main2',
                name: 'Grilled Fish',
                description: 'Fresh fish with herbs and lemon',
                price: 320,
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop',
                category: 'main',
            },
        ],
    },
];

export const favoriteItems: FavoriteItem[] = [
    {
        id: 'fav1',
        name: 'Spicy Chicken',
        lastOrdered: 'Tue',
        price: 250,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop',
    },
    {
        id: 'fav2',
        name: 'Grilled Salmon',
        lastOrdered: 'Mon',
        price: 350,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop',
    },
    {
        id: 'fav3',
        name: 'Chicken Biryani',
        lastOrdered: 'Fri',
        price: 220,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop',
    },
];

export const popupItems: PopupItem[] = [
    {
        id: 'dominos',
        title: "Domino's",
        subtitle: 'Pizza • Italian • Fast Food',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop',
        isLive: true,
    },
    {
        id: 'popup1',
        title: 'Fresh Subs',
        subtitle: 'Make it your way',
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=200&fit=crop',
        isLive: true,
    },

    {
        id: 'popup3',
        title: 'Coffee Hour',
        subtitle: '20% off on all beverages',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop',
        isLive: true,
    },
];
