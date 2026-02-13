import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

import { HomeScreen, CartScreen, WalletScreen, ProfileScreen, PopupDetailScreen, SignInScreen } from './src/screens';
import { CartProvider, ThemeProvider, useTheme, AuthProvider, useAuth } from './src/context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const getTabBarIcon = (routeName: string, focused: boolean, size: number, activeColor: string, inactiveColor: string) => {
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
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  );
};

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) =>
          getTabBarIcon(route.name, focused, size, theme.primary, theme.tabBarInactive),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
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
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.loadingLogo, { backgroundColor: theme.cardBackground }]}>
          <Ionicons name="fast-food" size={48} color={theme.primary} />
        </View>
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>Quick Byte</Text>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      {isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="PopupDetail"
            component={PopupDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '700',
  },
});

