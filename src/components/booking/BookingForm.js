import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function BookingForm({ selectedHotel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const pricePerNight = selectedHotel?.numericPrice || 135;
  const nights = 3;
  const subtotal = pricePerNight * nights * roomsCount;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleBook = () => {
    if (!name || !phone) {
      Alert.alert('Incomplete Details', 'Please provide your name and phone number to complete the reservation.');
      return;
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={styles.successCard}>
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>
          Thank you, {name}! Your stay at {selectedHotel?.name || 'New York Marriott Marquis'} has been reserved.
        </Text>
        <View style={styles.reservationDetailBox}>
          <Text style={styles.reservationDetailText}>
            Dates: {checkIn} to {checkOut} ({nights} nights)
          </Text>
          <Text style={styles.reservationDetailText}>
            Guests: {guestsCount} | Total Paid: ${total}
          </Text>
        </View>
        <Pressable
          style={styles.doneButton}
          onPress={() => setIsSuccess(false)}
        >
          <Text style={styles.doneButtonText}>Make Another Reservation</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryHotelName}>{selectedHotel?.name || 'New York Marriott Marquis'}</Text>
            <Text style={styles.summaryLocation}>{selectedHotel?.location || 'New York, USA'}</Text>
          </View>
          <Text style={styles.summaryRate}>${pricePerNight}<Text style={styles.summaryPerNight}>/night</Text></Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>${pricePerNight} × {nights} nights ({roomsCount} room)</Text>
          <Text style={styles.calcValue}>${subtotal}</Text>
        </View>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Estimated Taxes & Fees (12%)</Text>
          <Text style={styles.calcValue}>${taxes}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
      </View>

  
      <View style={styles.countersRow}>
        <View style={styles.counterBox}>
          <Text style={styles.counterLabel}>GUESTS</Text>
          <View style={styles.counterControls}>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setGuestsCount(Math.max(1, guestsCount - 1))}
            >
              <Ionicons name="remove" size={16} color={COLORS.text} />
            </Pressable>
            <Text style={styles.counterNumber}>{guestsCount}</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setGuestsCount(guestsCount + 1)}
            >
              <Ionicons name="add" size={16} color={COLORS.text} />
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
              <Ionicons name="remove" size={16} color={COLORS.text} />
            </Pressable>
            <Text style={styles.counterNumber}>{roomsCount}</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setRoomsCount(roomsCount + 1)}
            >
              <Ionicons name="add" size={16} color={COLORS.text} />
            </Pressable>
          </View>
        </View>
      </View>

    
      <View style={styles.fieldsGroup}>
        <Text style={styles.fieldSectionHeading}>Guest Information</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={COLORS.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>
      </View>

    
      <View style={styles.datesRow}>
        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
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
          <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
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

    
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]}
        onPress={handleBook}
      >
        <Text style={styles.submitButtonText}>Confirm & Book Stay</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
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
    color: COLORS.text,
    marginBottom: 4
  },
  summaryLocation: {
    fontSize: 13,
    color: COLORS.textSecondary
  },
  summaryRate: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary
  },
  summaryPerNight: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted
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
    color: COLORS.textSecondary
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  counterBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 18,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text
  },
  fieldsGroup: {
    marginBottom: 16
  },
  fieldSectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  inputIcon: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text
  },
  datesRow: {
    flexDirection: 'row',
    marginBottom: 20
  },
  miniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 2
  },
  dateInput: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    padding: 0
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 6
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700'
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20
  },
  reservationDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  reservationDetailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500'
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center'
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700'
  }
});
