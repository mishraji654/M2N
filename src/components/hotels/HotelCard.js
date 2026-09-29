import React, { useState, useRef } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function HotelCard({ hotel, onPress, featured = true }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.45, friction: 3, tension: 80, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
    ]).start();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && { transform: [{ scale: 0.985 }] }
      ]}
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: hotel.image }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={13} color={COLORS.star} style={{ marginRight: 4 }} />
            <Text style={styles.ratingText}>{hotel.rating}</Text>
          </View>

          {/* Heart / Favorite Button with Spring Bounce */}
          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? COLORS.heart : '#FFFFFF'}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Bottom Image Gradient Overlay for High Readability */}
        <LinearGradient
          colors={['transparent', 'rgba(10, 20, 30, 0.4)', 'rgba(6, 15, 25, 0.88)']}
          style={styles.gradientOverlay}
        />

        {/* Bottom Details Overlaid on Image (Exact Dribbble Style) */}
        <View style={styles.overlayContent}>
          <View style={styles.infoLeft}>
            <Text style={styles.hotelName} numberOfLines={1}>
              {hotel.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="#D1D5DB" style={{ marginRight: 3 }} />
              <Text style={styles.locationText} numberOfLines={1}>
                {hotel.location}
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {hotel.price}
              <Text style={styles.priceUnit}>/night</Text>
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6
  },
  imageWrapper: {
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  topBadgesRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700'
  },
  favoriteButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120
  },
  overlayContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2
  },
  infoLeft: {
    flex: 1,
    marginRight: 12
  },
  hotelName: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '400'
  },
  priceContainer: {
    alignItems: 'flex-end'
  },
  priceText: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '800'
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#D1D5DB'
  }
});
