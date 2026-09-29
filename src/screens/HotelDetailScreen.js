import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { hotels, rooms } from '../data/siteData';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HotelDetailScreen({ route, navigation }) {
  const hotel = route.params?.hotel || hotels[0];
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Image Section */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: images[selectedImageIndex] || hotel.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.2)']}
            style={StyleSheet.absoluteFill}
          />

          {/* Floating Top Header Buttons */}
          <SafeAreaView style={styles.floatingHeader}>
            <Pressable
              style={({ pressed }) => [styles.headerButton, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View style={styles.headerRightGroup}>
              <Pressable
                style={({ pressed }) => [styles.headerButton, pressed && { opacity: 0.8 }]}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? COLORS.heart : '#FFFFFF'}
                />
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Image indicator dots if multiple images */}
          {images.length > 1 && (
            <View style={styles.paginationDots}>
              {images.map((_, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedImageIndex(idx)}
                  style={[
                    styles.dot,
                    selectedImageIndex === idx && styles.activeDot
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Overlapping Content Sheet (Exact Dribbble layout) */}
        <View style={styles.contentSheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Title and Rating Line */}
          <Text style={styles.hotelTitle}>{hotel.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{hotel.location}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="star" size={15} color={COLORS.star} style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>
                {hotel.rating}{' '}
                <Text style={styles.reviewsCountText}>({hotel.reviewsCount || 12}) Reviews</Text>
              </Text>
            </View>
          </View>

          {/* Amenities / Specs Row Chips (Exact Dribbble 3rd phone) */}
          <View style={styles.specsRow}>
            <View style={styles.specChip}>
              <Ionicons name="people-outline" size={17} color={COLORS.primary} style={styles.specIcon} />
              <Text style={styles.specText}>{hotel.guests || 4} Guests</Text>
            </View>

            <View style={styles.specChip}>
              <Ionicons name="bed-outline" size={17} color={COLORS.primary} style={styles.specIcon} />
              <Text style={styles.specText}>{hotel.beds || 2} Beds</Text>
            </View>

            <View style={styles.specChip}>
              <Ionicons name="water-outline" size={17} color={COLORS.primary} style={styles.specIcon} />
              <Text style={styles.specText}>{hotel.bath || 2} Bath</Text>
            </View>
          </View>

          {/* Description Section with Read More toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={isDescriptionExpanded ? undefined : 3}
            >
              {hotel.description}
            </Text>
            <Pressable
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              hitSlop={8}
            >
              <Text style={styles.readMoreText}>
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </Text>
            </Pressable>
          </View>

          {/* Facilities / Highlights Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.facilitiesGrid}>
              {(hotel.amenities || ['Infinity Pool', 'Free Wi-Fi', 'Luxury Spa', '24/7 Room Service']).map((item, idx) => (
                <View key={idx} style={styles.facilityBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.facilityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Rooms Preview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Rooms</Text>
            {rooms.slice(0, 2).map((room) => (
              <Pressable
                key={room.id}
                style={({ pressed }) => [styles.roomPreviewCard, pressed && { opacity: 0.9 }]}
                onPress={() => navigation.navigate('RoomDetail', { room })}
              >
                <Image source={{ uri: room.image }} style={styles.roomImage} />
                <View style={styles.roomInfo}>
                  <Text style={styles.roomTitle}>{room.name}</Text>
                  <Text style={styles.roomSubtitle} numberOfLines={1}>{room.subtitle}</Text>
                  <Text style={styles.roomPrice}>{room.price}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar (Exact StayEase Dribbble style) */}
      <View style={styles.bottomBar}>
        <View style={styles.priceColumn}>
          <Text style={styles.bottomPrice}>
            {hotel.price}
          </Text>
          <Text style={styles.bottomPriceLabel}>Per Night</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.bookNowButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
          ]}
          onPress={() => navigation.navigate('Booking', { hotel })}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 110
  },
  heroWrapper: {
    height: 380,
    width: '100%',
    position: 'relative'
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  floatingHeader: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paginationDots: {
    position: 'absolute',
    bottom: 46,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4
  },
  activeDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white
  },
  contentSheet: {
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 18
  },
  hotelTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.4,
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700'
  },
  reviewsCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '400'
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6
  },
  specIcon: {
    marginRight: 6
  },
  specText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 10
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  facilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  facilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text
  },
  roomPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12
  },
  roomInfo: {
    flex: 1
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text
  },
  roomSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  roomPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10
  },
  priceColumn: {
    justifyContent: 'center'
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text
  },
  bottomPriceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 38,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  },
  bookNowText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  }
});
