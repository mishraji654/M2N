import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AboutScreen({ navigation }) {
  const menuItems = [
    {
      icon: 'sparkles-outline',
      title: 'Experience Welcome Screen',
      subtitle: 'Preview the StayEase luxury onboarding screen',
      onPress: () => navigation.navigate('Onboarding')
    },
    {
      icon: 'calendar-outline',
      title: 'My Reservations',
      subtitle: 'Manage dates, check-in, and guest preferences',
      onPress: () => navigation.navigate('Booking')
    },
    {
      icon: 'call-outline',
      title: 'Contact Concierge',
      subtitle: '24/7 dedicated assistance and VIP services',
      onPress: () => navigation.navigate('Contact')
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profile & More</Text>

        {/* User Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Morgan</Text>
            <Text style={styles.profileRole}>StayEase VIP Member</Text>
          </View>
          <View style={styles.vipBadge}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} style={{ marginRight: 3 }} />
            <Text style={styles.vipBadgeText}>VIP</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Preferences & Actions</Text>

          {menuItems.map((item, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: '#F1F5F9' }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* About App Info */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutHeading}>About StayEase</Text>
          <Text style={styles.aboutText}>
            StayEase connects discerning travelers with the world’s most iconic hotels and luxury escapes.
            Curated architecture, uncompromised hospitality, and seamless bookings.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0 • StayEase Mobile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  page: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 20
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4
  },
  profileRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  vipBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  menuTextContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  aboutCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: 12
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500'
  }
});
