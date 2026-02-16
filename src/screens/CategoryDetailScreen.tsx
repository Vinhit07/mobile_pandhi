import React, { useEffect, useState } from 'react';
import MenuLayout from '../components/MenuLayout';

interface CategoryDetailScreenProps {
    route: any;
    navigation: any;
}

const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({ route, navigation }) => {
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState<string>('Menu');

    useEffect(() => {
        // Get category data from navigation params (from API)
        const data = route?.params?.categoryData;
        const name = route?.params?.categoryName || data?.name || 'Menu';

        console.log('[CategoryDetailScreen] Received categoryData:', data ? 'YES' : 'NO');
        console.log('[CategoryDetailScreen] Category name:', name);

        if (data) {
            // Transform data to match MenuLayout's expected structure
            const transformedData = {
                id: data.id || '1',
                title: name, // MenuLayout expects 'title', not 'name'
                items: (data.items || []).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    isVeg: item.isVeg !== undefined ? item.isVeg : true,
                    companyPaid: item.companyPaid || false,
                })),
                isOpen: true, // MenuLayout expects this for accordion behavior
            };

            console.log('[CategoryDetailScreen] Transformed items:', transformedData.items.length);
            setCategoryData([transformedData]);
            setCategoryName(name);
        } else {
            console.warn('[CategoryDetailScreen] No category data received');
            setCategoryData([]);
        }
    }, [route?.params]);

    return (
        <MenuLayout
            title={`${categoryName} Menu`}
            searchPlaceholder={`Search for ${categoryName.toLowerCase()}...`}
            data={categoryData}
        />
    );
};

export default CategoryDetailScreen;
