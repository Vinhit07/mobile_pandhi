
import { MenuCategory } from '../components/MenuLayout';

export const SNACKS_DATA: MenuCategory[] = [
    {
        id: 'fresh',
        title: 'Fresh Snacks',
        isOpen: true,
        items: [
            {
                id: 'fs1',
                name: 'Fruit Salad',
                description: 'Fresh seasonal fruits diced and served with chat masala.',
                price: 80,
                isVeg: true,
            },
            {
                id: 'fs2',
                name: 'Sprouts Bowl',
                description: 'Healthy mixed sprouts with onion, tomato and lemon dressing.',
                price: 65,
                isVeg: true,
            },
        ],
    },
    {
        id: 'salads',
        title: 'Salads',
        isOpen: false,
        items: [
            {
                id: 'sl1',
                name: 'Greek Salad',
                description: 'Cucumber, olives, feta cheese, and cherry tomatoes in olive oil.',
                price: 140,
                isVeg: true,
            },
            {
                id: 'sl2',
                name: 'Caesar Salad',
                description: 'Crisp romaine lettuce with croutons and parmesan cheese.',
                price: 120,
                isVeg: true,
            },
        ],
    },
    {
        id: 'noodles',
        title: 'Noodles',
        isOpen: false,
        items: [
            {
                id: 'nd1',
                name: 'Veg Hakka Noodles',
                description: 'Wok-tossed noodles with crunchy vegetables and soy sauce.',
                price: 110,
                isVeg: true,
            },
            {
                id: 'nd2',
                name: 'Schezwan Noodles',
                description: 'Spicy noodles tossed in house-special schezwan sauce.',
                price: 120,
                isVeg: true,
            },
        ],
    },
    {
        id: 'sandwiches',
        title: 'Sandwiches',
        isOpen: false,
        items: [
            {
                id: 'sw1',
                name: 'Bombay Grill',
                description: 'Spiced potato mash, veggies and cheese grilled to perfection.',
                price: 85,
                isVeg: true,
            },
        ],
    },
    {
        id: 'fried',
        title: 'Fried Items',
        isOpen: false,
        items: [
            {
                id: 'fr1',
                name: 'French Fries',
                description: 'Classic salted potato fries, crispy and golden.',
                price: 70,
                isVeg: true,
            },
            {
                id: 'fr2',
                name: 'Veg Cutlet',
                description: 'Spiced vegetable patty, breaded and deep fried. 2 pcs.',
                price: 45,
                isVeg: true,
            },
        ],
    },
    {
        id: 'quick',
        title: 'Quick Bites',
        isOpen: false,
        items: [
            {
                id: 'qb1',
                name: 'Samosa',
                description: 'Crispy pastry filled with spiced potatoes and peas.',
                price: 20,
                isVeg: true,
            },
        ],
    },
];

export const MAIN_MEAL_DATA: MenuCategory[] = [
    {
        id: 'north',
        title: 'North Indian',
        isOpen: true,
        items: [
            {
                id: 'ni1',
                name: 'Paneer Butter Masala',
                description: 'Soft paneer cubes cooked in a rich, creamy tomato gravy.',
                price: 180,
                isVeg: true,
            },
            {
                id: 'ni2',
                name: 'Dal Makhani',
                description: 'Slow-cooked black lentils with butter and cream.',
                price: 150,
                isVeg: true,
            },
        ],
    },
    {
        id: 'south',
        title: 'South Indian',
        isOpen: false,
        items: [
            {
                id: 'si1',
                name: 'Masala Dosa',
                description: 'Crispy rice crepe filled with spiced potato masala.',
                price: 90,
                isVeg: true,
            },
            {
                id: 'si2',
                name: 'Idli Sambar',
                description: 'Steamed rice cakes served with lentil soup and chutney. 3 pcs.',
                price: 70,
                isVeg: true,
            },
        ],
    },
    {
        id: 'rice',
        title: 'Rice & Biryani',
        isOpen: false,
        items: [
            {
                id: 'rb1',
                name: 'Veg Hyderabadi Biryani',
                description: 'Aromatic basmati rice cooked with mixed vegetables and spices.',
                price: 210,
                isVeg: true,
            },
            {
                id: 'rb2',
                name: 'Jeera Rice',
                description: 'Fluffy basmati rice tempered with cumin seeds and coriander.',
                price: 120,
                isVeg: true,
            },
        ],
    },
    {
        id: 'combos',
        title: 'Roti & Curry Combos',
        isOpen: false,
        items: [
            {
                id: 'rc1',
                name: 'Roti & Paneer Combo',
                description: '3 Tawa Rotis served with a portion of Paneer Butter Masala.',
                price: 160,
                isVeg: true,
            },
        ],
    },
    {
        id: 'thali',
        title: 'Thali Meals',
        isOpen: false,
        items: [
            {
                id: 'tm1',
                name: 'Mini Thali',
                description: '2 Rotis, Dal, Sabzi of the day, Rice, and Pickle.',
                price: 140,
                isVeg: true,
            },
            {
                id: 'tm2',
                name: 'Deluxe Thali',
                description: '3 Rotis, Paneer, Dal Makhani, Rice, Raita, Sweet, and Papad.',
                price: 220,
                isVeg: true,
            },
        ],
    },
];

export const HOT_BEVERAGES_DATA: MenuCategory[] = [
    {
        id: 'tea',
        title: 'Tea',
        isOpen: true,
        items: [
            {
                id: 'tea1',
                name: 'Masala Chai',
                description: 'Traditional Indian tea brewed with aromatic spices and ginger.',
                price: 25,
                isVeg: true,
            },
            {
                id: 'tea2',
                name: 'Ginger Tea',
                description: 'Refreshing tea infused with fresh ginger for a spicy kick.',
                price: 20,
                isVeg: true,
            },
            {
                id: 'tea3',
                name: 'Lemon Tea',
                description: 'Black tea with a splash of fresh lemon juice and honey.',
                price: 20,
                isVeg: true,
            },
        ],
    },
    {
        id: 'coffee',
        title: 'Coffee',
        isOpen: false,
        items: [
            {
                id: 'cof1',
                name: 'Filter Coffee',
                description: 'Classic South Indian filter coffee brewed to perfection.',
                price: 30,
                isVeg: true,
            },
            {
                id: 'cof2',
                name: 'Cappuccino',
                description: 'Rich espresso topped with frothy steamed milk.',
                price: 60,
                isVeg: true,
            },
        ],
    },
    {
        id: 'milk',
        title: 'Hot Milk',
        isOpen: false,
        items: [
            {
                id: 'mk1',
                name: 'Horlicks',
                description: 'Nutritious malted milk drink.',
                price: 40,
                isVeg: true,
            },
        ],
    },
    {
        id: 'soups',
        title: 'Soups',
        isOpen: false,
        items: [
            {
                id: 'sp1',
                name: 'Tomato Soup',
                description: 'Classic creamy tomato soup served with croutons.',
                price: 50,
                isVeg: true,
            },
        ],
    },
];
