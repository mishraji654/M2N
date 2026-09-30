import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function BookingForm({ selectedHotel, selectedRoom, navigation: propNavigation }) {
  const hookNav = useNavigation();
  const nav = propNavigation || hookNav;
  const isNavigatingRef = useRef(false);

  const [name, setName] = useState('Ansh Yadav');
  const [email, setEmail] = useState('anshyadav@m2nhotels.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [checkIn, setCheckIn] = useState('15 Oct 2026');
  const [checkOut, setCheckOut] = useState('18 Oct 2026');
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  const propertyName = selectedHotel?.name || selectedRoom?.name || 'Zaarang Hotel & Suites';
  const propertyLoc = selectedHotel?.location || 'Lucknow, Uttar Pradesh';

  const pricePerNight = selectedHotel?.numericPrice || selectedRoom?.numericPrice || 4500;
  const nights = 3;
  const subtotal = pricePerNight * nights * roomsCount;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleProceedToPayment = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1200);

    const finalGuestName = name.trim() || 'Ansh Yadav';
    const finalPhone = phone.trim() || '+91 98765 43210';
    const finalEmail = email.trim() || 'anshyadav@m2nhotels.com';

    if (nav) {
      nav.navigate('Payment', {
        bookingData: {
          hotelName: propertyName,
          location: propertyLoc,
          pricePerNight,
          nights,
          roomsCount,
          guestsCount,
          subtotal,
          taxes,
          total,
          checkIn,
          checkOut,
          name: finalGuestName,
          email: finalEmail,
          phone: finalPhone,
          image: selectedHotel?.image || selectedRoom?.image
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. RESERVATION COST BREAKDOWN (INR / ₹) */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.summaryHotelName} numberOfLines={1}>
              {propertyName}
            </Text>
            <Text style={styles.summaryLocation}>
              <Ionicons name="location-outline" size={13} color="#64748B" /> {propertyLoc}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryRate}>
              ₹{pricePerNight.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.summaryPerNight}>per night</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>
            ₹{pricePerNight.toLocaleString('en-IN')} × {nights} nights ({roomsCount} room)
          </Text>
          <Text style={styles.calcValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Hospitality GST & Luxury Taxes (12%)</Text>
          <Text style={styles.calcValue}>₹{taxes.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalSub}>All inclusive of taxes & fees</Text>
          </View>
          <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* 2. GUESTS & ROOMS COUNTERS */}
      <View style={styles.countersRow}>
        <View style={styles.counterBox}>
          <Text style={styles.counterLabel}>GUESTS</Text>
          <View style={styles.counterControls}>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setGuestsCount(Math.max(1, guestsCount - 1))}
            >
              <Ionicons name="remove" size={16} color="#0F172A" />
            </Pressable>
            <Text style={styles.counterNumber}>{guestsCount}</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setGuestsCount(guestsCount + 1)}
            >
              <Ionicons name="add" size={16} color="#0F172A" />
            </Pressable>
          </View>
        </View>

        <View style={styles.counterBox}>
          <Text style={styles.counterLabel}>ROOMS</Text>
          <View style={styles.counterControls}>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setRoomsCount(Math.max(1, roomsCount - 1))}
            >
              <Ionicons name="remove" size={16} color="#0F172A" />
            </Pressable>
            <Text style={styles.counterNumber}>{roomsCount}</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setRoomsCount(roomsCount + 1)}
            >
              <Ionicons name="add" size={16} color="#0F172A" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* 3. GUEST INFORMATION */}
      <View style={styles.fieldsGroup}>
        <Text style={styles.fieldSectionHeading}>Primary Guest Details</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name (as on ID proof)"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder="Email Address for E-Voucher"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder="Contact Number (+91)"
            placeholderTextColor="#94A3B8"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* 4. STAY DATES */}
      <View style={styles.datesRow}>
        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
          <Ionicons name="calendar-outline" size={18} color="#EA580C" style={styles.inputIcon} />
          <View>
            <Text style={styles.miniLabel}>CHECK-IN</Text>
            <TextInput
              value={checkIn}
              onChangeText={setCheckIn}
              style={styles.dateInput}
            />
          </View>
        </View>

        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
          <Ionicons name="calendar-outline" size={18} color="#EA580C" style={styles.inputIcon} />
          <View>
            <Text style={styles.miniLabel}>CHECK-OUT</Text>
            <TextInput
              value={checkOut}
              onChangeText={setCheckOut}
              style={styles.dateInput}
            />
          </View>
        </View>
      </View>

      {/* 5. CONFIRM & PROCEED TO PAYMENT BUTTON */}
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] }
        ]}
        onPress={handleProceedToPayment}
      >
        <Text style={styles.submitButtonText}>Confirm & Book Stay</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
      </Pressable>

      <View style={styles.securityRow}>
        <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
        <Text style={styles.securityText}>Free cancellation up to 48h before check-in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    padding: 16
  },
  summaryCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryHotelName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  summaryLocation: {
    fontSize: 13,
    color: '#64748B'
  },
  summaryRate: {
    fontSize: 20,
    fontWeight: '900',
    color: '#EA580C'
  },
  summaryPerNight: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  calcLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  totalSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EA580C'
  },
  countersRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20
  },
  counterBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  fieldsGroup: {
    marginBottom: 16
  },
  fieldSectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 52
  },
  inputIcon: {
    marginRight: 12
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500'
  },
  datesRow: {
    flexDirection: 'row',
    marginBottom: 20
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6
  },
  dateInput: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0
  },
  submitButton: {
    backgroundColor: '#EA580C', // Orangish
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14
  },
  securityText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  }
});
