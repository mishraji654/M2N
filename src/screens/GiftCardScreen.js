import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const GIFT_CARDS = [
  {
    id: 'gc-01',
    title: 'M2N Royal Palace Stay',
    amount: '₹25,000',
    description: 'Valid across any M2N Heritage Palace or Resort Suite. Includes royal high tea and breakfast.',
    code: 'ROYAL-M2N-25K',
    gradient: ['#0F172A', '#1E293B']
  },
  {
    id: 'gc-02',
    title: 'Zaarang Awadhi Dining Pass',
    amount: '₹5,000',
    description: 'Fine dining experience for two at Hotel Zaarang Lucknow with chef-curated royal tasting menu.',
    code: 'DINE-ZAARANG-5K',
    gradient: ['#EA580C', '#C2410C']
  },
  {
    id: 'gc-03',
    title: 'Weekend Escape Voucher',
    amount: '₹12,000',
    description: 'Perfect for coastal Goa villas or serene Shimla mountain lodges with late check-out privileges.',
    code: 'ESCAPE-M2N-12K',
    gradient: ['#1E293B', '#0F172A']
  }
];

export default function GiftCardScreen({ navigation }) {
  const [voucherCode, setVoucherCode] = useState('');

  const handleRedeem = () => {
    if (!voucherCode.trim()) {
      Alert.alert('Enter Code', 'Please enter your gift card or voucher code to redeem.');
      return;
    }
    Alert.alert(
      'Voucher Verified! 🎉',
      `Code "${voucherCode.trim().toUpperCase()}" is valid. ₹5,000 credit added to your M2N Cash balance!`,
      [{ text: 'Great', onPress: () => setVoucherCode('') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gift Cards</Text>
          <Text style={styles.headerSubtitle}>Give the gift of timeless luxury hospitality</Text>
        </View>

        <View style={styles.giftIconWrap}>
          <Ionicons name="gift" size={20} color="#EA580C" />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Redeem Section Box */}
        <View style={styles.redeemBox}>
          <Text style={styles.redeemTitle}>Have a Gift Card or Voucher?</Text>
          <Text style={styles.redeemSubtitle}>Enter your 16-digit voucher or promo code below:</Text>

          <View style={styles.redeemInputRow}>
            <TextInput
              style={styles.redeemInput}
              placeholder="e.g. ROYAL-M2N-25K"
              placeholderTextColor="#94A3B8"
              value={voucherCode}
              onChangeText={setVoucherCode}
              autoCapitalize="characters"
            />
            <Pressable
              style={({ pressed }) => [styles.redeemBtn, pressed && { opacity: 0.8 }]}
              onPress={handleRedeem}
            >
              <Text style={styles.redeemBtnText}>Redeem</Text>
            </Pressable>
          </View>
        </View>

        {/* Featured Gift Cards */}
        <Text style={styles.sectionHeading}>Curated Luxury Gift Cards</Text>

        {GIFT_CARDS.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <LinearGradient
              colors={card.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardTopRow}>
                <View>
                  <Text style={styles.cardBrand}>M2N HOTELS & RESORTS</Text>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
                <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="#FED7AA" />
              </View>

              <Text style={styles.cardDescription}>{card.description}</Text>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.amountLabel}>CARD VALUE</Text>
                  <Text style={styles.amountValue}>{card.amount}</Text>
                </View>

                <Pressable
                  style={styles.buyCardBtn}
                  onPress={() => Alert.alert('Purchase Gift Card', `Would you like to purchase ${card.title} for ${card.amount}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Proceed', onPress: () => navigation.navigate('Booking') }
                  ])}
                >
                  <Text style={styles.buyCardBtnText}>Buy Now</Text>
                  <Ionicons name="arrow-forward" size={13} color="#0F172A" />
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        ))}

        {/* Corporate & Bespoke Gifting */}
        <View style={styles.corporateBox}>
          <Ionicons name="sparkles" size={24} color="#EA580C" style={{ marginBottom: 6 }} />
          <Text style={styles.corporateTitle}>Corporate & Wedding Gifting</Text>
          <Text style={styles.corporateSubtitle}>
            Custom branded gift cards for executive rewards, weddings, and milestones with dedicated relationship managers.
          </Text>
          <Pressable
            style={styles.corporateBtn}
            onPress={() => navigation.navigate('MoreTab', { screen: 'Contact' })}
          >
            <Text style={styles.corporateBtnText}>Contact Concierge</Text>
            <Ionicons name="mail-outline" size={14} color="#EA580C" />
          </Pressable>
        </View>
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
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2
  },
  giftIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  redeemBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  redeemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  redeemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12
  },
  redeemInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  redeemInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700'
  },
  redeemBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.3
  },
  cardContainer: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between'
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardBrand: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FED7AA',
    letterSpacing: 1.2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 17,
    marginVertical: 12
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  amountLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FED7AA',
    letterSpacing: 0.8
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5
  },
  buyCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 5
  },
  buyCardBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  corporateBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'flex-start',
    marginTop: 8
  },
  corporateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  corporateSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12
  },
  corporateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 6
  },
  corporateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C'
  }
});
