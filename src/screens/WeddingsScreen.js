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
import { brand, gatheringVenues } from '../data/siteData';
import { COLORS } from '../theme/colors';

const CATEGORY_TABS = ['Meetings', 'Events', 'Weddings'];

const GUEST_RANGES = ['Under 100 Guests', '100 - 250 Guests', '250 - 500 Guests', '500+ Guests'];

export default function WeddingsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Events');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [guestRange, setGuestRange] = useState(GUEST_RANGES[1]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [eventDate, setEventDate] = useState('Nov 2026');
  const [specialNotes, setSpecialNotes] = useState('');

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const toastY = useRef(new Animated.Value(-80)).current;

  // Filter Fade Animation
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.spring(toastY, { toValue: 20, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(toastY, { toValue: -80, duration: 280, useNativeDriver: true })
    ]).start();
  };

  const handleTabChange = (cat) => {
    Animated.sequence([
      Animated.timing(listFadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(listFadeAnim, { toValue: 1, duration: 220, useNativeDriver: true })
    ]).start();
    setActiveCategory(cat);
  };

  const handleOpenPlanModal = (venue = null) => {
    setSelectedVenue(venue);
    setShowPlanModal(true);
  };

  const handleSubmitProposal = () => {
    setShowPlanModal(false);
    showToast(`Proposal request sent! Concierge will connect at ${contactPhone || '+91 96587 100'}.`);
  };

  // Filter venues based on active category
  const filteredVenues = gatheringVenues.filter((venue) => {
    if (activeCategory === 'All') return true;
    return venue.category === activeCategory;
  });

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

          <Pressable style={styles.navTab} onPress={() => navigation.navigate('DiningTab')}>
            <Ionicons name="restaurant-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Restaurant & Dine-In</Text>
          </Pressable>

          <Pressable style={styles.navTab} onPress={() => navigation.navigate('GalleryTab')}>
            <Ionicons name="compass-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.navTabText}>Experiences</Text>
          </Pressable>

          {/* Active Weddings / Events Tab */}
          <Pressable style={[styles.navTab, styles.navTabActive]}>
            <Ionicons name="heart" size={15} color="#EA580C" style={{ marginRight: 6 }} />
            <Text style={[styles.navTabText, styles.navTabTextActive]}>Weddings</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================================================== */}
        {/* 2. GATHERINGS / EVENTS HERO HEADER (Matching m2nhotels.com/events) */}
        {/* =================================================================== */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>GATHERINGS</Text>

          <Text style={styles.mainTitle}>EVENTS</Text>

          <Text style={styles.heroSubtitle}>
            Every gathering here is house-private: when your event is in session, the space belongs to no one else.
          </Text>
        </View>

        {/* =================================================================== */}
        {/* 3. FLOATING CATEGORY SWITCHER (Meetings | Events | Weddings)        */}
        {/* =================================================================== */}
        <View style={styles.switcherContainer}>
          <View style={styles.switcherPill}>
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.switcherBtn, isActive && styles.switcherBtnActive]}
                  onPress={() => handleTabChange(tab)}
                >
                  <Text style={[styles.switcherBtnText, isActive && styles.switcherBtnTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* =================================================================== */}
        {/* 4. VENUES LIST / CARDS (Matching website screenshots)              */}
        {/* =================================================================== */}
        <Animated.View style={[styles.venuesContainer, { opacity: listFadeAnim }]}>
          {filteredVenues.map((venue) => (
            <View key={venue.id} style={styles.venueCard}>
              {/* Image Container with Property Tag Badge */}
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
                {/* Title */}
                <Text style={styles.venueTitle}>{venue.title}</Text>

                {/* Specs Row: Capacity, Size, Layout */}
                <View style={styles.specsRow}>
                  {/* Capacity */}
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>CAPACITY</Text>
                    <View style={styles.specValueRow}>
                      <Ionicons name="people-outline" size={15} color="#EA580C" style={{ marginRight: 5 }} />
                      <Text style={styles.specValue}>{venue.capacity}</Text>
                    </View>
                  </View>

                  {/* Size */}
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>SIZE (SQ.M)</Text>
                    <View style={styles.specValueRow}>
                      <Ionicons name="pencil-outline" size={14} color="#EA580C" style={{ marginRight: 5 }} />
                      <Text style={styles.specValue}>{venue.size}</Text>
                    </View>
                  </View>

                  {/* Layout */}
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>LAYOUT</Text>
                    <View style={styles.specValueRow}>
                      <Ionicons name="grid-outline" size={14} color="#EA580C" style={{ marginRight: 5 }} />
                      <Text style={styles.specValue}>{venue.layout}</Text>
                    </View>
                  </View>
                </View>

                {/* Enquire Button */}
                <Pressable
                  style={({ pressed }) => [styles.enquireBtn, pressed && { opacity: 0.85 }]}
                  onPress={() => handleOpenPlanModal(venue)}
                >
                  <Text style={styles.enquireBtnText}>Enquire Space</Text>
                  <Ionicons name="arrow-forward" size={14} color="#0F172A" style={{ marginLeft: 4 }} />
                </Pressable>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* =================================================================== */}
        {/* 5. EDITORIAL QUOTE & PLAN BANNER (Matching Screenshot 3)           */}
        {/* =================================================================== */}
        <View style={styles.planBanner}>
          <Text style={styles.planBannerQuote}>
            Reception, offsite, or quiet signing —{' '}
            <Text style={styles.planBannerQuoteItalic}>
              we set the room, you keep the moment.
            </Text>
          </Text>

          <Pressable
            style={({ pressed }) => [styles.planBtn, pressed && { opacity: 0.85 }]}
            onPress={() => handleOpenPlanModal(null)}
          >
            <Text style={styles.planBtnText}>
              {activeCategory === 'Weddings' ? 'Plan a Wedding' : 'Plan an Event'}
            </Text>
          </Pressable>
        </View>

       
      </ScrollView>

      {/* =================================================================== */}
      {/* 7. INTERACTIVE EVENT / WEDDING ENQUIRY MODAL                       */}
      {/* =================================================================== */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowPlanModal(false)} />

          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>GATHERINGS & CELEBRATIONS</Text>
                <Text style={styles.modalTitle}>
                  {selectedVenue ? selectedVenue.title : 'Plan with Concierge'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedVenue ? selectedVenue.tag : 'Exclusive Private Event Booking'}
                </Text>
              </View>
              <Pressable style={styles.modalCloseBtn} onPress={() => setShowPlanModal(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Event Type / Category */}
              <Text style={styles.sectionLabel}>GATHERING TYPE</Text>
              <View style={styles.chipsRow}>
                {CATEGORY_TABS.map((tab) => {
                  const isSel = activeCategory === tab;
                  return (
                    <Pressable
                      key={tab}
                      style={[styles.chip, isSel && styles.chipActive]}
                      onPress={() => setActiveCategory(tab)}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{tab}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Guest Attendance Range */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>ESTIMATED GUESTS</Text>
              <View style={styles.chipsRow}>
                {GUEST_RANGES.map((range) => {
                  const isSel = guestRange === range;
                  return (
                    <Pressable
                      key={range}
                      style={[styles.chip, isSel && styles.chipActive]}
                      onPress={() => setGuestRange(range)}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{range}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Contact Information */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>ORGANIZER NAME</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Full Name (e.g. Ananya & Rohan)"
                placeholderTextColor="#94A3B8"
                value={contactName}
                onChangeText={setContactName}
              />

              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>DIRECT PHONE NUMBER</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Phone (e.g. +91 98765 43210)"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={setContactPhone}
              />

              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>TARGET DATE OR MONTH</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. November 2026, 3-Day Wedding"
                placeholderTextColor="#94A3B8"
                value={eventDate}
                onChangeText={setEventDate}
              />

              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>SPECIAL REQUIREMENTS</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. Mandap, sound equipment, catering preferences..."
                placeholderTextColor="#94A3B8"
                value={specialNotes}
                onChangeText={setSpecialNotes}
              />

              {/* Hotline note */}
              <View style={styles.hotlineNoteBox}>
                <Ionicons name="call" size={16} color="#EA580C" style={{ marginRight: 8 }} />
                <Text style={styles.hotlineNoteText}>
                  Prefer instant discussion? Call Head Concierge directly at{' '}
                  <Text style={{ fontWeight: '800', color: '#EA580C' }}>+91 96587 100</Text>
                </Text>
              </View>
            </ScrollView>

            {/* Submit CTA */}
            <Pressable
              style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.9 }]}
              onPress={handleSubmitProposal}
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.confirmBtnText}>Submit Event Proposal Request</Text>
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

  // 2. Gatherings Hero Section
  heroSection: {
    paddingTop: 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 3,
    marginBottom: 14,
    textAlign: 'center'
  },
  mainTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 14
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 520,
    paddingHorizontal: 10
  },

  // 3. Category Switcher (Meetings | Events | Weddings)
  switcherContainer: {
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 16
  },
  switcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  switcherBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24
  },
  switcherBtnActive: {
    backgroundColor: '#0F172A'
  },
  switcherBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  switcherBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },

  // 4. Venues Container
  venuesContainer: {
    paddingHorizontal: 16,
    gap: 24
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
  venueTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 16
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16
  },
  specCol: {
    flex: 1
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 6
  },
  specValueRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },

  enquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 24
  },
  enquireBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },

  // 5. Plan Banner
  planBanner: {
    marginHorizontal: 16,
    marginTop: 36,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center'
  },
  planBannerQuote: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20
  },
  planBannerQuoteItalic: {
    color: '#C2410C',
    fontStyle: 'italic',
    fontWeight: '500'
  },
  planBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  planBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // 6. Luxury Obsidian Footer
  footerContainer: {
    backgroundColor: '#0F172A',
    marginTop: 40,
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
  footerStory: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 4
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
  hotlineNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginTop: 12
  },
  hotlineNoteText: {
    fontSize: 12,
    color: '#9A3412',
    flex: 1,
    lineHeight: 17
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
