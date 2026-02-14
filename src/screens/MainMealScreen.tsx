import React, { useEffect, useState } from 'react';
import MenuLayout from '../components/MenuLayout';
import { MenuCategory } from '../data/menuData';

const MainMealScreen: React.FC = ({ route }: any) => {
    const [categoryData, setCategoryData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        // Get category data from navigation params (from API) or use empty
        const data = route?.params?.categoryData;
        console.log('[MainMealScreen] Received categoryData:', data ? 'YES' : 'NO');

        if (data) {
            setCategoryData([data]);
        } else {
            setCategoryData([]);
        }
    }, [route?.params?.categoryData]);

    return (
        <MenuLayout
            title="Main Meal Menu"
            searchPlaceholder="Search for main course..."
            data={categoryData}
        />
    );
};

export default MainMealScreen;
