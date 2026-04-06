import React, { useEffect, useState } from 'react';
import MenuLayout, { MenuCategory } from '../components/MenuLayout';
import { useTheme } from '../context';

const HotBeveragesScreen: React.FC = ({ route }: any) => {
    const { theme } = useTheme();
    const [categoryData, setCategoryData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        // Get category data from navigation params (from API) or use empty
        const data = route?.params?.categoryData;
        console.log('[HotBeveragesScreen] Received categoryData:', data ? 'YES' : 'NO');

        if (data) {
            // Transform data to match MenuLayout expectations
            const name = data.name || data.title || 'Category';
            const transformedData = {
                id: data.id || '1',
                title: name,
                items: (data.items || []).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    isVeg: item.isVeg !== undefined ? item.isVeg : true,
                    companyPaid: item.companyPaid || false,
                    availableQuantity: item.availableQuantity,
                    isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
                })),
                isOpen: true,
            };
            setCategoryData([transformedData]);
        } else {
            setCategoryData([]);
        }
    }, [route?.params?.categoryData]);

    // HTML reference shows Gold headers for Hot Beverages categories
    return (
        <MenuLayout
            title="Hot Beverages"
            searchPlaceholder="Search for beverages..."
            data={categoryData}
            categoryTitleColor={theme.primary}
        />
    );
};

export default HotBeveragesScreen;
