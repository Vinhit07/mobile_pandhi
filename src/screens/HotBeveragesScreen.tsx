
import React from 'react';
import MenuLayout from '../components/MenuLayout';
import { HOT_BEVERAGES_DATA } from '../data/staticMenus';
import { useTheme } from '../context';

const HotBeveragesScreen: React.FC = () => {
    const { theme } = useTheme();
    // HTML reference shows Gold headers for Hot Beverages categories
    return (
        <MenuLayout
            title="Hot Beverages"
            searchPlaceholder="Search for beverages..."
            data={HOT_BEVERAGES_DATA}
            categoryTitleColor={theme.primary}
        />
    );
};

export default HotBeveragesScreen;
