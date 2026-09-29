import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  Pressable,
  ImageBackground,
  Platform,
  Alert,
  Animated,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HotelCard from '../components/hotels/HotelCard';
import LuxuryMenuOverlay from '../components/common/LuxuryMenuOverlay';
import {
  brand,
  serviceTabs,
  trustPillars,
  exclusiveOffers,
  curatedExperiences,
  hotels
} from '../data/siteData';
import { COLORS } from '../theme/colors';

const DESTINATIONS = [
  { id: 'all', name: 'All Destinations', subtitle: 'Browse across 5 locations', icon: 'globe-outline' },
  { id: 'lucknow', name: 'Lucknow', subtitle: 'Flagship Hotel Zaarang', icon: 'business-outline' },
  { id: 'jaipur', name: 'Jaipur', subtitle: 'M2N Heritage Palace', icon: 'sparkles-outline' },
  { id: 'shimla', name: 'Shimla', subtitle: 'M2N Mountain Retreat', icon: 'snow-outline' },
  { id: 'udaipur', name: 'Udaipur', subtitle: 'M2N Royal Residency', icon: 'water-outline' },
  { id: 'goa', name: 'Goa', subtitle: 'M2N Coastal Haven Villa', icon: 'sunny-outline' }
];

const PROPERTY_FILTERS = ['All Stays', 'Heritage Palaces', 'Mountain Lodges', 'Beach Villas'];

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('stays');
  const [selectedLocation, setSelectedLocation] = useState('All Destinations');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Stays');
  const [showMenuOverlay, setShowMenuOverlay] = useState(false);
  const mainScrollViewRef = useRef(null);

  // Guests State
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const toastY = useRef(new Animated.Value(-80)).current;

  // Pulse & Tab Transition Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const heroSlideAnim = useRef(new Animated.Value(24)).current;
  const heroZoomAnim = useRef(new Animated.Value(1)).current;
  const searchFadeAnim = useRef(new Animated.Value(0)).current;
  const searchSlideAnim = useRef(new Animated.Value(30)).current;
  const offerBadgePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Initial Hero and Search Widget Entrance Animation
    Animated.parallel([
      Animated.timing(heroFadeAnim, {
        toValue: 1,
        duration: 850,
        useNativeDriver: true
      }),
      Animated.spring(heroSlideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.delay(180),
        Animated.parallel([
          Animated.timing(searchFadeAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true
          }),
          Animated.spring(searchSlideAnim, {
            toValue: 0,
            friction: 6,
            tension: 35,
            useNativeDriver: true
          })
        ])
      ])
    ]).start();

    // 2. Slow Luxury Ken Burns zoom loop on Hero background
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroZoomAnim, {
          toValue: 1.07,
          duration: 8000,
          useNativeDriver: true
        }),
        Animated.timing(heroZoomAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true
        })
      ])
    ).start();

    // 3. Subtle continuous breathing animation on Flagship badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 1300,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true
        })
      ])
    ).start();

    // 4. Subtle offer badge pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(offerBadgePulse, {
          toValue: 1.08,
          duration: 1400,
          useNativeDriver: true
        }),
        Animated.timing(offerBadgePulse, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [heroFadeAnim, heroSlideAnim, heroZoomAnim, searchFadeAnim, searchSlideAnim, pulseAnim, offerBadgePulse]);

  const showToast = (msg) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.spring(toastY, {
        toValue: 20,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.delay(2200),
      Animated.timing(toastY, {
        toValue: -80,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleTabChange = (tabId) => {
    Animated.sequence([
      Animated.timing(tabFadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(tabFadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
    ]).start();
    setActiveTab(tabId);

    if (tabId === 'dining') {
      navigation.navigate('DiningTab');
    } else if (tabId === 'experiences') {
      navigation.navigate('GalleryTab');
    } else if (tabId === 'weddings') {
      navigation.navigate('WeddingsTab');
    } else if (tabId === 'stays') {
      navigation.navigate('HotelsTab');
    }
  };

  // Filter hotels based on location, search query, and category
  const filteredHotels = hotels.filter((hotel) => {
    const matchLocation =
      selectedLocation === 'All Destinations' ||
      hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      hotel.name.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchSearch =
      !searchQuery ||
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'All Stays' ||
      (selectedCategory === 'Heritage Palaces' && hotel.name.includes('Heritage')) ||
      (selectedCategory === 'Mountain Lodges' && hotel.name.includes('Mountain')) ||
      (selectedCategory === 'Beach Villas' && (hotel.name.includes('Villa') || hotel.location.includes('Goa')));

    return matchLocation && matchSearch && matchCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Floating Animated Toast Banner */}
      <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastY }] }]}>
        <View style={styles.toastCard}>
          <Ionicons name="checkmark-circle" size={20} color="#EA580C" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      </Animated.View>

      {/* =================================================================== */}
      {/* TOP HEADER: M2N LOGO & ACTION SHORTCUTS                             */}
      {/* =================================================================== */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.logoContainer}
          onPress={() => navigation.navigate('HomeTab')}
          hitSlop={8}
        >
          <Image
            source={require('../../assets/m2n_logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.topActions}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: '#F1F5F9' }]}
            onPress={() => navigation.navigate('MoreTab')}
          >
            <Ionicons name="person-outline" size={20} color="#0F172A" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: '#F1F5F9' }]}
            onPress={() => setShowMenuOverlay(true)}
          >
            <Ionicons name="menu-outline" size={22} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      {/* Expandable Quick Search Bar */}
      {showSearchModal && (
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotel name, city (e.g. Lucknow, Jaipur)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      )}

      {/* =================================================================== */}
      {/* OFFICIAL SERVICE TABS (Stays, Dine-In, Experiences, Weddings)       */}
      {/* =================================================================== */}
      <View style={styles.serviceTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceTabsContent}
        >
          {serviceTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.serviceTab, isActive && styles.serviceTabActive]}
                onPress={() => handleTabChange(tab.id)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? '#EA580C' : '#64748B'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.serviceTabText, isActive && styles.serviceTabTextActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeTabIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        ref={mainScrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: tabFadeAnim }}>
          {/* =============================================================== */}
          {/* 1. HERO SECTION: ZAARANG GRAND PROPERTY & SEARCH WIDGET          */}
          {/* =============================================================== */}
          <View style={styles.heroContainer}>
            <View style={styles.heroImageWrapper}>
              <Animated.Image
                source={require('../../assets/zaarang_hero.jpg')}
                style={[
                  styles.heroImageBg,
                  {
                    transform: [{ scale: heroZoomAnim }]
                  }
                ]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.75)', 'rgba(15, 23, 42, 0.25)', 'rgba(15, 23, 42, 0.85)']}
                style={StyleSheet.absoluteFill}
              />

              <Animated.View
                style={[
                  styles.heroOverlayContent,
                  {
                    opacity: heroFadeAnim,
                    transform: [{ translateY: heroSlideAnim }]
                  }
                ]}
              >
                <Animated.View style={[styles.heroBadge, { transform: [{ scale: pulseAnim }] }]}>
                  <Ionicons name="sparkles" size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.heroBadgeText}>FLAGSHIP HOTEL</Text>
                </Animated.View>
                <Text style={styles.heroTitle}>ZAARANG</Text>
                <View style={styles.heroSubtitleRow}>
                  <Ionicons name="restaurant-outline" size={13} color="#FFEDD5" style={{ marginRight: 5 }} />
                  <Text style={styles.heroSubtitle}>BREAKFAST • LUNCH • DINNER</Text>
                </View>
              </Animated.View>
            </View>

            {/* Luxury Booking Search Widget with smooth float entrance */}
            <Animated.View
              style={[
                styles.searchCard,
                {
                  opacity: searchFadeAnim,
                  transform: [{ translateY: searchSlideAnim }]
                }
              ]}
            >
              {/* Location Row - Opens Interactive Destination Picker */}
              <Pressable
                style={({ pressed }) => [styles.searchRow, pressed && { opacity: 0.8 }]}
                onPress={() => setShowLocationPicker(true)}
              >
                <View style={styles.searchIconCol}>
                  <Ionicons name="location" size={20} color="#EA580C" />
                </View>
                <View style={styles.searchTextCol}>
                  <Text style={styles.searchLabel}>CITY, PROPERTY OR LOCATION</Text>
                  <Text style={styles.searchValue}>{selectedLocation}</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.searchDivider} />

              {/* Dates & Guests Grid */}
              <View style={styles.searchGrid}>
                <Pressable
                  style={({ pressed }) => [styles.searchGridCol, pressed && { opacity: 0.8 }]}
                  onPress={() => showToast('📅 Selected Dates: Tomorrow - Next 2 Nights')}
                >
                  <Text style={styles.searchLabel}>CHECK-IN & OUT</Text>
                  <View style={styles.gridValRow}>
                    <Ionicons name="calendar-outline" size={15} color="#EA580C" style={{ marginRight: 5 }} />
                    <Text style={styles.searchValueSmall}>Select Dates</Text>
                  </View>
                </Pressable>

                <View style={styles.gridDivider} />

                <Pressable
                  style={({ pressed }) => [styles.searchGridCol, pressed && { opacity: 0.8 }]}
                  onPress={() => setShowGuestsPicker(true)}
                >
                  <Text style={styles.searchLabel}>ROOMS & GUESTS</Text>
                  <View style={styles.gridValRow}>
                    <Ionicons name="people-outline" size={15} color="#EA580C" style={{ marginRight: 5 }} />
                    <Text style={styles.searchValueSmall}>
                      {rooms} Room, {adults} Adults
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Search Button (M2N Signature Orange) */}
              <Pressable
                style={({ pressed }) => [
                  styles.searchBtn,
                  pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 }
                ]}
                onPress={() => {
                  showToast(`Searching Stays in ${selectedLocation}...`);
                  navigation.navigate('HotelsTab');
                }}
              >
                <Ionicons name="search" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.searchBtnText}>SEARCH STAYS</Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* =============================================================== */}
          {/* SPECIAL TAB VIEWS: DINING / EXPERIENCES / WEDDINGS                */}
          {/* =============================================================== */}
          {activeTab === 'dining' && (
            <View style={styles.specialTabSection}>
              <View style={styles.specialCard}>
                <View style={styles.specialCardBadge}>
                  <Text style={styles.specialBadgeText}>ZAARANG RESTAURANT & BAR</Text>
                </View>
                <Text style={styles.specialCardTitle}>Royal Dining & Gourmet Buffet</Text>
                <Text style={styles.specialCardDesc}>
                  Experience authentic Awadhi delicacies, Mughlai feasts, and signature cocktails served in royal splendour.
                </Text>

                <View style={styles.timingGrid}>
                  <View style={styles.timingItem}>
                    <Text style={styles.timingTitle}>Breakfast</Text>
                    <Text style={styles.timingHours}>7:00 - 10:30 AM</Text>
                  </View>
                  <View style={styles.timingItem}>
                    <Text style={styles.timingTitle}>Lunch</Text>
                    <Text style={styles.timingHours}>12:30 - 3:30 PM</Text>
                  </View>
                  <View style={styles.timingItem}>
                    <Text style={styles.timingTitle}>Dinner</Text>
                    <Text style={styles.timingHours}>7:30 - 11:30 PM</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.specialActionBtn}
                  onPress={() => showToast('🍽️ Table reserved for 2 at Zaarang Restaurant!')}
                >
                  <Ionicons name="restaurant" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.specialActionBtnText}>Reserve Table Now</Text>
                </Pressable>
              </View>
            </View>
          )}

          {activeTab === 'weddings' && (
            <View style={styles.specialTabSection}>
              <View style={[styles.specialCard, { backgroundColor: '#1E1B4B' }]}>
                <View style={[styles.specialCardBadge, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.specialBadgeText}>DESTINATION WEDDINGS</Text>
                </View>
                <Text style={styles.specialCardTitle}>A Royal Celebration at M2N Palaces</Text>
                <Text style={styles.specialCardDesc}>
                  From grand wedding lawns to intimate banquets. Capacity for 1,500+ guests with royal catering and five-star suites.
                </Text>
                <Pressable
                  style={[styles.specialActionBtn, { backgroundColor: '#F59E0B' }]}
                  onPress={() => showToast('💍 Wedding enquiry received! Concierge will call shortly.')}
                >
                  <Ionicons name="heart" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.specialActionBtnText}>Enquire Wedding Dates</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* =============================================================== */}
          {/* 2. BRAND TRUST PILLARS (Screenshot 2)                           */}
          {/* =============================================================== */}
          <View style={styles.trustSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trustScroll}
            >
              {trustPillars.map((pillar) => (
                <Pressable
                  key={pillar.id}
                  style={({ pressed }) => [
                    styles.trustCard,
                    pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 }
                  ]}
                  onPress={() => showToast(`✨ ${pillar.title}: ${pillar.subtitle}`)}
                >
                  <View style={styles.trustIconCircle}>
                    <Ionicons name={pillar.icon} size={20} color="#D97706" />
                  </View>
                  <Text style={styles.trustTitle}>{pillar.title}</Text>
                  <Text style={styles.trustSubtitle}>{pillar.subtitle}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* =============================================================== */}
          {/* 3. FEATURED PROPERTIES (Screenshot 2)                            */}
          {/* =============================================================== */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Featured Properties</Text>
              <Text style={styles.sectionSubtitle}>Addresses proportioned to their landscape.</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.viewAllBtn, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate('HotelsTab')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color="#EA580C" />
            </Pressable>
          </View>

          {/* Interactive Property Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsScroll}
          >
            {PROPERTY_FILTERS.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    showToast(`Filtered: ${cat}`);
                  }}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {filteredHotels.length > 0 ? (
            filteredHotels.slice(0, 3).map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onPress={() => navigation.navigate('HotelDetail', { hotel })}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={36} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Hotels Found</Text>
              <Text style={styles.emptySubtitle}>Try changing your destination filter above.</Text>
            </View>
          )}

          {/* =============================================================== */}
          {/* 4. EXCLUSIVE OFFERS (Screenshot 3)                              */}
          {/* =============================================================== */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Exclusive Offers</Text>
              <Text style={styles.sectionSubtitle}>Handpicked packages & seasonal savings.</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScroll}
          >
            {exclusiveOffers.map((offer) => (
              <Pressable
                key={offer.id}
                style={({ pressed }) => [
                  styles.offerCard,
                  pressed && { transform: [{ scale: 0.98 }], opacity: 0.96 }
                ]}
                onPress={() => showToast(`🎉 Offer Applied: ${offer.title}!`)}
              >
                <Image source={{ uri: offer.image }} style={styles.offerImage} resizeMode="cover" />
                <Animated.View
                  style={[
                    styles.offerBadge,
                    { transform: [{ scale: offerBadgePulse }] }
                  ]}
                >
                  <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                </Animated.View>

                <View style={styles.offerInfo}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerProperty}>{offer.property}</Text>
                  <Text style={styles.offerDetails}>{offer.details}</Text>

                  <View style={styles.offerPriceRow}>
                    {offer.originalPrice && (
                      <Text style={styles.offerOriginalPrice}>{offer.originalPrice}</Text>
                    )}
                    <Text style={styles.offerFinalPrice}>
                      {offer.discountedPrice || offer.note}
                    </Text>
                  </View>

                  <View style={styles.claimCouponRow}>
                    <Text style={styles.claimCouponText}>Tap to Claim</Text>
                    <Ionicons name="arrow-forward-circle" size={16} color="#EA580C" />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* =============================================================== */}
          {/* 5. CURATED EXPERIENCES (Screenshot 4)                           */}
          {/* =============================================================== */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Curated Experiences</Text>
              <Text style={styles.sectionSubtitle}>Moments crafted with absolute precision.</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.expScroll}
          >
            {curatedExperiences.map((exp) => (
              <Pressable
                key={exp.id}
                style={({ pressed }) => [
                  styles.expCard,
                  pressed && { transform: [{ scale: 0.97 }] }
                ]}
                onPress={() => showToast(`✨ Selected Experience: ${exp.title}`)}
              >
                <Image source={{ uri: exp.image }} style={styles.expImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.expOverlay}>
                  <Text style={styles.expTag}>{exp.tag}</Text>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* =============================================================== */}
          {/* 6. M2N RESERVE BANNER (Screenshot 4)                             */}
          {/* =============================================================== */}
          <View style={styles.reserveBanner}>
            <View style={styles.reserveContent}>
              <Text style={styles.reservePre}>LOYALTY PRIVILEGES</Text>
              <Text style={styles.reserveTitle}>M2N Reserve</Text>
              <Text style={styles.reserveSubtitle}>
                Join our exclusive loyalty program. Earn reward points & complimentary upgrades on every stay.
              </Text>

              <Pressable
                style={({ pressed }) => [styles.reserveBtn, pressed && { opacity: 0.9 }]}
                onPress={() => showToast('⭐ You have 1,250 M2N Reserve Points available!')}
              >
                <Text style={styles.reserveBtnText}>Explore Benefits</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* =================================================================== */}
      {/* INTERACTIVE MODAL: DESTINATION SELECTOR SHEET                       */}
      {/* =================================================================== */}
      <Modal
        visible={showLocationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLocationPicker(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Destination</Text>
            <Text style={styles.modalSubtitle}>Explore luxury stays across India</Text>

            {DESTINATIONS.map((dest) => {
              const isSelected = selectedLocation === dest.name;
              return (
                <Pressable
                  key={dest.id}
                  style={[styles.destItem, isSelected && styles.destItemActive]}
                  onPress={() => {
                    setSelectedLocation(dest.name);
                    setShowLocationPicker(false);
                    showToast(`📍 Selected: ${dest.name}`);
                  }}
                >
                  <View style={[styles.destIconWrap, isSelected && styles.destIconWrapActive]}>
                    <Ionicons
                      name={dest.icon}
                      size={20}
                      color={isSelected ? '#EA580C' : '#64748B'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.destName, isSelected && styles.destNameActive]}>
                      {dest.name}
                    </Text>
                    <Text style={styles.destSub}>{dest.subtitle}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color="#EA580C" />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* =================================================================== */}
      {/* INTERACTIVE MODAL: ROOMS & GUESTS STEPPER                           */}
      {/* =================================================================== */}
      <Modal
        visible={showGuestsPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuestsPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGuestsPicker(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Rooms & Guests</Text>
            <Text style={styles.modalSubtitle}>Customize your occupancy requirements</Text>

            {/* Adults Counter */}
            <View style={styles.stepperRow}>
              <View>
                <Text style={styles.stepperLabel}>Adults</Text>
                <Text style={styles.stepperSub}>Age 13 years and above</Text>
              </View>
              <View style={styles.counterGroup}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => adults > 1 && setAdults(adults - 1)}
                >
                  <Ionicons name="remove" size={18} color="#0F172A" />
                </Pressable>
                <Text style={styles.counterVal}>{adults}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setAdults(adults + 1)}
                >
                  <Ionicons name="add" size={18} color="#0F172A" />
                </Pressable>
              </View>
            </View>

            {/* Rooms Counter */}
            <View style={styles.stepperRow}>
              <View>
                <Text style={styles.stepperLabel}>Rooms</Text>
                <Text style={styles.stepperSub}>Number of suites requested</Text>
              </View>
              <View style={styles.counterGroup}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => rooms > 1 && setRooms(rooms - 1)}
                >
                  <Ionicons name="remove" size={18} color="#0F172A" />
                </Pressable>
                <Text style={styles.counterVal}>{rooms}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setRooms(rooms + 1)}
                >
                  <Ionicons name="add" size={18} color="#0F172A" />
                </Pressable>
              </View>
            </View>

            {/* Children Counter */}
            <View style={styles.stepperRow}>
              <View>
                <Text style={styles.stepperLabel}>Children</Text>
                <Text style={styles.stepperSub}>Ages 0 to 12 years</Text>
              </View>
              <View style={styles.counterGroup}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => children > 0 && setChildren(children - 1)}
                >
                  <Ionicons name="remove" size={18} color="#0F172A" />
                </Pressable>
                <Text style={styles.counterVal}>{children}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setChildren(children + 1)}
                >
                  <Ionicons name="add" size={18} color="#0F172A" />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.confirmGuestsBtn}
              onPress={() => {
                setShowGuestsPicker(false);
                showToast(`Occupancy: ${rooms} Room, ${adults} Adults updated!`);
              }}
            >
              <Text style={styles.confirmGuestsBtnText}>Apply Selection</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Luxury Full-Screen Menu Overlay matching m2nhotels.com */}
      <LuxuryMenuOverlay
        visible={showMenuOverlay}
        onClose={() => setShowMenuOverlay(false)}
        navigation={navigation}
        onSelectSpecial={(type) => {
          if (type === 'spa') {
            showToast('🌿 M2N Ayurvedic Spa & Wellness: Bespoke treatments available.');
          } else if (type === 'offers') {
            showToast('🏷️ Exclusive Offers: 25% Early Bird discount active.');
          } else if (type === 'journal') {
            showToast('📖 M2N Heritage Journal: Stories of Awadh & Rajputana.');
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        maxWidth: 480,
        marginHorizontal: 'auto',
        minHeight: '100vh'
      }
    })
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    paddingBottom: 110
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: 'center'
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.4)'
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    width: 84,
    height: 47
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  menuPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  menuPillBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A'
  },
  serviceTabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  serviceTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  serviceTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    position: 'relative'
  },
  serviceTabActive: {
    backgroundColor: '#FFF7ED'
  },
  serviceTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  serviceTabTextActive: {
    color: '#EA580C',
    fontWeight: '800'
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 14,
    right: 14,
    height: 2.5,
    backgroundColor: '#EA580C',
    borderRadius: 2
  },
  heroContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24
  },
  heroImageWrapper: {
    height: 270,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-start',
    paddingTop: 24,
    paddingHorizontal: 20
  },
  heroImageBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  heroOverlayContent: {
    zIndex: 10,
    maxWidth: '92%'
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EA580C',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  heroSubtitle: {
    color: '#FFEDD5',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginTop: -36,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIconCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  searchTextCol: {
    flex: 1
  },
  searchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  searchValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  searchDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  searchGrid: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchGridCol: {
    flex: 1
  },
  gridValRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchValueSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  gridDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 12
  },
  searchBtn: {
    marginTop: 16,
    backgroundColor: '#EA580C',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1
  },
  specialTabSection: {
    marginHorizontal: 16,
    marginBottom: 20
  },
  specialCard: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  specialCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10
  },
  specialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  specialCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6
  },
  specialCardDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16
  },
  timingGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  timingItem: {
    alignItems: 'center'
  },
  timingTitle: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2
  },
  timingHours: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  specialActionBtn: {
    backgroundColor: '#EA580C',
    borderRadius: 14,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  specialActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800'
  },
  trustSection: {
    marginBottom: 26
  },
  trustScroll: {
    paddingHorizontal: 16,
    gap: 12
  },
  trustCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    textAlign: 'center'
  },
  trustIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  trustSubtitle: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C'
  },
  categoryChipsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryChipActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475467'
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4
  },
  offersScroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16
  },
  offerCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  offerImage: {
    width: '100%',
    height: 125
  },
  offerBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  offerInfo: {
    padding: 12
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2
  },
  offerProperty: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4
  },
  offerDetails: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 8
  },
  offerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6
  },
  offerOriginalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through'
  },
  offerFinalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA580C'
  },
  claimCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  claimCouponText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#EA580C'
  },
  expScroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12
  },
  expCard: {
    width: 170,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative'
  },
  expImage: {
    width: '100%',
    height: '100%'
  },
  expOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10
  },
  expTag: {
    color: '#F59E0B',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  expTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  reserveBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  reserveContent: {
    padding: 24
  },
  reservePre: {
    color: '#F59E0B',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6
  },
  reserveTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8
  },
  reserveSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16
  },
  reserveBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6
  },
  reserveBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  footerContainer: {
    backgroundColor: '#0A0A0A',
    padding: 24,
    marginTop: 10
  },
  footerLogo: {
    width: 130,
    height: 44,
    marginBottom: 8
  },
  footerTagline: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  footerStory: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16
  },
  footerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  footerContactText: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '600'
  },
  footerCopyright: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 16,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 40,
    maxHeight: '80%'
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16
  },
  destItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  destItemActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C'
  },
  destIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  destIconWrapActive: {
    backgroundColor: '#FFEDD5'
  },
  destName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  destNameActive: {
    color: '#EA580C',
    fontWeight: '800'
  },
  destSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  stepperLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  stepperSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center'
  },
  confirmGuestsBtn: {
    marginTop: 24,
    backgroundColor: '#EA580C',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmGuestsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
