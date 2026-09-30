import React from 'react';
import {
  ScrollView,
  Image,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function RoomDetailScreen({ route, navigation }) {
  const room = route.params?.room;

  const [isBookmarked, setIsBookmarked] = React.useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: room.image }} style={styles.hero} resizeMode="cover" />

          {/* Floating Back & Bookmark Button */}
          <SafeAreaView style={styles.floatingHeader} edges={['top']}>
            <Pressable
              style={({ pressed }) => [styles.headerButton, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.headerButton, pressed && { opacity: 0.8 }]}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? COLORS.primary : '#FFFFFF'}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Content Sheet */}
        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <Text style={styles.eyebrow}>PREMIUM ACCOMMODATION</Text>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.subtitle}>{room.subtitle}</Text>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Room Features</Text>
            <View style={styles.featuresGrid}>
              {room.features?.map((f, idx) => (
                <View key={idx} style={styles.featureChip}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceColumn}>
          <Text style={styles.priceValue}>{room.price}</Text>
          <Text style={styles.priceLabel}>All inclusive</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
          ]}
          onPress={() => navigation.navigate('Booking', { room })}
        >
          <Text style={styles.bookButtonText}>Book This Room</Text>
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
  page: {
    flex: 1
  },
  content: {
    paddingBottom: 110
  },
  heroWrapper: {
    height: 340,
    position: 'relative'
  },
  hero: {
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
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingTop: 16
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 6
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.4,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 20
  },
  section: {
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text
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
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textMuted
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
