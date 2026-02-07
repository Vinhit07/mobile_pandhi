
import React from 'react';
import MenuLayout from '../components/MenuLayout';
import { SNACKS_DATA } from '../data/staticMenus';

const SnacksScreen: React.FC = () => {
    return (
        <MenuLayout
            title="Snacks Menu"
            searchPlaceholder="Search for snacks..."
            data={SNACKS_DATA}
        />
    );
};

export default SnacksScreen;
