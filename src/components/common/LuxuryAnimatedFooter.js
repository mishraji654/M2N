import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  TextInput,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brand } from '../../data/siteData';

const DESTINATION_PILLS = [
  { name: 'Lucknow', code: 'LKO', sub: 'Flagship Zaarang' },
  { name: 'Jaipur', code: 'JAI', sub: 'Heritage Palace' },
  { name: 'Shimla', code: 'SML', sub: 'Mountain Retreat' },
  { name: 'Udaipur', code: 'UDR', sub: 'Royal Lakehouse' },
  { name: 'Goa', code: 'GOA', sub: 'Coastal Haven' }
];

export default function LuxuryAnimatedFooter({ navigation, onScrollToTop, showToast }) {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Animations
  const emblemPulse = useRef(new Animated.Value(1)).current;
  const arrowBounce = useRef(new Animated.Value(0)).current;
  const conciergeGlow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Gentle continuous pulse on brand emblem
    Animated.loop(
      Animated.sequence([
        Animated.timing(emblemPulse, {
          toValue: 1.08,
          duration: 1600,
          useNativeDriver: true
        }),
        Animated.timing(emblemPulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true
        })
      ])
    ).start();

    // 2. Up & Down bounce on "Back to top" arrow
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowBounce, {
          toValue: -5,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(arrowBounce, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true
        })
      ])
    ).start();

    // 3. Subtle Concierge Card glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(conciergeGlow, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(conciergeGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [emblemPulse, arrowBounce, conciergeGlow]);

  const handleSubscribe = () => {
    if (!emailInput || !emailInput.includes('@')) {
      if (showToast) showToast('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    if (showToast) showToast('👑 Welcome to The M2N Circle! Check your inbox.');
    setEmailInput('');
  };

  const handleDestinationPress = (dest) => {
    if (showToast) showToast(`📍 Exploring M2N ${dest.name}: ${dest.sub}`);
    if (navigation) navigation.navigate('HotelsTab');
  };

  return (
    <View style={styles.footerContainer}>
      {/* Golden Gradient Accent Border Top */}
      <View style={styles.topAccentBorder} />

      {/* ================================================================= */}
      {/* 1. BRAND HEADER & STORY                                           */}
      {/* ================================================================= */}
      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <Animated.View style={[styles.emblemBadge, { transform: [{ scale: emblemPulse }] }]}>
            <Ionicons name="sparkles" size={18} color="#EA580C" />
          </Animated.View>
          <View>
            <Text style={styles.brandName}>M2N HOTELS & RESORTS</Text>
            <Text style={styles.brandTagline}>Stay Better, Grow Together</Text>
          </View>
        </View>

        {/* Back to Top Floating Action */}
        <Pressable
          style={({ pressed }) => [styles.backToTopBtn, pressed && { opacity: 0.8 }]}
          onPress={onScrollToTop}
        >
          <Animated.View style={{ transform: [{ translateY: arrowBounce }] }}>
            <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.backToTopText}>TOP</Text>
        </Pressable>
      </View>

      <Text style={styles.brandStory}>
        Where architecture breathes and time stands still. Five signature addresses across India, one discipline of restraint.
      </Text>

      {/* ================================================================= */}
      {/* 2. INTERACTIVE DESTINATIONS STRIP                                 */}
      {/* ================================================================= */}
      <Text style={styles.stripTitle}>EXPLORE OUR DESTINATIONS</Text>
      <View style={styles.destPillsWrap}>
        {DESTINATION_PILLS.map((dest) => (
          <Pressable
            key={dest.code}
            style={({ pressed }) => [
              styles.destPill,
              pressed && { transform: [{ scale: 0.95 }], backgroundColor: '#EA580C' }
            ]}
            onPress={() => handleDestinationPress(dest)}
          >
            <Text style={styles.destCode}>{dest.code}</Text>
            <Text style={styles.destName}>{dest.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* ================================================================= */}
      {/* 3. CONCIERGE HOTLINE CARD (ANIMATED PULSE)                       */}
      {/* ================================================================= */}
      <Animated.View style={[styles.conciergeCard, { transform: [{ scale: conciergeGlow }] }]}>
        <View style={styles.conciergeLeft}>
          <View style={styles.conciergeIconWrap}>
            <Ionicons name="call" size={20} color="#EA580C" />
          </View>
          <View>
            <Text style={styles.conciergeCardTitle}>24/7 VIP Concierge & Bookings</Text>
            <Text style={styles.conciergeCardPhone}>{brand.phone}</Text>
            <Text style={styles.conciergeCardEmail}>{brand.email}</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.callNowBtn, pressed && { opacity: 0.85 }]}
          onPress={() => showToast && showToast(`Dialing Concierge: ${brand.phone}`)}
        >
          <Text style={styles.callNowBtnText}>Call Now</Text>
        </Pressable>
      </Animated.View>

      {/* ================================================================= */}
      {/* 4. NAVIGATION COLUMNS                                             */}
      {/* ================================================================= */}
      <View style={styles.columnsGrid}>
        {/* Col 1 */}
        <View style={styles.navCol}>
          <Text style={styles.colHeader}>HOTELS</Text>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Flagship Zaarang, Lucknow</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Heritage Palace, Jaipur</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Mountain Retreat, Shimla</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Royal Residency, Udaipur</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Coastal Haven Villa, Goa</Text>
          </Pressable>
        </View>

        {/* Col 2 */}
        <View style={styles.navCol}>
          <Text style={styles.colHeader}>DISCOVER</Text>
          <Pressable onPress={() => navigation && navigation.navigate('HotelsTab')}>
            <Text style={styles.colLink}>Rooms & Suites</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('DiningTab')}>
            <Text style={styles.colLink}>Restaurant & Dine-In</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('GalleryTab')}>
            <Text style={styles.colLink}>Curated Experiences</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('WeddingsTab')}>
            <Text style={styles.colLink}>Weddings & Banquets</Text>
          </Pressable>
          <Pressable onPress={() => showToast && showToast('🌿 M2N Ayurvedic Spa: Available at all properties')}>
            <Text style={styles.colLink}>Spa & Wellness</Text>
          </Pressable>
        </View>

        {/* Col 3 */}
        <View style={styles.navCol}>
          <Text style={styles.colHeader}>PRIVILEGES</Text>
          <Pressable onPress={() => showToast && showToast('⭐ M2N Reserve: 1,250 points available')}>
            <Text style={styles.colLink}>M2N Reserve Club</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('MoreTab', { screen: 'Booking' })}>
            <Text style={styles.colLink}>My Reservations</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('MoreTab', { screen: 'Contact' })}>
            <Text style={styles.colLink}>Contact Concierge</Text>
          </Pressable>
          <Pressable onPress={() => navigation && navigation.navigate('MoreTab', { screen: 'Login' })}>
            <Text style={styles.colLink}>VIP Member Sign In</Text>
          </Pressable>
        </View>
      </View>

      {/* ================================================================= */}
      {/* 5. NEWSLETTER: THE M2N CIRCLE                                     */}
      {/* ================================================================= */}
      <View style={styles.newsletterCard}>
        <View style={styles.newsletterHeader}>
          <Ionicons name="mail-open-outline" size={18} color="#EA580C" style={{ marginRight: 6 }} />
          <Text style={styles.newsletterTitle}>THE M2N CIRCLE</Text>
        </View>
        <Text style={styles.newsletterSubtitle}>
          Receive private invitations, seasonal dining menus, and exclusive advance-booking privileges.
        </Text>

        <View style={styles.newsletterInputRow}>
          <TextInput
            style={styles.newsletterInput}
            placeholder="Enter your email address..."
            placeholderTextColor="#64748B"
            value={emailInput}
            onChangeText={setEmailInput}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Pressable
            style={({ pressed }) => [styles.subscribeBtn, pressed && { opacity: 0.85 }]}
            onPress={handleSubscribe}
          >
            <Text style={styles.subscribeBtnText}>
              {isSubscribed ? 'Joined ✓' : 'Subscribe'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ================================================================= */}
      {/* 6. SOCIAL & COPYRIGHT BOTTOM ROW                                  */}
      {/* ================================================================= */}
      <View style={styles.socialRow}>
        <Pressable
          style={styles.socialIconBtn}
          onPress={() => showToast && showToast('📸 Instagram: @m2nhotels')}
        >
          <Ionicons name="logo-instagram" size={17} color="#E2E8F0" />
        </Pressable>
        <Pressable
          style={styles.socialIconBtn}
          onPress={() => showToast && showToast('💼 LinkedIn: M2N Group')}
        >
          <Ionicons name="logo-linkedin" size={17} color="#E2E8F0" />
        </Pressable>
        <Pressable
          style={styles.socialIconBtn}
          onPress={() => showToast && showToast('🌐 Website: m2nhotels.com')}
        >
          <Ionicons name="globe-outline" size={17} color="#E2E8F0" />
        </Pressable>
      </View>

      <View style={styles.bottomDivider} />

      <View style={styles.copyrightRow}>
        <Text style={styles.copyrightText}>
          © 2026 M2N Group of Hotels & Resorts. All Rights Reserved.
        </Text>
        <Text style={styles.heritageNote}>
          Handcrafted with architectural restraint & luxury precision.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#0A0F1D', // Obsidian Luxury Slate
    marginTop: 40,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'relative',
    overflow: 'hidden'
  },
  topAccentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EA580C'
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  emblemBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(234, 88, 12, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.45)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2
  },
  brandTagline: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '600',
    marginTop: 1
  },
  backToTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  backToTopText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  brandStory: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 580
  },

  // Destinations Strip
  stripTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 2,
    marginBottom: 10
  },
  destPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 26
  },
  destPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6
  },
  destCode: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 0.5
  },
  destName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F1F5F9'
  },

  // Concierge Card
  conciergeCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.35)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 12
  },
  conciergeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 220
  },
  conciergeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.3)'
  },
  conciergeCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1
  },
  conciergeCardPhone: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2
  },
  conciergeCardEmail: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1
  },
  callNowBtn: {
    backgroundColor: '#EA580C',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 20,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3
  },
  callNowBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },

  // Columns
  columnsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 22,
    marginBottom: 32
  },
  navCol: {
    minWidth: 140,
    flex: 1
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: 12
  },
  colLink: {
    fontSize: 12.5,
    color: '#CBD5E1',
    marginBottom: 9,
    fontWeight: '500'
  },

  // Newsletter
  newsletterCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 28
  },
  newsletterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  newsletterTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 2
  },
  newsletterSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 14
  },
  newsletterInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  newsletterInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 8
  },
  subscribeBtn: {
    backgroundColor: '#EA580C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },

  // Social & Copyright
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 18
  },
  socialIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  bottomDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16
  },
  copyrightRow: {
    alignItems: 'center',
    gap: 4
  },
  copyrightText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center'
  },
  heritageNote: {
    fontSize: 10.5,
    color: '#475569',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});
