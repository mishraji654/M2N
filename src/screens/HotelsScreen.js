import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  Animated,
  Modal,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { hotels, brand } from '../data/siteData';
import { COLORS } from '../theme/colors';

const DESTINATION_TABS = [
  { id: 'all', name: 'All Stays', count: 5, icon: 'globe-outline', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  { id: 'lucknow', name: 'Lucknow', count: 1, icon: 'business-outline', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80' },
  { id: 'jaipur', name: 'Jaipur', count: 1, icon: 'sparkles-outline', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  { id: 'shimla', name: 'Shimla', count: 1, icon: 'snow-outline', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'udaipur', name: 'Udaipur', count: 1, icon: 'water-outline', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'goa', name: 'Goa', count: 1, icon: 'sunny-outline', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' }
];

const CATEGORIES = ['All Types', 'Palace', 'Mountain', 'Villas', 'Popular'];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended', icon: 'star-outline' },
  { id: 'price_low', label: 'Price: Low to High', icon: 'trending-up-outline' },
  { id: 'price_high', label: 'Price: High to Low', icon: 'trending-down-outline' },
  { id: 'rating', label: 'Top Rated (4.9+)', icon: 'trophy-outline' }
];

export default function HotelsScreen({ navigation }) {
  const [activeDest, setActiveDest] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All Types');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [favorites, setFavorites] = useState({});

  // Filter criteria
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Animation values
  const listFadeAnim = useRef(new Animated.Value(1)).current;
  const toastY = useRef(new Animated.Value(-80)).current;
  const [toastMsg, setToastMsg] = useState('');

  // Pulse animation for badges
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1100, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.spring(toastY, { toValue: 20, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastY, { toValue: -80, duration: 280, useNativeDriver: true })
    ]).start();
  };

  const toggleFavorite = (id, name) => {
    setFavorites((prev) => {
      const isFav = !prev[id];
      showToast(isFav ? `❤️ Added ${name} to Wishlist` : `Removed ${name} from Wishlist`);
      return { ...prev, [id]: isFav };
    });
  };

  const handleDestChange = (destId, name) => {
    Animated.sequence([
      Animated.timing(listFadeAnim, { toValue: 0.35, duration: 120, useNativeDriver: true }),
      Animated.timing(listFadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
    ]).start();
    setActiveDest(destId);
    showToast(`📍 Destination: ${name}`);
  };

  // Filter and sort properties
  const filteredHotels = hotels
    .filter((h) => {
      // Destination filter
      const matchesDest =
        activeDest === 'all' ||
        h.location.toLowerCase().includes(activeDest.toLowerCase()) ||
        h.name.toLowerCase().includes(activeDest.toLowerCase());

      // Category filter
      const matchesCat =
        activeCategory === 'All Types' ||
        h.category === activeCategory ||
        h.tags?.includes(activeCategory);

      // Search query filter
      const matchesQuery =
        query.trim() === '' ||
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.location.toLowerCase().includes(query.toLowerCase());

      // Price filter
      const matchesPrice = (h.numericPrice || 5000) <= maxPrice;

      // Amenities filter
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          h.amenities?.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
        );

      return matchesDest && matchesCat && matchesQuery && matchesPrice && matchesAmenities;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return (a.numericPrice || 0) - (b.numericPrice || 0);
      if (sortBy === 'price_high') return (b.numericPrice || 0) - (a.numericPrice || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // recommended order
    });

  const activeFilterCount =
    (maxPrice < 15000 ? 1 : 0) +
    selectedAmenities.length +
    (activeCategory !== 'All Types' ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Floating Animated Toast Banner */}
      <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastY }] }]}>
        <View style={styles.toastCard}>
          <Ionicons name="sparkles" size={18} color="#EA580C" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      </Animated.View>

      {/* =================================================================== */}
      {/* 1. TOP HEADER: LUXURY BRANDING & TITLE                              */}
      {/* =================================================================== */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>M2N Stays</Text>
            <Text style={styles.headerSubtitle}>Sanctuaries & Heritage Palaces</Text>
          </View>
        </View>

        <Pressable
          style={styles.conciergeBadge}
          onPress={() => showToast(`📞 Concierge Hotline: ${brand.phone}`)}
        >
          <Ionicons name="call" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.conciergeBadgeText}>Concierge</Text>
        </Pressable>
      </View>

      {/* =================================================================== */}
      {/* 2. SEARCH & FILTER / SORT BAR                                       */}
      {/* =================================================================== */}
      <View style={styles.searchBarRow}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotel name or city..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        {/* Filter Button with badge count */}
        <Pressable
          style={[styles.filterActionBtn, activeFilterCount > 0 && styles.filterActionBtnActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons
            name="options-outline"
            size={19}
            color={activeFilterCount > 0 ? '#FFFFFF' : '#0F172A'}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadgeCount}>
              <Text style={styles.filterBadgeCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>

        {/* Sort Button */}
        <Pressable
          style={styles.filterActionBtn}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical-outline" size={19} color="#0F172A" />
        </Pressable>
      </View>

      {/* =================================================================== */}
      {/* 3. HORIZONTAL DESTINATION THUMBNAILS CAROUSEL                       */}
      {/* =================================================================== */}
      <View style={styles.destCarouselSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destCarouselContent}
        >
          {DESTINATION_TABS.map((dest) => {
            const isSelected = activeDest === dest.id;
            return (
              <Pressable
                key={dest.id}
                style={[styles.destCard, isSelected && styles.destCardActive]}
                onPress={() => handleDestChange(dest.id, dest.name)}
              >
                <Image source={{ uri: dest.img }} style={styles.destThumb} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(15, 23, 42, 0.75)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.destCardOverlay}>
                  <Text style={[styles.destCardName, isSelected && styles.destCardNameActive]}>
                    {dest.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.destActiveDot} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* =================================================================== */}
      {/* 4. CATEGORY PILLS                                                   */}
      {/* =================================================================== */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => {
                  setActiveCategory(cat);
                  showToast(`Type: ${cat}`);
                }}
              >
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* =================================================================== */}
      {/* 5. HOTEL CARDS FEED (ANIMATED LIST)                                 */}
      {/* =================================================================== */}
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsInfoRow}>
          <Text style={styles.resultsCount}>
            Showing <Text style={{ fontWeight: '800', color: '#EA580C' }}>{filteredHotels.length}</Text>{' '}
            {filteredHotels.length === 1 ? 'luxury stay' : 'luxury stays'}
          </Text>
          <Text style={styles.sortIndicatorText}>
            Sorted by: {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
          </Text>
        </View>

        <Animated.View style={{ opacity: listFadeAnim }}>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => {
              const isFav = !!favorites[hotel.id];
              const originalPriceCalc = Math.round((hotel.numericPrice || 5000) * 1.25);

              return (
                <Pressable
                  key={hotel.id}
                  style={({ pressed }) => [
                    styles.hotelCardContainer,
                    pressed && { transform: [{ scale: 0.985 }] }
                  ]}
                  onPress={() => navigation.navigate('HotelDetail', { hotel })}
                >
                  <View style={styles.cardImageWrapper}>
                    <Image source={{ uri: hotel.image }} style={styles.cardImage} resizeMode="cover" />

                    {/* Gradient Overlay */}
                    <LinearGradient
                      colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(10, 18, 30, 0.9)']}
                      locations={[0, 0.45, 1]}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Top Badges Row */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.cardBadgeWrap}>
                        {hotel.id === 'hotel-01' ? (
                          <Animated.View style={[styles.flagshipBadge, { transform: [{ scale: pulseAnim }] }]}>
                            <Ionicons name="sparkles" size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
                            <Text style={styles.flagshipBadgeText}>FLAGSHIP</Text>
                          </Animated.View>
                        ) : (
                          <View style={styles.heritageBadge}>
                            <Text style={styles.heritageBadgeText}>HERITAGE CERTIFIED</Text>
                          </View>
                        )}
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountBadgeText}>25% OFF</Text>
                        </View>
                      </View>

                      {/* Favorite Bookmark Button */}
                      <Pressable
                        style={styles.cardFavBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(hotel.id, hotel.name);
                        }}
                      >
                        <Ionicons
                          name={isFav ? 'bookmark' : 'bookmark-outline'}
                          size={19}
                          color={isFav ? '#EA580C' : '#FFFFFF'}
                        />
                      </Pressable>
                    </View>

                    {/* Bottom Content Overlaid on Card Image */}
                    <View style={styles.cardBottomOverlay}>
                      <View style={styles.cardRatingRow}>
                        <View style={styles.ratingStarBadge}>
                          <Ionicons name="star" size={13} color="#F59E0B" style={{ marginRight: 3 }} />
                          <Text style={styles.ratingVal}>{hotel.rating}</Text>
                        </View>
                        <Text style={styles.reviewsText}>({hotel.reviewsCount || 40} Reviews)</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.guestCountText}>{hotel.guests || 2} Guests</Text>
                      </View>

                      <Text style={styles.hotelCardTitle} numberOfLines={1}>
                        {hotel.name}
                      </Text>

                      <View style={styles.hotelLocRow}>
                        <Ionicons name="location-outline" size={14} color="#CBD5E1" style={{ marginRight: 4 }} />
                        <Text style={styles.hotelLocText} numberOfLines={1}>
                          {hotel.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Bottom Details & CTA Bar */}
                  <View style={styles.cardFooterBar}>
                    <View style={styles.cardAmenitiesRow}>
                      {hotel.amenities?.slice(0, 2).map((amenity, i) => (
                        <View key={i} style={styles.amenityTag}>
                          <Ionicons name="checkmark-circle-outline" size={12} color="#EA580C" style={{ marginRight: 3 }} />
                          <Text style={styles.amenityTagText} numberOfLines={1}>
                            {amenity}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardPricingActionRow}>
                      <View>
                        <Text style={styles.strikePrice}>₹{originalPriceCalc.toLocaleString()}</Text>
                        <Text style={styles.mainPrice}>
                          {hotel.price}
                          <Text style={styles.unitText}> /night</Text>
                        </Text>
                      </View>

                      <Pressable
                        style={styles.bookNowBtn}
                        onPress={() => navigation.navigate('HotelDetail', { hotel })}
                      >
                        <Text style={styles.bookNowBtnText}>View Suite</Text>
                        <Ionicons name="chevron-forward" size={15} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Stays Match Your Filter</Text>
              <Text style={styles.emptySub}>
                Try adjusting your budget or destination search criteria.
              </Text>
              <Pressable
                style={styles.resetFiltersBtn}
                onPress={() => {
                  setActiveDest('all');
                  setActiveCategory('All Types');
                  setQuery('');
                  setMaxPrice(15000);
                  setSelectedAmenities([]);
                  showToast('Filters Reset to Default');
                }}
              >
                <Text style={styles.resetFiltersBtnText}>Reset All Filters</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>

        {/* 24/7 Concierge Booking Assistance Banner */}
        <View style={styles.conciergeBanner}>
          <View style={styles.conciergeIconWrap}>
            <Ionicons name="headset" size={24} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.conciergeBannerTitle}>Need Personalized Booking Assistance?</Text>
            <Text style={styles.conciergeBannerSub}>
              Call our 24/7 M2N Reservations Desk for customized suites & wedding banquets.
            </Text>
            <Pressable
              style={styles.callConciergeBtn}
              onPress={() => showToast(`Calling ${brand.phone}`)}
            >
              <Ionicons name="call" size={14} color="#EA580C" style={{ marginRight: 6 }} />
              <Text style={styles.callConciergeBtnText}>{brand.phone}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* =================================================================== */}
      {/* 6. MODAL: FILTERS BOTTOM SHEET                                      */}
      {/* =================================================================== */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Filter Stays</Text>
              <Pressable
                onPress={() => {
                  setMaxPrice(15000);
                  setSelectedAmenities([]);
                  showToast('Filters cleared');
                }}
              >
                <Text style={styles.modalClearText}>Reset</Text>
              </Pressable>
            </View>

            {/* Price Budget Selector */}
            <Text style={styles.modalSectionLabel}>Max Budget per Night</Text>
            <View style={styles.pricePillsRow}>
              {[5000, 8000, 10000, 15000].map((p) => {
                const isSelected = maxPrice === p;
                return (
                  <Pressable
                    key={p}
                    style={[styles.pricePill, isSelected && styles.pricePillActive]}
                    onPress={() => setMaxPrice(p)}
                  >
                    <Text style={[styles.pricePillText, isSelected && styles.pricePillTextActive]}>
                      {p === 15000 ? 'Any Budget' : `Up to ₹${p.toLocaleString()}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Amenities Checkboxes */}
            <Text style={styles.modalSectionLabel}>Featured Amenities</Text>
            <View style={styles.amenitiesCheckList}>
              {['Free High-speed Wi-Fi', 'Luxury Spa', 'Breakfast', 'Pool', 'Parking'].map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <Pressable
                    key={amenity}
                    style={[styles.amenityCheckItem, isChecked && styles.amenityCheckItemActive]}
                    onPress={() => {
                      if (isChecked) {
                        setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                      } else {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      }
                    }}
                  >
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isChecked ? '#EA580C' : '#94A3B8'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.amenityCheckText, isChecked && styles.amenityCheckTextActive]}>
                      {amenity}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.modalApplyBtn}
              onPress={() => {
                setShowFilterModal(false);
                showToast(`Applied: Showing ${filteredHotels.length} Stays`);
              }}
            >
              <Text style={styles.modalApplyBtnText}>
                Apply Filters ({filteredHotels.length} Stays)
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* =================================================================== */}
      {/* 7. MODAL: SORT OPTIONS SHEET                                        */}
      {/* =================================================================== */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort Properties</Text>
            <Text style={styles.modalSubtitle}>Order properties based on your preference</Text>

            {SORT_OPTIONS.map((opt) => {
              const isSelected = sortBy === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  style={[styles.sortItem, isSelected && styles.sortItemActive]}
                  onPress={() => {
                    setSortBy(opt.id);
                    setShowSortModal(false);
                    showToast(`Sorted by: ${opt.label}`);
                  }}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? '#EA580C' : '#64748B'}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.sortItemText, isSelected && styles.sortItemTextActive]}>
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color="#EA580C" style={{ marginLeft: 'auto' }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 14 : 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  conciergeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14
  },
  conciergeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    gap: 8
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A'
  },
  filterActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative'
  },
  filterActionBtnActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  filterBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  filterBadgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  destCarouselSection: {
    marginBottom: 10
  },
  destCarouselContent: {
    paddingHorizontal: 20,
    gap: 10
  },
  destCard: {
    width: 100,
    height: 74,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative'
  },
  destCardActive: {
    borderColor: '#EA580C'
  },
  destThumb: {
    width: '100%',
    height: '100%'
  },
  destCardOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8
  },
  destCardName: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  destCardNameActive: {
    color: '#FFEDD5'
  },
  destActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EA580C',
    marginTop: 2
  },
  categoriesWrapper: {
    marginBottom: 8
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  categoryPillTextActive: {
    color: '#FFFFFF'
  },
  page: {
    flex: 1,
    width: '100%'
  },
  content: {
    paddingBottom: 120
  },
  resultsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4
  },
  resultsCount: {
    fontSize: 13,
    color: '#475467',
    fontWeight: '600'
  },
  sortIndicatorText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  hotelCardContainer: {
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden'
  },
  cardImageWrapper: {
    height: 230,
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%'
  },
  cardTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  cardBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  flagshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12
  },
  flagshipBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  heritageBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  heritageBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  discountBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800'
  },
  cardFavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardBottomOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14
  },
  cardRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  ratingStarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  reviewsText: {
    fontSize: 11.5,
    color: '#E2E8F0',
    fontWeight: '600'
  },
  dotSeparator: {
    color: '#E2E8F0',
    marginHorizontal: 5
  },
  guestCountText: {
    fontSize: 11.5,
    color: '#E2E8F0',
    fontWeight: '600'
  },
  hotelCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6
  },
  hotelLocRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hotelLocText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600'
  },
  cardFooterBar: {
    padding: 14,
    backgroundColor: '#FFFFFF'
  },
  cardAmenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8
  },
  amenityTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C'
  },
  cardPricingActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  strikePrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through'
  },
  mainPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 4
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18
  },
  resetFiltersBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16
  },
  resetFiltersBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  conciergeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    marginHorizontal: 18,
    marginTop: 8,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    gap: 12
  },
  conciergeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2
  },
  conciergeBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2
  },
  conciergeBannerSub: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8
  },
  callConciergeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EA580C'
  },
  callConciergeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
    maxHeight: '85%'
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16
  },
  modalClearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C'
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10
  },
  pricePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  pricePillActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  pricePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475467'
  },
  pricePillTextActive: {
    color: '#FFFFFF'
  },
  amenitiesCheckList: {
    gap: 8,
    marginBottom: 24
  },
  amenityCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  amenityCheckItemActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5'
  },
  amenityCheckText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A'
  },
  amenityCheckTextActive: {
    color: '#EA580C',
    fontWeight: '700'
  },
  modalApplyBtn: {
    backgroundColor: '#EA580C',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  sortItemActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C'
  },
  sortItemText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A'
  },
  sortItemTextActive: {
    color: '#EA580C',
    fontWeight: '800'
  }
});
