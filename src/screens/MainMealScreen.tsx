
import React from 'react';
import MenuLayout from '../components/MenuLayout';
import { MAIN_MEAL_DATA } from '../data/staticMenus';

const MainMealScreen: React.FC = () => {
    return (
        <MenuLayout
            title="Main Meal Menu"
            searchPlaceholder="Search for main course..."
            data={MAIN_MEAL_DATA}
        />
    );
};

export default MainMealScreen;
