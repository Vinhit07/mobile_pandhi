import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { HomeScreen, CartScreen, WalletScreen, ProfileScreen } from './src/screens';
import { CartProvider } from './src/context';
import Colors from './src/constants/Colors';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string, focused: boolean, size: number) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Cart':
      iconName = focused ? 'cart' : 'cart-outline';
      break;
    case 'Wallet':
      iconName = focused ? 'wallet' : 'wallet-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={iconName}
        size={size}
        color={focused ? Colors.primary : Colors.tabBarInactive}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, size }) => getTabBarIcon(route.name, focused, size),
              tabBarActiveTintColor: Colors.primary,
              tabBarInactiveTintColor: Colors.tabBarInactive,
              tabBarStyle: {
                backgroundColor: Colors.tabBarBackground,
                borderTopWidth: 0,
                height: 65,
                paddingBottom: 8,
                paddingTop: 8,
                elevation: 0,
                shadowOpacity: 0,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              },
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '500',
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 4,
    borderRadius: 8,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
});
