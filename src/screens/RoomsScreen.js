import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rooms as initialRooms } from '../data/siteData';

const ALL_ROOMS = [
  ...initialRooms,
  {
    id: 'room-04',
    name: 'Cedar Mountain Lodge Suite',
    category: 'Mountain',
    subtitle: 'Heated cedarwood floors with panoramic snow-capped valley vista.',
    price: '₹7,200 / night',
    numericPrice: 7200,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85',
    features: ['Fireplace', 'Himalayan view', 'Cedar tub', 'Organic orchard breakfast', 'Personal guide']
  },
  {
    id: 'room-05',
    name: 'Lake Pichola Maharaja Suite',
    category: 'Palace',
    subtitle: 'Private marble jharokha overlooking illuminated historic ghats.',
    price: '₹11,800 / night',
    numericPrice: 11800,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
    features: ['Lake view', 'Butler service', 'Sunset boat cruise', 'Marble jacuzzi', 'Fine dining inclusion']
  }
];

const ROOM_FILTERS = ['All Suites', 'Royal Suites', 'Heritage Palace', 'Presidential & Villa'];

export default function RoomsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('All Suites');
  const [savedRooms, setSavedRooms] = useState({});

  const toggleBookmark = (roomId) => {
    setSavedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  const filteredRooms = ALL_ROOMS.filter((room) => {
    if (selectedFilter === 'All Suites') return true;
    if (selectedFilter === 'Royal Suites') return room.name.includes('Royal') || room.name.includes('Lodge');
    if (selectedFilter === 'Heritage Palace') return room.name.includes('Heritage') || room.name.includes('Maharaja');
    if (selectedFilter === 'Presidential & Villa') return room.name.includes('Presidential') || room.numericPrice >= 12000;
    return true;
  });

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
          <Text style={styles.headerTitle}>Rooms & Suites</Text>
          <Text style={styles.headerSubtitle}>Opulent Living & Modern Comfort</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {ROOM_FILTERS.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <Pressable
                key={f}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Room Cards List */}
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredRooms.map((room) => {
          const isSaved = !!savedRooms[room.id];
          return (
            <View key={room.id} style={styles.card}>
              <View style={styles.imageWrap}>
                <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />

                {/* Bookmark Button */}
                <Pressable
                  style={styles.bookmarkBtn}
                  onPress={() => toggleBookmark(room.id)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={isSaved ? '#EA580C' : '#0F172A'}
                  />
                </Pressable>

                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{room.price}</Text>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={styles.name}>{room.name}</Text>
                <Text style={styles.subtitle}>{room.subtitle}</Text>

                <View style={styles.featuresRow}>
                  {room.features?.slice(0, 4).map((f, idx) => (
                    <View key={idx} style={styles.featurePill}>
                      <Ionicons name="checkmark-sharp" size={12} color="#EA580C" style={{ marginRight: 3 }} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('RoomDetail', { room })}
                  >
                    <Text style={styles.detailBtnText}>Details</Text>
                    <Ionicons name="arrow-forward" size={14} color="#0F172A" />
                  </Pressable>

                  <Pressable
                    style={styles.bookNowBtn}
                    onPress={() => navigation.navigate('Booking', { room })}
                  >
                    <Text style={styles.bookNowText}>Book This Room</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
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
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9'
  },
  filterPillActive: {
    backgroundColor: '#0F172A'
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  filterTextActive: {
    color: '#FFFFFF'
  },
  page: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 16,
    paddingBottom: 110
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  imageWrap: {
    width: '100%',
    height: 190,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  body: {
    padding: 16
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  featureText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 14
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1'
  },
  detailBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700'
  },
  bookNowBtn: {
    flex: 1.5,
    backgroundColor: '#EA580C',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
