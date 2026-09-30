import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { hotels } from '../data/siteData';

export default function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState(hotels.slice(0, 3));

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.headerTitle}>Wishlist</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Saved luxury stays & dream destinations</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{wishlist.length} Saved</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {wishlist.length > 0 ? (
          wishlist.map((hotel) => (
            <Pressable
              key={hotel.id}
              style={({ pressed }) => [styles.hotelCard, pressed && { opacity: 0.95 }]}
              onPress={() => navigation.navigate('HotelDetail', { hotel })}
            >
              <Image source={{ uri: hotel.image }} style={styles.hotelImage} />

              <Pressable
                style={styles.bookmarkBtn}
                onPress={() => handleRemove(hotel.id)}
                hitSlop={10}
              >
                <Ionicons name="bookmark" size={20} color="#EA580C" />
              </Pressable>

              <View style={styles.hotelInfo}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                  <Text style={styles.reviewsText}>({hotel.reviews} reviews)</Text>
                </View>

                <Text style={styles.hotelName}>{hotel.name}</Text>
                <Text style={styles.hotelLocation}>
                  <Ionicons name="location-outline" size={13} color="#64748B" /> {hotel.location}
                </Text>

                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>STARTING FROM</Text>
                    <Text style={styles.priceValue}>
                      {hotel.price}<Text style={styles.pricePeriod}> / night</Text>
                    </Text>
                  </View>

                  <Pressable
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('Booking', { hotel })}
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bookmark-outline" size={40} color="#EA580C" />
            </View>
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Tap the bookmark icon on any luxury palace, resort, or villa to save your dream stay here.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('HotelsTab')}
            >
              <Text style={styles.exploreBtnText}>Discover Stays</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  badgePill: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2
  },
  countBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  countBadgeText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '800'
  },
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  hotelImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0'
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
  hotelInfo: {
    padding: 16
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  reviewsText: {
    fontSize: 11.5,
    color: '#94A3B8'
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  hotelLocation: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#EA580C',
    marginTop: 2
  },
  pricePeriod: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 6
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 24
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 8
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
