import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { exclusiveOffers } from '../data/siteData';

const ALL_OFFERS = [
  {
    id: 'off-01',
    category: 'Stay Deals',
    badge: '25% OFF',
    title: 'Early Bird Summer Palace Retreat',
    property: 'M2N Heritage Palace, Jaipur',
    code: 'ROYAL25',
    validity: 'Valid till 30 Nov 2026',
    description: 'Book 30 days in advance and enjoy 25% off royal suites with complimentary airport transfers and heritage high tea.',
    originalPrice: '₹12,000',
    discountedPrice: '₹9,000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'off-02',
    category: 'Dining & Spa',
    badge: 'COMPLIMENTARY',
    title: 'Ayurvedic Royal Spa Rejuvenation',
    property: 'Jaipur & Udaipur Properties',
    code: 'ROYALSPA',
    validity: 'Valid on 2+ Nights Stay',
    description: 'Complimentary 60-minute couples Abhyanga therapy & steam bath included with all Executive Suite reservations.',
    originalPrice: '₹7,500',
    discountedPrice: 'FREE',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'off-03',
    category: 'Stay Deals',
    badge: 'STAY 3 PAY 2',
    title: 'Himalayan Long Weekend Escape',
    property: 'M2N Mountain Retreat, Shimla',
    code: 'SHIMLA3FOR2',
    validity: 'Valid through winter season',
    description: 'Extend your mountain sanctuary stay. Book 2 consecutive nights in Cedar Suites and get the 3rd night on us.',
    originalPrice: '₹21,600',
    discountedPrice: '₹14,400',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'off-04',
    category: 'Dining & Spa',
    badge: '20% OFF',
    title: 'Awadhi Dastarkhwan Dining Experience',
    property: 'Zaarang Hotel, Lucknow',
    code: 'DASTARKHWAN20',
    validity: 'Valid for Dinner Bookings',
    description: 'Experience 7-course authentic royal Awadhi banquet curated by Master Chef with 20% privilege savings.',
    originalPrice: '₹4,500',
    discountedPrice: '₹3,600',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'off-05',
    category: 'Honeymoon & Wedding',
    badge: 'ROYAL PERK',
    title: 'Destination Wedding Suite Upgrade',
    property: 'All Restored Palace Venues',
    code: 'WEDM2N',
    validity: 'For Weddings Booked in 2026',
    description: 'Book banquet & wedding accommodation for 50+ guests and receive a complimentary Presidential Suite upgrade for the couple.',
    originalPrice: '₹45,000',
    discountedPrice: 'INCLUDED',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85'
  }
];

const CATEGORIES = ['All Offers', 'Stay Deals', 'Dining & Spa', 'Honeymoon & Wedding'];

export default function OffersScreen({ navigation }) {
  const [selectedCat, setSelectedCat] = useState('All Offers');
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredOffers = selectedCat === 'All Offers'
    ? ALL_OFFERS
    : ALL_OFFERS.filter(o => o.category === selectedCat);

  const handleCopyCode = (code) => {
    setCopiedCode(code);
    Alert.alert('Coupon Applied', `Code "${code}" copied! It will be automatically applied at checkout.`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Offers & Privileges</Text>
          <Text style={styles.headerSub}>Exclusive luxury seasonal discounts</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Category Filter Pills */}
      <View style={styles.catBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Offers Cards List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOffers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: offer.image }} style={styles.offerImg} resizeMode="cover" />
              <View style={styles.badgeWrap}>
                <Text style={styles.badgeText}>{offer.badge}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.propertyRow}>
                <Ionicons name="location-outline" size={13} color="#EA580C" />
                <Text style={styles.propertyText}>{offer.property}</Text>
              </View>

              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDesc}>{offer.description}</Text>

              {/* Price & Validity */}
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.validityText}>{offer.validity}</Text>
                  <View style={styles.priceLine}>
                    <Text style={styles.discountedPrice}>{offer.discountedPrice}</Text>
                    {offer.originalPrice ? (
                      <Text style={styles.origPrice}>{offer.originalPrice}</Text>
                    ) : null}
                  </View>
                </View>

                {/* Promo Code Pill with Copy Action */}
                <Pressable
                  style={styles.codePill}
                  onPress={() => handleCopyCode(offer.code)}
                >
                  <Ionicons name="pricetag-outline" size={14} color="#EA580C" />
                  <Text style={styles.codeText}>{offer.code}</Text>
                  <Text style={styles.copyLabel}>
                    {copiedCode === offer.code ? 'COPIED' : 'COPY'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.claimBtn, pressed && { opacity: 0.9 }]}
                onPress={() => navigation.navigate('HotelsTab')}
              >
                <Text style={styles.claimBtnText}>Claim Offer & Book Stay</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        maxWidth: 480,
        marginHorizontal: 'auto',
        minHeight: '100vh'
      }
    })
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  catBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9'
  },
  catPillActive: {
    backgroundColor: '#0F172A'
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  catPillTextActive: {
    color: '#FFFFFF'
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  imageWrap: {
    width: '100%',
    height: 180,
    position: 'relative'
  },
  offerImg: {
    width: '100%',
    height: '100%'
  },
  badgeWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  cardBody: {
    padding: 16
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6
  },
  propertyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C'
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 22
  },
  offerDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 14
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  validityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  origPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through'
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#EA580C',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C'
  },
  copyLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9A3412',
    marginLeft: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 14
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    height: 46,
    borderRadius: 12
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
