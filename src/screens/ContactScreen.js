import React from 'react';
import { ScrollView, View, Text, Linking, StyleSheet, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { contact } from '../data/siteData';
import { COLORS } from '../theme/colors';

export default function ContactScreen({ navigation }) {
  const openSite = () => Linking.openURL(contact.website);
  const openPhone = () => Linking.openURL(`tel:${contact.phone}`);
  const openEmail = () => Linking.openURL(`mailto:${contact.email}`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Contact & Concierge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Our global concierge desk is available 24/7 for bespoke booking requests, private transfers, and personalized itineraries.
        </Text>

        <View style={styles.card}>
          <Pressable style={styles.contactItem} onPress={openPhone}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.label}>PHONE</Text>
              <Text style={styles.value}>{contact.phone}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.contactItem} onPress={openEmail}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.label}>EMAIL</Text>
              <Text style={styles.value}>{contact.email}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.contactItem} onPress={openSite}>
            <View style={styles.iconCircle}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.label}>WEBSITE</Text>
              <Text style={styles.value}>{contact.website}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.contactItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.label}>HEADQUARTERS</Text>
              <Text style={styles.value}>{contact.address}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.9 }
          ]}
          onPress={() => navigation.navigate('Booking')}
        >
          <Text style={styles.primaryButtonText}>Request a Stay</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text
  },
  page: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  intro: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  contactInfo: {
    flex: 1
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 2
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700'
  }
});
