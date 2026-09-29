import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import HotelsScreen from './src/screens/HotelsScreen';
import HotelDetailScreen from './src/screens/HotelDetailScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import RoomDetailScreen from './src/screens/RoomDetailScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import RestaurantScreen from './src/screens/RestaurantScreen';
import WeddingsScreen from './src/screens/WeddingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';
import BookingScreen from './src/screens/BookingScreen';
import { COLORS } from './src/theme/colors';

// Ensure 100% full width and no white letterboxing on web mobile views (e.g. iPhone 16)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'm2n-global-web-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html, body, #root {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #000000 !important;
        overflow-x: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Rooms" component={RoomsScreen} />
    </Stack.Navigator>
  );
}

function HotelsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Hotels" component={HotelsScreen} />
      <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Rooms" component={RoomsScreen} />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

function DiningStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dining" component={RestaurantScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

function WeddingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Weddings" component={WeddingsScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={AboutScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

// Custom Luxury M2N Bottom Navigation Bar matching m2nhotels.com 5 tabs
function M2NTabBar({ state, descriptors, navigation }) {
  const tabs = [
    { name: 'HomeTab', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'HotelsTab', label: 'Stays', icon: 'bed', iconOutline: 'bed-outline' },
    { name: 'DiningTab', label: 'Dining', icon: 'restaurant', iconOutline: 'restaurant-outline' },
    { name: 'GalleryTab', label: 'Experiences', icon: 'sparkles', iconOutline: 'sparkles-outline' },
    { name: 'WeddingsTab', label: 'Weddings', icon: 'heart', iconOutline: 'heart-outline' },
  ];

  return (
    <View style={styles.floatingTabBarWrapper} pointerEvents="box-none">
      <View style={styles.floatingTabBar}>
        {state.routes
          .filter((route) => tabs.some((t) => t.name === route.name))
          .map((route, index) => {
            const isFocused = state.index === index;
            const tabConfig = tabs.find((t) => t.name === route.name) || {
              label: route.name,
              icon: 'ellipse',
              iconOutline: 'ellipse-outline',
            };

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.tabItem,
                  isFocused && styles.tabItemFocused,
                  pressed && { opacity: 0.85 }
                ]}
                android_ripple={{ color: 'rgba(234, 88, 12, 0.15)', borderless: true }}
              >
                <View style={[styles.iconWrap, isFocused && styles.iconWrapFocused]}>
                  <Ionicons
                    name={isFocused ? tabConfig.icon : tabConfig.iconOutline}
                    size={19}
                    color={isFocused ? '#EA580C' : '#94A3B8'}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelFocused
                  ]}
                  numberOfLines={1}
                >
                  {tabConfig.label}
                </Text>
                {isFocused && <View style={styles.activeDot} />}
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <M2NTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="HotelsTab" component={HotelsStack} />
      <Tab.Screen name="DiningTab" component={DiningStack} />
      <Tab.Screen name="GalleryTab" component={GalleryStack} />
      <Tab.Screen name="WeddingsTab" component={WeddingsStack} />
      <Tab.Screen name="MoreTab" component={MoreStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingTabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 16 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        maxWidth: 440,
        marginHorizontal: 'auto'
      }
    })
  },
  floatingTabBar: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F172A', // M2N Luxury Obsidian Slate (matches footer & website theme)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 4,
    position: 'relative',
  },
  tabItemFocused: {
    backgroundColor: 'rgba(234, 88, 12, 0.14)', // Soft terracotta glow matching website
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapFocused: {
    transform: [{ scale: 1.08 }],
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    color: '#EA580C',
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EA580C',
    position: 'absolute',
    bottom: 3,
  }
});
