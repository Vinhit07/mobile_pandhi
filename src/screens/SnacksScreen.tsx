import React, { useEffect, useState } from 'react';
import MenuLayout, { MenuCategory } from '../components/MenuLayout';

const SnacksScreen: React.FC = ({ route }: any) => {
    const [categoryData, setCategoryData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        // Get category data from navigation params (from API) or use empty
        const data = route?.params?.categoryData;
        console.log('[SnacksScreen] Received categoryData:', data ? 'YES' : 'NO');

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

    return (
        <MenuLayout
            title="Snacks Menu"
            searchPlaceholder="Search for snacks..."
            data={categoryData}
        />
    );
};

export default SnacksScreen;
