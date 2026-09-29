import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  Animated,
  Modal,
  Platform,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brand, diningVenues } from '../data/siteData';
import { COLORS } from '../theme/colors';

const MEAL_SLOTS = [
  'Breakfast (07:00 — 10:30)',
  'Lunch (12:30 — 15:30)',
  'High Tea (15:00 — 18:00)',
  'Dinner (19:00 — 23:00)',
  'Late Evening (22:30 — 00:30)'
];

const DATES = [
  { label: 'Today', date: '29 Sep' },
  { label: 'Tomorrow', date: '30 Sep' },
  { label: 'Wednesday', date: '01 Oct' },
  { label: 'Thursday', date: '02 Oct' }
];

export default function RestaurantScreen({ navigation }) {
  const [selectedVenue, setSelectedVenue] = useState(diningVenues[0]);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(MEAL_SLOTS[3]);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const toastY = useRef(new Animated.Value(-80)).current;

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.spring(toastY, { toValue: 20, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(toastY, { toValue: -80, duration: 280, useNativeDriver: true })
    ]).start();
  };

  const handleOpenReserve = (venue) => {
    setSelectedVenue(venue);
    setShowReserveModal(true);
  };

  const handleConfirmReservation = () => {
    setShowReserveModal(false);
    showToast(`Table confirmed at ${selectedVenue.title} for ${guests} guests!`);
  };

  const calculatedTotal = (selectedVenue?.numericPrice || 4200) * guests;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Floating Animated Toast Banner */}
      <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastY }] }]}>
        <View style={styles.toastCard}>
          <Ionicons name="checkmark-circle" size={20} color="#EA580C" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      </Animated.View>

      {/* =================================================================== */}
      {/* 1. TOP HEADER BAR: M2N Logo & Website Navigation Shortcuts          */}
      {/* =================================================================== */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </Pressable>
          <Image
            source={require('../../assets/m2n_logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.navigate('MoreTab', { screen: 'Login' })}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.menuBtn, pressed && { backgroundColor: '#F1F5F9' }]}
            onPress={() => navigation.navigate('MoreTab')}
          >
            <Ionicons name="menu-outline" size={20} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      {/* Quick Website Navigation Bar */}
      <View style={styles.navBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navBarContent}
        >
          <Pressable style={styles.navTab} onPress={() => navigation.navigate('HomeTab')}>
            <Ionicons name="home-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Home</Text>
          </Pressable>

          <Pressable style={styles.navTab} onPress={() => navigation.navigate('HotelsTab')}>
            <Ionicons name="bed-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Stays</Text>
          </Pressable>

          {/* Active Tab */}
          <Pressable style={[styles.navTab, styles.navTabActive]}>
            <Ionicons name="restaurant" size={15} color="#EA580C" style={{ marginRight: 6 }} />
            <Text style={[styles.navTabText, styles.navTabTextActive]}>Restaurant & Dine-In</Text>
          </Pressable>

          <Pressable style={styles.navTab} onPress={() => navigation.navigate('GalleryTab')}>
            <Ionicons name="compass-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Experiences</Text>
          </Pressable>

          <Pressable style={styles.navTab} onPress={() => navigation.navigate('WeddingsTab')}>
            <Ionicons name="heart-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Weddings</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================================================== */}
        {/* 2. GASTRONOMY HERO HEADER (Matching m2nhotels.com/dining)           */}
        {/* =================================================================== */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>GASTRONOMY</Text>

          <Text style={styles.mainTitle}>
            Food is the shortest{'\n'}route{'\n'}
            <Text style={styles.mainTitleItalic}>to a place.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Four tables across four houses — each built from the ledgers of its own region, each committed to slow technique over seasonal theatre.
          </Text>

          <View style={styles.heroDivider} />
        </View>

        {/* =================================================================== */}
        {/* 3. DINING VENUES (Matching the 4 website cards)                     */}
        {/* =================================================================== */}
        <View style={styles.venuesContainer}>
          {diningVenues.map((venue) => (
            <View key={venue.id} style={styles.venueCard}>
              {/* Image Container with pill badge */}
              <View style={styles.cardImageWrapper}>
                <Image
                  source={{ uri: venue.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{venue.tag}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Title & Number Row */}
                <View style={styles.titleRow}>
                  <Text style={styles.venueTitle}>{venue.title}</Text>
                  <Text style={styles.venueNumber}>{venue.number}</Text>
                </View>

                {/* Location & Timings Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color="#EA580C" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>{venue.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#EA580C" style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>{venue.timings}</Text>
                  </View>
                </View>

                {/* Description Narrative */}
                <Text style={styles.venueDescription}>{venue.description}</Text>

                {/* Signature Dishes */}
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>SIGNATURE</Text>
                  <Text style={styles.signatureValue}>{venue.signature}</Text>
                </View>

                {/* Card Footer: Price & Reserve Button */}
                <View style={styles.cardFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceValue}>
                      From {venue.price}
                      <Text style={styles.priceUnit}> {venue.priceUnit}</Text>
                    </Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [styles.reserveBtn, pressed && styles.reserveBtnPressed]}
                    onPress={() => handleOpenReserve(venue)}
                  >
                    <Text style={styles.reserveBtnText}>Reserve</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* =================================================================== */}
        {/* 4. CONCIERGE CALL-TO-ACTION                                         */}
        {/* =================================================================== */}
        <View style={styles.conciergeBanner}>
          <View style={styles.conciergeIconWrap}>
            <Ionicons name="restaurant" size={24} color="#EA580C" />
          </View>
          <View style={styles.conciergeContent}>
            <Text style={styles.conciergeTitle}>Private Dining & Chef's Table</Text>
            <Text style={styles.conciergeText}>
              Planning a bespoke celebration, dietary requirements, or private royal banquet?
            </Text>
            <Pressable
              style={styles.conciergeCallBtn}
              onPress={() => showToast('Calling Concierge at +91 96587 100...')}
            >
              <Ionicons name="call" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.conciergeCallBtnText}>Call Concierge: +91 96587 100</Text>
            </Pressable>
          </View>
        </View>

        
      </ScrollView>

      {/* =================================================================== */}
      {/* 6. INTERACTIVE TABLE RESERVATION MODAL                              */}
      {/* =================================================================== */}
      <Modal
        visible={showReserveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReserveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowReserveModal(false)} />

          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>TABLE RESERVATION</Text>
                <Text style={styles.modalTitle}>{selectedVenue?.title}</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedVenue?.location} • {selectedVenue?.timings}
                </Text>
              </View>
              <Pressable style={styles.modalCloseBtn} onPress={() => setShowReserveModal(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Date Selection */}
              <Text style={styles.sectionLabel}>SELECT DATE</Text>
              <View style={styles.chipsRow}>
                {DATES.map((item) => {
                  const isSel = selectedDate === item.label;
                  return (
                    <Pressable
                      key={item.label}
                      style={[styles.chip, isSel && styles.chipActive]}
                      onPress={() => setSelectedDate(item.label)}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextActive]}>
                        {item.label} ({item.date})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Time Slot Selection */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>SELECT SERVICE TIME</Text>
              <View style={styles.chipsRow}>
                {MEAL_SLOTS.map((slot) => {
                  const isSel = selectedSlot === slot;
                  return (
                    <Pressable
                      key={slot}
                      style={[styles.chip, isSel && styles.chipActive]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{slot}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Guests Stepper */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>NUMBER OF GUESTS</Text>
              <View style={styles.guestCounterRow}>
                <View>
                  <Text style={styles.guestCountText}>
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </Text>
                  <Text style={styles.guestSubtext}>Table seating preference</Text>
                </View>
                <View style={styles.stepperWrap}>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => setGuests((g) => Math.max(1, g - 1))}
                  >
                    <Ionicons name="remove" size={18} color="#0F172A" />
                  </Pressable>
                  <Text style={styles.stepValue}>{guests}</Text>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => setGuests((g) => Math.min(12, g + 1))}
                  >
                    <Ionicons name="add" size={18} color="#0F172A" />
                  </Pressable>
                </View>
              </View>

              {/* Guest Details */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>PRIMARY GUEST NAME</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Full Name (e.g. Vikramaditya Singh)"
                placeholderTextColor="#94A3B8"
                value={guestName}
                onChangeText={setGuestName}
              />

              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>SPECIAL DIETARY OR OCCASION</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. Anniversary, Vegetarian, Window seating..."
                placeholderTextColor="#94A3B8"
                value={specialRequests}
                onChangeText={setSpecialRequests}
              />

              {/* Price Calculation Summary */}
              <View style={styles.priceSummaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Base Rate</Text>
                  <Text style={styles.summaryVal}>{selectedVenue?.price} / guest</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total for {guests} guests</Text>
                  <Text style={styles.summaryTotal}>₹{calculatedTotal.toLocaleString('en-IN')}</Text>
                </View>
                <Text style={styles.summaryNote}>No advance payment required • Pay after dining</Text>
              </View>
            </ScrollView>

            {/* Confirm CTA */}
            <Pressable
              style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.9 }]}
              onPress={handleConfirmReservation}
            >
              <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.confirmBtnText}>Confirm Table Reservation</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%'
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  scrollContent: {
    paddingBottom: 110,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 720,
        marginHorizontal: 'auto'
      }
    })
  },

  // Floating Toast
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 48,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center'
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.4)'
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },

  // Top Header Bar
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  logo: {
    width: 68,
    height: 38
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  loginBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600'
  },

  // Navigation Bar matching website tabs
  navBarWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  navBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  navTabActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C'
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B'
  },
  navTabTextActive: {
    color: '#EA580C',
    fontWeight: '700'
  },

  // 2. Gastronomy Hero Section
  heroSection: {
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 3,
    marginBottom: 16,
    textAlign: 'center'
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -0.8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  mainTitleItalic: {
    color: '#C2410C',
    fontStyle: 'italic',
    fontWeight: '500'
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 18,
    maxWidth: 540,
    paddingHorizontal: 10
  },
  heroDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 28
  },

  // 3. Dining Cards Container
  venuesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 28
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3
  },
  cardImageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%'
  },
  tagBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  tagBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1
  },

  cardBody: {
    padding: 20
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6
  },
  venueTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  venueNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500'
  },

  venueDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16
  },

  signatureBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EA580C',
    marginBottom: 18
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 4
  },
  signatureValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A'
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EA580C'
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  reserveBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  reserveBtnPressed: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  reserveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },

  // Concierge Banner
  conciergeBanner: {
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14
  },
  conciergeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  conciergeContent: {
    flex: 1
  },
  conciergeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  conciergeText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10
  },
  conciergeCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20
  },
  conciergeCallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // 5. Obsidian Luxury Footer
  footerContainer: {
    backgroundColor: '#0F172A',
    marginTop: 36,
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  footerBrand: {
    marginBottom: 28
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  footerLogoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(234, 88, 12, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  footerBrandName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2
  },
  footerTagline: {
    fontSize: 12,
    color: '#94A3B8'
  },
  footerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 32
  },
  footerCol: {
    minWidth: 140
  },
  footerColTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: 12
  },
  footerColItem: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8
  },
  footerColLink: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
    marginBottom: 8
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
    alignItems: 'center'
  },
  copyrightText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center'
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: 2
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 8
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  chipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C'
  },
  chipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  },
  chipTextActive: {
    color: '#EA580C',
    fontWeight: '700'
  },
  guestCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  guestCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  guestSubtext: {
    fontSize: 11.5,
    color: '#64748B'
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center'
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 6
  },
  priceSummaryBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#475569'
  },
  summaryVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EA580C'
  },
  summaryNote: {
    fontSize: 11,
    color: '#9A3412',
    fontStyle: 'italic',
    marginTop: 4
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 18,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});
