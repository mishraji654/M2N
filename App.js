import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import PaymentScreen from './src/screens/PaymentScreen';
import OffersScreen from './src/screens/OffersScreen';
import SpaWellnessScreen from './src/screens/SpaWellnessScreen';
import MyTripsScreen from './src/screens/MyTripsScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import GiftCardScreen from './src/screens/GiftCardScreen';
import AiAssistantModal from './src/components/common/AiAssistantModal';
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
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="SpaWellness" component={SpaWellnessScreen} />
      <Stack.Screen name="Rooms" component={RoomsScreen} />
      <Stack.Screen name="Dining" component={RestaurantScreen} />
      <Stack.Screen name="Weddings" component={WeddingsScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

function TripsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Trips" component={MyTripsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

function GiftCardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GiftCard" component={GiftCardScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
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
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="SpaWellness" component={SpaWellnessScreen} />
      <Stack.Screen name="Rooms" component={RoomsScreen} />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

function DiningStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dining" component={RestaurantScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

function WeddingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Weddings" component={WeddingsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={AboutScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="SpaWellness" component={SpaWellnessScreen} />
      <Stack.Screen name="Rooms" component={RoomsScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

// Custom Luxury M2N Bottom Navigation Bar matching MakeMyTrip layout:
// [Home] [My Trip] [Animated AI Button] [Wishlist (NEW)] [Gift Card]
function M2NTabBar({ state, descriptors, navigation, onOpenAi }) {
  // Hide bottom tab bar on Payment and Booking screens so it never overlaps checkout UI
  const currentTab = state?.routes ? state.routes[state.index] : null;
  const getDeepestRouteName = (route) => {
    if (!route || !route.state) return route?.name;
    const subRoute = route.state.routes[route.state.index];
    return getDeepestRouteName(subRoute);
  };
  const activeRouteName = getDeepestRouteName(currentTab);
  if (activeRouteName === 'Payment' || activeRouteName === 'Booking') {
    return null;
  }

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const visibleTabs = [
    { name: 'HomeTab', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'TripsTab', label: 'My Trip', icon: 'briefcase', iconOutline: 'briefcase-outline' },
    { name: 'AiAction', label: 'Ask AI', isAi: true },
    { name: 'WishlistTab', label: 'Wishlist', icon: 'bookmark', iconOutline: 'bookmark-outline', hasBadge: true, badgeText: 'NEW' },
    { name: 'GiftCardTab', label: 'Gift Card', icon: 'gift', iconOutline: 'gift-outline' },
  ];

  return (
    <View style={styles.floatingTabBarWrapper} pointerEvents="box-none">
      <View style={styles.floatingTabBar}>
        {visibleTabs.map((tabConfig) => {
          if (tabConfig.isAi) {
            return (
              <Pressable
                key="ai-center-button"
                onPress={onOpenAi}
                style={styles.aiTabItem}
                hitSlop={8}
              >
                <Animated.View style={[styles.aiFloatingCircle, { transform: [{ scale: pulseAnim }] }]}>
                  <LinearGradient
                    colors={['#EA580C', '#C2410C']}
                    style={styles.aiCircleGradient}
                  >
                    <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.aiTabLabel}>Ask AI</Text>
              </Pressable>
            );
          }

          const routeIndex = state.routes.findIndex((r) => r.name === tabConfig.name);
          const isFocused = routeIndex !== -1 && state.index === routeIndex;

          const onPress = () => {
            if (routeIndex !== -1) {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[routeIndex].key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tabConfig.name);
              }
            }
          };

          return (
            <Pressable
              key={tabConfig.name}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemFocused]}
              hitSlop={6}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapFocused]}>
                <Ionicons
                  name={isFocused ? tabConfig.icon : tabConfig.iconOutline}
                  size={19}
                  color={isFocused ? '#EA580C' : '#94A3B8'}
                />
                {tabConfig.hasBadge && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tabConfig.badgeText}</Text>
                  </View>
                )}
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

function MainTabs({ navigation }) {
  const [showGlobalAi, setShowGlobalAi] = useState(false);

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <M2NTabBar
            {...props}
            onOpenAi={() => setShowGlobalAi(true)}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        {/* The 4 active visible tabs */}
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="TripsTab" component={TripsStack} />
        <Tab.Screen name="WishlistTab" component={WishlistStack} />
        <Tab.Screen name="GiftCardTab" component={GiftCardStack} />

        {/* Supporting tabs registered for deep navigation */}
        <Tab.Screen name="HotelsTab" component={HotelsStack} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="DiningTab" component={DiningStack} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="GalleryTab" component={GalleryStack} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="WeddingsTab" component={WeddingsStack} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="MoreTab" component={MoreStack} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>

      {/* Global Interactive AI Assistant Modal */}
      <AiAssistantModal
        visible={showGlobalAi}
        onClose={() => setShowGlobalAi(false)}
        navigation={navigation}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
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
    paddingHorizontal: 16,
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
    backgroundColor: '#0F172A', // M2N Luxury Obsidian Slate
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
    backgroundColor: 'rgba(234, 88, 12, 0.14)',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative'
  },
  iconWrapFocused: {
    transform: [{ scale: 1.08 }],
  },
  tabBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#EA580C',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#0F172A'
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  tabLabel: {
    fontSize: 10,
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
  },
  aiTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -10
  },
  aiFloatingCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiCircleGradient: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A'
  },
  aiTabLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EA580C',
    marginTop: 2,
    letterSpacing: 0.2
  }
});
