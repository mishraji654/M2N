import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HotelCard from '../components/hotels/HotelCard';
import LuxuryMenuOverlay from '../components/common/LuxuryMenuOverlay';
import AiAssistantModal from '../components/common/AiAssistantModal';
import {
  brand,
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
const OFFER_TABS = ['Trending', 'Hotels', 'Flights', 'Holidays'];

const TOP_NAV_TABS = [
  { id: 'home', label: 'Home', icon: 'home', route: 'Home' },
  { id: 'hotel', label: 'Hotel', icon: 'business', route: 'HotelsTab' },
  { id: 'rooms', label: 'Rooms', icon: 'bed', route: 'Rooms' },
  { id: 'gallery', label: 'Gallery', icon: 'images', route: 'Gallery' },
  { id: 'offers', label: 'Offers', icon: 'pricetag', route: 'Offers' },
  { id: 'spa', label: 'Spa & Wellness', icon: 'leaf', route: 'SpaWellness' }
];

export default function HomeScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState('All Destinations');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Stays');
  const [activeOfferTab, setActiveOfferTab] = useState('Trending');
  const [showMenuOverlay, setShowMenuOverlay] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(true);

  // Guests State
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Filter Hotels based on Search & Category
  const filteredHotels = hotels.filter((hotel) => {
    const matchLocation =
      selectedLocation === 'All Destinations' ||
      hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      hotel.name.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchSearch =
      searchQuery.trim() === '' ||
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'All Stays' ||
      (selectedCategory === 'Heritage Palaces' && (hotel.name.includes('Palace') || hotel.name.includes('Heritage'))) ||
      (selectedCategory === 'Mountain Lodges' && hotel.name.includes('Mountain')) ||
      (selectedCategory === 'Beach Villas' && (hotel.name.includes('Villa') || hotel.location.includes('Goa')));

    return matchLocation && matchSearch && matchCategory;
  });

  // Filter Offers based on active tab
  const displayOffers = exclusiveOffers.filter((o) => {
    if (activeOfferTab === 'Trending') return true;
    if (activeOfferTab === 'Hotels') return o.title.toLowerCase().includes('stay') || o.title.toLowerCase().includes('night') || o.title.toLowerCase().includes('palace');
    if (activeOfferTab === 'Flights') return o.title.toLowerCase().includes('weekend') || o.title.toLowerCase().includes('flight') || o.title.toLowerCase().includes('retreat');
    if (activeOfferTab === 'Holidays') return o.title.toLowerCase().includes('escape') || o.title.toLowerCase().includes('package') || o.title.toLowerCase().includes('holiday');
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* =================================================================== */}
      {/* 1. MAKEMYTRIP NAVBAR: MENU (LEFT), EMPTY CENTER, CASH/BIZ (RIGHT)   */}
      {/* =================================================================== */}
      <View style={styles.topBar}>
        {/* Left: Hamburger Menu with Red Dot Badge */}
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && { opacity: 0.7 }]}
          onPress={() => setShowMenuOverlay(true)}
          hitSlop={12}
        >
          <View style={styles.hamburgerContainer}>
            <View style={styles.hamburgerLineLong} />
            <View style={styles.hamburgerLineMid} />
            <View style={styles.hamburgerLineLong} />
            <View style={styles.hamburgerRedDot} />
          </View>
        </Pressable>

        {/* Center: Clean whitespace, NO logo */}
        <View style={styles.navbarSpacer} />

        {/* Right: myCash & myBiz Badges */}
        <View style={styles.topRightActions}>
          <Pressable
            style={({ pressed }) => [styles.cashPill, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('MoreTab')}
          >
            <Text style={styles.cashPillPrefix}>my</Text>
            <Text style={styles.cashPillTitle}>Cash</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.bizBadge, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.navigate('MoreTab')}
          >
            <Text style={styles.bizBadgePrefix}>my</Text>
            <Text style={styles.bizBadgeTitle}>Biz</Text>
          </Pressable>
        </View>
      </View>

      {/* =================================================================== */}
      {/* 2. MAKEMYTRIP PILL-SHAPED SMART SEARCH BAR                           */}
      {/* =================================================================== */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchPill}>
          <Ionicons name="sparkles" size={17} color="#EA580C" style={styles.searchSparkleIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Myra about 'Things to do in Jaipur'..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10} style={{ marginRight: 6 }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}

          {/* Right Action Pill: Speak / Ask AI */}
          <Pressable
            style={styles.searchActionPill}
            onPress={() => setShowAiModal(true)}
          >
            <View style={styles.speakSoundwaves}>
              <View style={[styles.soundwaveBar, { height: 7 }]} />
              <View style={[styles.soundwaveBar, { height: 12 }]} />
              <View style={[styles.soundwaveBar, { height: 9 }]} />
            </View>
            <Text style={styles.searchActionText}>Speak</Text>
          </Pressable>
        </View>
      </View>

      {/* =================================================================== */}
      {/* 2B. TOP HORIZONTAL NAVIGATION BAR (Home, Hotel, Rooms, Gallery, Offers, Spa) */}
      {/* =================================================================== */}
      <View style={styles.topNavBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topNavBarScroll}
        >
          {TOP_NAV_TABS.map((tab) => {
            const isActive = tab.id === 'home';
            return (
              <Pressable
                key={tab.id}
                style={[styles.topNavTabItem, isActive && styles.topNavTabItemActive]}
                onPress={() => {
                  if (tab.route === 'Home') return;
                  navigation.navigate(tab.route);
                }}
              >
                <Ionicons
                  name={tab.icon}
                  size={15}
                  color={isActive ? '#EA580C' : '#64748B'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.topNavTabText, isActive && styles.topNavTabTextActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.topNavActiveIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================= */}
        {/* 3. PRIMARY 3 ACTION CARDS (Flights, Hotels, Holiday Packages)     */}
        {/* ================================================================= */}
        <View style={styles.primaryCardsRow}>
          {/* 1. Flights */}
          <Pressable
            style={({ pressed }) => [styles.primaryCard, pressed && styles.primaryCardPressed]}
            onPress={() => navigation.navigate('HotelsTab')}
          >
            <View style={styles.primaryGraphicWrap}>
              <MaterialCommunityIcons
                name="airplane-takeoff"
                size={34}
                color="#EA580C"
                style={{ transform: [{ rotate: '-8deg' }] }}
              />
            </View>
            <Text style={styles.primaryCardTitle}>Flights</Text>
          </Pressable>

          {/* 2. Hotels */}
          <Pressable
            style={({ pressed }) => [styles.primaryCard, pressed && styles.primaryCardPressed]}
            onPress={() => navigation.navigate('HotelsTab')}
          >
            <View style={styles.primaryGraphicWrap}>
              <View style={styles.hotelGraphicBox}>
                <MaterialCommunityIcons name="office-building" size={34} color="#EA580C" />
                <MaterialCommunityIcons name="office-building" size={24} color="#EA580C" style={[styles.hotelSecondaryTower, { opacity: 0.75 }]} />
              </View>
            </View>
            <Text style={styles.primaryCardTitle}>Hotels</Text>
          </Pressable>

          {/* 3. Holiday Packages */}
          <Pressable
            style={({ pressed }) => [styles.primaryCard, pressed && styles.primaryCardPressed]}
            onPress={() => navigation.navigate('GalleryTab')}
          >
            <View style={styles.primaryGraphicWrap}>
              <View style={styles.holidayGraphicBox}>
                <Ionicons name="sunny" size={13} color="#EA580C" style={styles.umbrellaSun} />
                <MaterialCommunityIcons name="umbrella-beach" size={34} color="#EA580C" />
              </View>
            </View>
            <Text style={styles.primaryCardTitle}>Holiday{'\n'}Packages</Text>
          </Pressable>
        </View>

        {/* ================================================================= */}
        {/* 4. SUB-SERVICES WHITE CARD (4x2 Grid with Chevron Toggle)          */}
        {/* ================================================================= */}
        <View style={styles.subServicesCard}>
          <View style={styles.subServicesGrid}>
            {/* 1. Stays */}
            <Pressable
              style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
              onPress={() => navigation.navigate('HotelsTab')}
            >
              <View style={styles.subGraphicWrap}>
                <MaterialCommunityIcons name="bed-king" size={28} color="#EA580C" />
                <Ionicons name="sparkles" size={10} color="#EA580C" style={styles.subServiceBadge} />
              </View>
              <Text style={styles.subServiceTitle}>Stays</Text>
            </Pressable>

            {/* 2. Dining */}
            <Pressable
              style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
              onPress={() => navigation.navigate('Dining')}
            >
              <View style={styles.subGraphicWrap}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={28} color="#EA580C" />
                <Ionicons name="restaurant" size={10} color="#EA580C" style={styles.subServiceBadge} />
              </View>
              <Text style={styles.subServiceTitle}>Dining</Text>
            </Pressable>

            {/* 3. Experiences */}
            <Pressable
              style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
              onPress={() => navigation.navigate('Gallery')}
            >
              <View style={styles.subGraphicWrap}>
                <Ionicons name="sparkles" size={26} color="#EA580C" />
                <Ionicons name="star" size={10} color="#EA580C" style={styles.subServiceBadge} />
              </View>
              <Text style={styles.subServiceTitle}>Experiences</Text>
            </Pressable>

            {/* 4. Weddings */}
            <Pressable
              style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
              onPress={() => navigation.navigate('Weddings')}
            >
              <View style={styles.subGraphicWrap}>
                <MaterialCommunityIcons name="crown" size={28} color="#EA580C" />
                <Ionicons name="heart" size={10} color="#EA580C" style={styles.subServiceBadge} />
              </View>
              <Text style={styles.subServiceTitle}>Weddings</Text>
            </Pressable>

            {servicesExpanded && (
              <>
                {/* 5. Rooms & Suites */}
                <Pressable
                  style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
                  onPress={() => navigation.navigate('Rooms')}
                >
                  <View style={styles.subGraphicWrap}>
                    <MaterialCommunityIcons name="bed" size={28} color="#EA580C" />
                    <Ionicons name="star" size={10} color="#EA580C" style={styles.subServiceBadge} />
                  </View>
                  <Text style={styles.subServiceTitle}>Rooms{'\n'}& Suites</Text>
                </Pressable>

                {/* 6. Spa & Wellness */}
                <Pressable
                  style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
                  onPress={() => navigation.navigate('SpaWellness')}
                >
                  <View style={styles.subGraphicWrap}>
                    <Ionicons name="leaf" size={26} color="#EA580C" />
                    <Ionicons name="sparkles" size={10} color="#EA580C" style={styles.subServiceBadge} />
                  </View>
                  <Text style={styles.subServiceTitle}>Spa &{'\n'}Wellness</Text>
                </Pressable>

                {/* 7. Offers & Deals */}
                <Pressable
                  style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
                  onPress={() => navigation.navigate('Offers')}
                >
                  <View style={styles.subGraphicWrap}>
                    <Ionicons name="pricetag" size={26} color="#EA580C" />
                    <Ionicons name="flash" size={10} color="#EA580C" style={styles.subServiceBadge} />
                  </View>
                  <Text style={styles.subServiceTitle}>Offers &{'\n'}Deals</Text>
                </Pressable>

                {/* 8. Airport & Cabs */}
                <Pressable
                  style={({ pressed }) => [styles.subServiceItem, pressed && { opacity: 0.65 }]}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <View style={styles.subGraphicWrap}>
                    <MaterialCommunityIcons name="taxi" size={28} color="#EA580C" />
                    <Ionicons name="airplane" size={11} color="#EA580C" style={styles.subServiceBadge} />
                  </View>
                  <Text style={styles.subServiceTitle}>Airport{'\n'}& Cabs</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Bottom Chevron Toggle */}
          <Pressable
            style={styles.expandChevron}
            onPress={() => setServicesExpanded(!servicesExpanded)}
            hitSlop={12}
          >
            <Ionicons
              name={servicesExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#EA580C"
            />
          </Pressable>
        </View>

        {/* ================================================================= */}
        {/* 5. LOCATION & GUESTS QUICK BAR (Interactive booking bar)           */}
        {/* ================================================================= */}
        <View style={styles.quickBarCard}>
          <Pressable
            style={styles.quickBarCol}
            onPress={() => setShowLocationPicker(true)}
          >
            <Text style={styles.quickBarLabel}>DESTINATION</Text>
            <View style={styles.quickBarValRow}>
              <Ionicons name="location" size={15} color="#EA580C" style={{ marginRight: 4 }} />
              <Text style={styles.quickBarVal} numberOfLines={1}>{selectedLocation}</Text>
            </View>
          </Pressable>

          <View style={styles.quickBarDivider} />

          <Pressable
            style={styles.quickBarCol}
            onPress={() => setShowGuestsPicker(true)}
          >
            <Text style={styles.quickBarLabel}>OCCUPANCY</Text>
            <View style={styles.quickBarValRow}>
              <Ionicons name="people" size={15} color="#EA580C" style={{ marginRight: 4 }} />
              <Text style={styles.quickBarVal}>{rooms} Room, {adults} Adults</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.quickSearchBtn}
            onPress={() => navigation.navigate('HotelsTab')}
          >
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* ================================================================= */}
        {/* 6. OFFERS SECTION (MakeMyTrip signature styling)                   */}
        {/* ================================================================= */}
        <View style={styles.offersSection}>
          <View style={styles.offersHeaderRow}>
            <Text style={styles.offersTitle}>Offers</Text>
            <Pressable
              style={styles.viewAllRow}
              onPress={() => navigation.navigate('Offers')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward-circle" size={18} color="#EA580C" />
            </Pressable>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offerPillsScroll}
          >
            {OFFER_TABS.map((tab) => {
              const isSelected = activeOfferTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.offerPill, isSelected && styles.offerPillActive]}
                  onPress={() => setActiveOfferTab(tab)}
                >
                  <Text style={[styles.offerPillText, isSelected && styles.offerPillTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Horizontal Carousel of Offers */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersCarousel}
          >
            {displayOffers.map((offer) => (
              <Pressable
                key={offer.id}
                style={({ pressed }) => [
                  styles.mmtOfferCard,
                  pressed && { transform: [{ scale: 0.98 }] }
                ]}
                onPress={() => navigation.navigate('Offers')}
              >
                <ImageBackground
                  source={{ uri: offer.image }}
                  style={styles.mmtOfferBg}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.88)']}
                    locations={[0, 1]}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Top Badge */}
                  <View style={styles.offerBadgeTop}>
                    <Text style={styles.offerBadgeTopText}>{offer.badge || 'OFFERS'}</Text>
                  </View>

                  {/* Content Sheet */}
                  <View style={styles.mmtOfferContent}>
                    <Text style={styles.mmtOfferTitle} numberOfLines={2}>
                      {offer.title}
                    </Text>
                    <Text style={styles.mmtOfferSub} numberOfLines={1}>
                      {offer.property} • {offer.discountedPrice || offer.note}
                    </Text>

                    <View style={styles.mmtOfferFooter}>
                      <View style={styles.couponTag}>
                        <Text style={styles.couponTagText}>CODE: M2NROYAL</Text>
                      </View>
                      <View style={styles.claimBtn}>
                        <Text style={styles.claimBtnText}>Book Now</Text>
                        <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ================================================================= */}
        {/* 7. FEATURED PROPERTIES (Filterable by Category & Search)          */}
        {/* ================================================================= */}
        <View style={styles.propertiesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Featured Properties</Text>
              <Text style={styles.sectionSubtitle}>Iconic addresses crafted for luxury stays.</Text>
            </View>
            <Pressable
              style={styles.viewAllRow}
              onPress={() => navigation.navigate('HotelsTab')}
            >
              <Text style={styles.viewAllPropertiesText}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color="#EA580C" />
            </Pressable>
          </View>

          {/* Category Chips */}
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
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Hotel Cards List */}
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
              <Text style={styles.emptySubtitle}>Try changing your destination or search keyword.</Text>
            </View>
          )}
        </View>

        {/* ================================================================= */}
        {/* 8. EXPLORE DESTINATIONS                                           */}
        {/* ================================================================= */}
        <View style={styles.destinationsSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Explore by Destination</Text>
              <Text style={styles.sectionSubtitle}>From heritage heartlands to coastal escapes.</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destScroll}
          >
            {DESTINATIONS.filter((d) => d.id !== 'all').map((dest) => (
              <Pressable
                key={dest.id}
                style={({ pressed }) => [styles.destCard, pressed && { transform: [{ scale: 0.97 }] }]}
                onPress={() => {
                  setSelectedLocation(dest.name);
                  navigation.navigate('HotelsTab');
                }}
              >
                <View style={styles.destIconBox}>
                  <Ionicons name={dest.icon} size={22} color="#EA580C" />
                </View>
                <Text style={styles.destCardTitle}>{dest.name}</Text>
                <Text style={styles.destCardSub}>{dest.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ================================================================= */}
        {/* 9. M2N TRUST PILLARS                                              */}
        {/* ================================================================= */}
        <View style={styles.trustSection}>
          <View style={styles.trustCardContainer}>
            {trustPillars.map((pillar) => (
              <View key={pillar.id} style={styles.trustItem}>
                <View style={styles.trustIconCircle}>
                  <Ionicons name={pillar.icon} size={20} color="#EA580C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trustTitle}>{pillar.title}</Text>
                  <Text style={styles.trustSubtitle}>{pillar.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ================================================================= */}
        {/* 10. M2N LOYALTY CLUB BANNER                                       */}
        {/* ================================================================= */}
        <View style={styles.loyaltyBanner}>
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            style={styles.loyaltyGradient}
          >
            <View style={styles.loyaltyHeader}>
              <View style={styles.loyaltyBadge}>
                <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text style={styles.loyaltyBadgeText}>M2N PRIVILEGE</Text>
              </View>
              <Text style={styles.loyaltyTitle}>Join M2N Reserve Club</Text>
              <Text style={styles.loyaltyDesc}>
                Earn reward points, get complimentary suite upgrades, and access curated VIP dining discounts.
              </Text>
            </View>

            <Pressable
              style={styles.loyaltyBtn}
              onPress={() => navigation.navigate('MoreTab')}
            >
              <Text style={styles.loyaltyBtnText}>Explore Member Privileges</Text>
              <Ionicons name="arrow-forward" size={15} color="#0F172A" />
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* =================================================================== */}
      {/* DESTINATION PICKER MODAL SHEET                                      */}
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
      {/* ROOMS & GUESTS STEPPER MODAL SHEET                                  */}
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
              onPress={() => setShowGuestsPicker(false)}
            >
              <Text style={styles.confirmGuestsBtnText}>Apply Selection</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Luxury Full-Screen Menu Overlay */}
      <LuxuryMenuOverlay
        visible={showMenuOverlay}
        onClose={() => setShowMenuOverlay(false)}
        navigation={navigation}
      />

      {/* Interactive AI Concierge (Ask Myra) */}
      <AiAssistantModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        navigation={navigation}
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
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    paddingBottom: 110
  },

  /* 1. TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  menuButton: {
    padding: 6
  },
  hamburgerContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
    position: 'relative'
  },
  hamburgerLineLong: {
    width: 22,
    height: 2.8,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  hamburgerLineMid: {
    width: 15,
    height: 2.8,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  hamburgerRedDot: {
    position: 'absolute',
    top: -3,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#EA580C'
  },
  navbarSpacer: {
    flex: 1
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cashPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  cashPillPrefix: {
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  cashPillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  bizBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6
  },
  bizBadgePrefix: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FFFFFF'
  },
  bizBadgeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 2
  },

  /* 2. SMART SEARCH PILL */
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    paddingRight: 6
  },
  searchSparkleIcon: {
    marginLeft: 14,
    marginRight: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 8
  },
  searchActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    gap: 5
  },
  speakSoundwaves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5
  },
  soundwaveBar: {
    width: 2,
    backgroundColor: '#EA580C',
    borderRadius: 1
  },
  searchActionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#EA580C'
  },

  /* 3. PRIMARY 4 ACTION CARDS */
  primaryCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8
  },
  primaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    minHeight: 104
  },
  primaryCardPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#F8FAFC'
  },
  primaryGraphicWrap: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  hotelGraphicBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  hotelSecondaryTower: {
    marginLeft: -10,
    marginBottom: 0
  },
  holidayGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  umbrellaSun: {
    position: 'absolute',
    top: -4,
    right: -2
  },
  primaryCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 16
  },

  /* 4. SUB-SERVICES WHITE CARD */
  subServicesCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingTop: 18,
    paddingBottom: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16
  },
  subServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  subServiceItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2
  },
  subGraphicWrap: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative'
  },
  subServiceBadge: {
    position: 'absolute',
    top: -2,
    right: 2
  },
  newPillBadge: {
    position: 'absolute',
    top: -5,
    right: -4,
    backgroundColor: '#EA580C',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1
  },
  newPillText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  subServiceTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14.5
  },
  expandChevron: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24
  },

  /* 5. QUICK BAR CARD */
  quickBarCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20
  },
  quickBarCol: {
    flex: 1
  },
  quickBarLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  quickBarValRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quickBarVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A'
  },
  quickBarDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12
  },
  quickSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },

  /* 6. OFFERS SECTION */
  offersSection: {
    marginBottom: 24
  },
  offersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  offersTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  viewAllText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#EA580C'
  },
  viewAllPropertiesText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#EA580C'
  },
  offerPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14
  },
  offerPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  offerPillActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  offerPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475467'
  },
  offerPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  offersCarousel: {
    paddingHorizontal: 16,
    gap: 14
  },
  mmtOfferCard: {
    width: 290,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  mmtOfferBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 12
  },
  offerBadgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3.5
  },
  offerBadgeTopText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8
  },
  mmtOfferContent: {
    width: '100%'
  },
  mmtOfferTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  mmtOfferSub: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8
  },
  mmtOfferFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  couponTag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  couponTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 2
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  /* 7. PROPERTIES SECTION */
  propertiesSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2
  },
  categoryChipsScroll: {
    gap: 8,
    paddingBottom: 12
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA'
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  categoryChipTextActive: {
    color: '#EA580C',
    fontWeight: '700'
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2
  },

  /* 8. DESTINATIONS SECTION */
  destinationsSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  destScroll: {
    gap: 12
  },
  destCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1
  },
  destIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  destCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  destCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },

  /* 9. TRUST PILLARS */
  trustSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  trustCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  trustIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center'
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  trustSubtitle: {
    fontSize: 11.5,
    color: '#64748B'
  },

  /* 10. LOYALTY CLUB */
  loyaltyBanner: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  loyaltyGradient: {
    borderRadius: 20,
    padding: 20
  },
  loyaltyHeader: {
    marginBottom: 16
  },
  loyaltyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8
  },
  loyaltyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1
  },
  loyaltyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  loyaltyDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17
  },
  loyaltyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    gap: 6
  },
  loyaltyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '75%'
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
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
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4
  },
  destItemActive: {
    backgroundColor: '#FFF7ED'
  },
  destIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontWeight: '600',
    color: '#0F172A'
  },
  destNameActive: {
    color: '#EA580C',
    fontWeight: '700'
  },
  destSub: {
    fontSize: 12,
    color: '#64748B'
  },

  /* STEPPER */
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#64748B'
  },
  counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center'
  },
  confirmGuestsBtn: {
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20
  },
  confirmGuestsBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  /* 2B. TOP NAV BAR STYLES */
  topNavBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 4
  },
  topNavBarScroll: {
    paddingHorizontal: 12,
    gap: 4
  },
  topNavTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    position: 'relative'
  },
  topNavTabItemActive: {
    backgroundColor: '#FFF7ED'
  },
  topNavTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  topNavTabTextActive: {
    fontWeight: '800',
    color: '#EA580C'
  },
  topNavActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: '#EA580C',
    borderRadius: 1.5
  }
});
