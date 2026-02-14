import React, { useEffect, useState } from 'react';
import MenuLayout from '../components/MenuLayout';
import { MenuCategory } from '../data/menuData';

const SnacksScreen: React.FC = ({ route }: any) => {
    const [categoryData, setCategoryData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        // Get category data from navigation params (from API) or use empty
        const data = route?.params?.categoryData;
        console.log('[SnacksScreen] Received categoryData:', data ? 'YES' : 'NO');

        if (data) {
            setCategoryData([data]);
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
