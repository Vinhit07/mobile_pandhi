import React, { useEffect, useState } from 'react';
import MenuLayout from '../components/MenuLayout';
import { MenuCategory } from '../data/menuData';
import { useTheme } from '../context';

const HotBeveragesScreen: React.FC = ({ route }: any) => {
    const { theme } = useTheme();
    const [categoryData, setCategoryData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        // Get category data from navigation params (from API) or use empty
        const data = route?.params?.categoryData;
        console.log('[HotBeveragesScreen] Received categoryData:', data ? 'YES' : 'NO');

        if (data) {
            setCategoryData([data]);
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
