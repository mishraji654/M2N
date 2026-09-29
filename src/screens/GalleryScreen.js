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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { curatedExperiences, brand } from '../data/siteData';
import { COLORS } from '../theme/colors';

const EXPERIENCE_FILTERS = [
  'All',
  'CULTURE',
  'GASTRONOMY',
  'LAKESIDE',
  'HERITAGE',
  'CRAFTS',
  'WELLNESS'
];

export default function GalleryScreen({ navigation }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedExp, setSelectedExp] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastY = useRef(new Animated.Value(-80)).current;

  // Staggered list fade animation
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.spring(toastY, { toValue: 20, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastY, { toValue: -80, duration: 260, useNativeDriver: true })
    ]).start();
  };

  const handleFilterChange = (tag) => {
    Animated.sequence([
      Animated.timing(listFadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(listFadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
    ]).start();
    setSelectedTag(tag);
  };

  const filteredList = curatedExperiences.filter((item) => {
    if (selectedTag === 'All') return true;
    return item.tag === selectedTag;
  });

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
      {/* 1. TOP HEADER: LOGO & BACK BUTTON                                   */}
      {/* =================================================================== */}
      <View style={styles.topHeader}>
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

        <Pressable
          style={styles.conciergeBtn}
          onPress={() => showToast(`📞 M2N Experiences Desk: ${brand.phone}`)}
        >
          <Ionicons name="call" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.conciergeBtnText}>Concierge</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================================================== */}
        {/* 2. HERO TITLE SECTION (Exact m2nhotels.com/experiences Architecture) */}
        {/* =================================================================== */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>CURATED BY THE HOUSES</Text>

          <View style={styles.titleRow}>
            <Text style={styles.heroTitlePrefix}>Expe</Text>
            <Text style={styles.heroTitleScript}>riences</Text>
          </View>

          <Text style={styles.heroDescription}>
            Nothing on this list is subcontracted. Every experience is led by someone who lives
            here — a historian, a chef, a seventh-generation astrologer.
          </Text>
        </View>

        {/* =================================================================== */}
        {/* 3. CATEGORY FILTER PILLS                                            */}
        {/* =================================================================== */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {EXPERIENCE_FILTERS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <Pressable
                key={tag}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => handleFilterChange(tag)}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {tag === 'All' ? 'All Experiences' : tag}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* =================================================================== */}
        {/* 4. EXPERIENCES LIST (Exact Cards from Screenshot 4 & 5)             */}
        {/* =================================================================== */}
        <Animated.View style={{ opacity: listFadeAnim }}>
          {filteredList.map((item) => (
            <View key={item.id} style={styles.experienceCard}>
              {/* Photo Container with Location Badge & Index */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />

                {/* Top Location Pill (JAIPUR / UDAIPUR / DELHI / SHIMLA) */}
                <View style={styles.locationPill}>
                  <Text style={styles.locationPillText}>{item.location}</Text>
                </View>

                {/* Number Badge (01, 02, 03, etc.) */}
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>{item.num}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Title & Duration */}
                <View style={styles.titleDurationRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.durationRow}>
                    <Ionicons name="time-outline" size={13} color="#EA580C" style={{ marginRight: 4 }} />
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.cardDescription}>{item.description}</Text>

                {/* Pricing & Plan Button */}
                <View style={styles.cardFooter}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceAmount}>{item.price}</Text>
                    <Text style={styles.priceUnit}>{item.unit}</Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [styles.planBtn, pressed && { opacity: 0.85 }]}
                    onPress={() => {
                      setSelectedExp(item);
                      setShowPlanModal(true);
                    }}
                  >
                    <Text style={styles.planBtnText}>Plan</Text>
                    <Ionicons name="arrow-forward" size={15} color="#0F172A" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* =================================================================== */}
        {/* 5. QUOTATION CARD (Exact from Screenshot 5)                        */}
        {/* =================================================================== */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The concierge does not sell experiences.{' '}
            <Text style={styles.quoteScript}>He lends you his friends."</Text>
          </Text>

          <Pressable
            style={({ pressed }) => [styles.quoteActionBtn, pressed && { opacity: 0.9 }]}
            onPress={() => showToast('Connecting to your dedicated Concierge...')}
          >
            <Text style={styles.quoteActionBtnText}>Plan with Concierge</Text>
            <Ionicons name="sparkles" size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>

        {/* =================================================================== */}
        {/* 6. BOTTOM FOOTER                                                    */}
        {/* =================================================================== */}
        <View style={styles.footerWrap}>
          <Text style={styles.footerTitle}>M2N Curated Journeys</Text>
          <Text style={styles.footerSub}>
            Private palace access, master artisans, and bespoke expeditions.
          </Text>
          <Text style={styles.footerPhone}>Hotline: {brand.phone}</Text>
        </View>
      </ScrollView>

      {/* =================================================================== */}
      {/* 7. INTERACTIVE MODAL: PLAN EXPERIENCE BOTTOM SHEET                  */}
      {/* =================================================================== */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPlanModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {selectedExp && (
              <>
                <View style={styles.modalBadgeRow}>
                  <View style={styles.modalLocationBadge}>
                    <Text style={styles.modalLocationText}>{selectedExp.location}</Text>
                  </View>
                  <Text style={styles.modalDurationText}>⏱ {selectedExp.duration}</Text>
                </View>

                <Text style={styles.modalTitle}>{selectedExp.title}</Text>
                <Text style={styles.modalDesc}>{selectedExp.description}</Text>

                <View style={styles.modalDivider} />

                {/* Guest Count Stepper */}
                <View style={styles.guestStepperRow}>
                  <View>
                    <Text style={styles.stepperLabel}>Number of Guests</Text>
                    <Text style={styles.stepperSub}>{selectedExp.price} per person</Text>
                  </View>

                  <View style={styles.stepperControls}>
                    <Pressable
                      style={styles.stepBtn}
                      onPress={() => guestCount > 1 && setGuestCount(guestCount - 1)}
                    >
                      <Ionicons name="remove" size={18} color="#0F172A" />
                    </Pressable>
                    <Text style={styles.stepVal}>{guestCount}</Text>
                    <Pressable
                      style={styles.stepBtn}
                      onPress={() => setGuestCount(guestCount + 1)}
                    >
                      <Ionicons name="add" size={18} color="#0F172A" />
                    </Pressable>
                  </View>
                </View>

                {/* Total Estimate */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Estimated Price</Text>
                  <Text style={styles.totalVal}>
                    ₹{(parseInt(selectedExp.price.replace(/[^\d]/g, ''), 10) * guestCount).toLocaleString()}
                  </Text>
                </View>

                {/* Confirm Button */}
                <Pressable
                  style={styles.confirmPlanBtn}
                  onPress={() => {
                    setShowPlanModal(false);
                    showToast(`✨ Plan Confirmed: ${selectedExp.title} for ${guestCount} Guests!`);
                  }}
                >
                  <Text style={styles.confirmPlanBtnText}>Confirm Experience Reservation</Text>
                </Pressable>
              </>
            )}
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
  logo: {
    width: 125,
    height: 42
  },
  conciergeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14
  },
  conciergeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  page: {
    flex: 1,
    width: '100%'
  },
  content: {
    paddingBottom: 120
  },
  heroSection: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    textAlign: 'center'
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#D97706',
    marginBottom: 8,
    textAlign: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12
  },
  heroTitlePrefix: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -1
  },
  heroTitleScript: {
    fontSize: 42,
    fontWeight: '700',
    color: '#EA580C',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  heroDescription: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 340
  },
  filtersScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B'
  },
  filterPillTextActive: {
    color: '#FFFFFF'
  },
  experienceCard: {
    marginHorizontal: 18,
    marginBottom: 24,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden'
  },
  imageContainer: {
    height: 190,
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%'
  },
  locationPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  locationPillText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  numberBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  numberBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  cardBody: {
    padding: 16
  },
  titleDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  durationText: {
    color: '#C2410C',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginBottom: 16
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  priceAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A'
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  },
  planBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4
  },
  planBtnText: {
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '800'
  },
  quoteCard: {
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 26,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#F3E8E2',
    alignItems: 'center',
    textAlign: 'center'
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 25,
    color: '#0F172A',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 18
  },
  quoteScript: {
    color: '#D97706',
    fontStyle: 'italic',
    fontWeight: '700'
  },
  quoteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16
  },
  quoteActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800'
  },
  footerWrap: {
    paddingHorizontal: 22,
    alignItems: 'center',
    textAlign: 'center',
    paddingBottom: 20
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  footerSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 6
  },
  footerPhone: {
    fontSize: 12,
    fontWeight: '700',
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
    padding: 24,
    paddingBottom: 38,
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
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  modalLocationBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  modalLocationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  modalDurationText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '700'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  modalDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 16
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16
  },
  guestStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
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
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center'
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C'
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EA580C'
  },
  confirmPlanBtn: {
    backgroundColor: '#EA580C',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmPlanBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
