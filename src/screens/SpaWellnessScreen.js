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
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TREATMENTS = [
  {
    id: 'spa-01',
    name: 'Royal Abhyanga Massage',
    category: 'Ayurvedic Therapies',
    duration: '75 Minutes',
    price: '₹4,800',
    numericPrice: 4800,
    botanicals: 'Bala Ashwagandha • Sesame Oil',
    description: 'Traditional Ayurvedic synchronized full-body massage using warm herb-infused medicated oils to improve vitality, ease joint stiffness and eliminate toxins.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'spa-02',
    name: 'Shirodhara Mind & Soul Bliss',
    category: 'Ayurvedic Therapies',
    duration: '60 Minutes',
    price: '₹5,200',
    numericPrice: 5200,
    botanicals: 'Brahmi • Ksheerabala • Vetiver',
    description: 'A gentle, continuous stream of warm medicated herbal oil poured over the third-eye chakra to dissolve mental fatigue, insomnia, and anxiety.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'spa-03',
    name: 'Palace Rose Petal & Milk Bath',
    category: 'Wellness Baths',
    duration: '45 Minutes',
    price: '₹3,800',
    numericPrice: 3800,
    botanicals: 'Damask Roses • Sandalwood • Raw Milk',
    description: 'Soak in a hand-carved marble tub filled with fragrant wild roses, raw milk, almond oil and pure Mysore sandalwood for deep cellular hydration.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'spa-04',
    name: 'Himalayan Cedarwood Deep Tissue',
    category: 'Ayurvedic Therapies',
    duration: '90 Minutes',
    price: '₹6,500',
    numericPrice: 6500,
    botanicals: 'Cedarwood Pine • Warm Basalt Stones',
    description: 'Volcanic heated basalt stones paired with high-altitude Himalayan pine extracts targeting deep myofascial tension and muscular fatigue.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'spa-05',
    name: 'Kashmiri Saffron Radiance Glow',
    category: 'Facial & Glow',
    duration: '60 Minutes',
    price: '₹5,000',
    numericPrice: 5000,
    botanicals: 'Kashmiri Mogra Saffron • Rosehip',
    description: 'A luxurious royal complexion ritual incorporating organic saffron strands, gold leaf serum, and cold jade rollers for immediate luminescent skin.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f55a1532f64?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'spa-06',
    name: 'Couples Imperial Harmony Ritual',
    category: 'Couples Rituals',
    duration: '120 Minutes',
    price: '₹11,500',
    numericPrice: 11500,
    botanicals: 'Jasmine • Lotus • Frankincense',
    description: 'Private candlelit spa pavilion suite, dual synchronized Abhyanga massages, rose petal steam bath, private jacuzzi and chilled pomegranate elixir.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85'
  }
];

const CATEGORIES = ['All Treatments', 'Ayurvedic Therapies', 'Couples Rituals', 'Wellness Baths', 'Facial & Glow'];

export default function SpaWellnessScreen({ navigation }) {
  const [selectedCat, setSelectedCat] = useState('All Treatments');
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filtered = selectedCat === 'All Treatments'
    ? TREATMENTS
    : TREATMENTS.filter(t => t.category === selectedCat);

  const handleBook = (treatment) => {
    setSelectedTreatment(treatment);
  };

  const handleConfirmReservation = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedTreatment(null);
      Alert.alert(
        'Spa Reserved',
        `Your appointment for "${selectedTreatment?.name}" has been reserved with our Ayurvedic Master. Pay upon arrival or room bill.`
      );
    }, 1000);
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
          <Text style={styles.headerTitle}>Spa & Wellness</Text>
          <Text style={styles.headerSub}>Ancient Ayurveda & Royal Rejuvenation</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Category Pills */}
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

      {/* Main Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Sanctuary Banner */}
        <View style={styles.sanctuaryBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85' }}
            style={styles.sanctuaryBg}
          />
          <View style={styles.sanctuaryOverlay} />
          <View style={styles.sanctuaryTextWrap}>
            <View style={styles.sanctuaryBadge}>
              <MaterialCommunityIcons name="flower-tulip" size={14} color="#EA580C" />
              <Text style={styles.sanctuaryBadgeText}>HERITAGE WELLNESS</Text>
            </View>
            <Text style={styles.sanctuaryTitle}>Restoring Natural Harmony</Text>
            <Text style={styles.sanctuaryDesc}>
              Certified Ayurvedic Vaidyas, custom dosha consultations, and organic Himalayan botanicals.
            </Text>
          </View>
        </View>

        {/* Treatments List */}
        <Text style={styles.sectionHeading}>SIGNATURE SPA THERAPIES</Text>

        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImg} resizeMode="cover" />

            <View style={styles.cardBody}>
              <View style={styles.cardMetaRow}>
                <View style={styles.durationPill}>
                  <Ionicons name="time-outline" size={12} color="#EA580C" />
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <Text style={styles.priceTag}>{item.price}</Text>
              </View>

              <Text style={styles.treatmentName}>{item.name}</Text>
              <Text style={styles.botanicalsText}>
                Botanicals: <Text style={{ color: '#0F172A', fontWeight: '600' }}>{item.botanicals}</Text>
              </Text>

              <Text style={styles.treatmentDesc}>{item.description}</Text>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.9 }]}
                onPress={() => handleBook(item)}
              >
                <Text style={styles.bookBtnText}>Reserve Appointment</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Appointment Modal Sheet */}
      <Modal
        visible={!!selectedTreatment}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTreatment(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedTreatment(null)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Confirm Spa Reservation</Text>
            <Text style={styles.modalSub}>
              {selectedTreatment?.name} • {selectedTreatment?.duration}
            </Text>

            <View style={styles.modalDetailsCard}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Therapy Cost</Text>
                <Text style={styles.modalVal}>{selectedTreatment?.price}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Location</Text>
                <Text style={styles.modalVal}>M2N Royal Spa Pavilion</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Consultation</Text>
                <Text style={styles.modalVal}>Complimentary Dosha Assessment</Text>
              </View>
            </View>

            <Pressable
              style={styles.confirmModalBtn}
              onPress={handleConfirmReservation}
            >
              <Text style={styles.confirmModalBtnText}>
                {bookingSuccess ? 'Booking Confirmed ✓' : 'Confirm Spa Session'}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  sanctuaryBanner: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20
  },
  sanctuaryBg: {
    width: '100%',
    height: '100%'
  },
  sanctuaryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)'
  },
  sanctuaryTextWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18
  },
  sanctuaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6
  },
  sanctuaryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  sanctuaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  sanctuaryDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 14,
    marginLeft: 2
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  cardImg: {
    width: '100%',
    height: 160
  },
  cardBody: {
    padding: 16
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C'
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  botanicalsText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8
  },
  treatmentDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    height: 46,
    borderRadius: 12
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18
  },
  modalDetailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  modalLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  modalVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  confirmModalBtn: {
    backgroundColor: '#0F172A',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmModalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
