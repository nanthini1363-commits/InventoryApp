import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import HomeScreen       from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ScanScreen       from '../screens/ScanScreen';
import BillingScreen    from '../screens/BillingScreen';
import SettingsScreen   from '../screens/SettingsScreen';
import { selectCartItemCount } from '../store/slices/cartSlice';
import { COLORS, FONT_SIZE, RADIUS } from '../styles/theme';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Bottom Tab Navigator ────────────────────────────────────────────────────

const TabNavigator = () => {
  const cartCount = useSelector(selectCartItemCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor:   COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':     iconName = focused ? 'home'           : 'home-outline';     break;
            case 'Scan':     iconName = focused ? 'scan'           : 'scan-outline';     break;
            case 'Billing':  iconName = focused ? 'cart'           : 'cart-outline';     break;
            case 'Settings': iconName = focused ? 'settings'       : 'settings-outline'; break;
            default:         iconName = 'ellipse';
          }
          return (
            <View style={styles.iconWrap}>
              <Ionicons name={iconName} size={22} color={color} />
              {route.name === 'Billing' && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     options={{ title: 'Inventory' }} />
      <Tab.Screen name="Scan"     component={ScanScreen}     options={{ title: 'Scanner' }} />
      <Tab.Screen name="Billing"  component={BillingScreen}  options={{ title: 'Billing' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

// ── Root Stack Navigator ────────────────────────────────────────────────────

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs"       component={TabNavigator} />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgSurface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs - 1,
    fontWeight: '600',
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },
});

export default AppNavigator;
