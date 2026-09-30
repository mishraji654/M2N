import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SwipeToPay from '../components/payment/SwipeToPay';
import { tripsStore } from '../data/tripsStore';
import { COLORS } from '../theme/colors';

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', icon: 'bank' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICIC', icon: 'bank' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI', icon: 'bank' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS', icon: 'bank' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK', icon: 'bank' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB', icon: 'bank' }
];

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'logo-google' },
  { id: 'phonepe', name: 'PhonePe', icon: 'phone-portrait-outline' },
  { id: 'paytm', name: 'Paytm UPI', icon: 'wallet-outline' },
  { id: 'bhim', name: 'BHIM UPI', icon: 'flash-outline' }
];

export default function PaymentScreen({ route, navigation }) {
  const bookingData = route.params?.bookingData || {};

  const hotelName = bookingData.hotelName || 'Zaarang Hotel & Suites';
  const location = bookingData.location || 'Lucknow, Uttar Pradesh';
  const checkIn = bookingData.checkIn || '2026-10-15';
  const checkOut = bookingData.checkOut || '2026-10-18';
  const nights = bookingData.nights || 3;
  const guestsCount = bookingData.guestsCount || 2;
  const roomsCount = bookingData.roomsCount || 1;
  const subtotal = bookingData.subtotal || 13500;
  const taxes = bookingData.taxes || 1620;
  const total = bookingData.total || (subtotal + taxes);

  const formattedTotal = `₹${total.toLocaleString('en-IN')}`;

  // Mode: 'upi' | 'bank'
  const [paymentMode, setPaymentMode] = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [bankTransferType, setBankTransferType] = useState('netbanking'); // 'netbanking' | 'neft'

  // Net Banking Form States
  const [netBankingName, setNetBankingName] = useState(bookingData.name || 'Ansh Yadav');
  const [netBankingUserId, setNetBankingUserId] = useState('');
  const [netBankingAccNo, setNetBankingAccNo] = useState('');
  const [netBankingMobile, setNetBankingMobile] = useState(bookingData.phone || '+91 98765 43210');
  const [isNetBankingVerified, setIsNetBankingVerified] = useState(false);

  // NEFT / RTGS / IMPS Form States
  const [neftMode, setNeftMode] = useState('IMPS'); // 'IMPS' | 'NEFT' | 'RTGS'
  const [neftUtrNo, setNeftUtrNo] = useState('');
  const [neftSenderName, setNeftSenderName] = useState(bookingData.name || 'Ansh Yadav');
  const [neftSenderBank, setNeftSenderBank] = useState('HDFC Bank');
  const [neftSenderAcc, setNeftSenderAcc] = useState('');
  const [neftIfsc, setNeftIfsc] = useState('HDFC0000021');
  const [isNeftVerified, setIsNeftVerified] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [txnId, setTxnId] = useState('');

  // Synchronous atomic lock preventing any duplicate submission
  const isSubmittingRef = useRef(false);

  const getBankDisplayName = () => {
    const found = POPULAR_BANKS.find(b => b.id === selectedBank);
    return found ? found.name : selectedBank;
  };

  const handleVerifyUpi = () => {
    if (!customUpiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid VPA e.g. mobile@okhdfcbank');
      return;
    }
    setIsUpiVerified(true);
  };

  const handleVerifyNetBanking = () => {
    if (!netBankingUserId.trim() && !netBankingAccNo.trim()) {
      Alert.alert(
        'Bank Details Required',
        'Please enter your Net Banking Customer ID / User ID or Account Number.'
      );
      return;
    }
    setIsNetBankingVerified(true);
    Alert.alert('Verified', `Bank details verified with ${getBankDisplayName()} NetBanking.`);
  };

  const handleAutoFillNetBanking = () => {
    const bankName = getBankDisplayName();
    const found = POPULAR_BANKS.find(b => b.id === selectedBank);
    const code = found ? found.code : 'M2N';
    setNetBankingName(bookingData.name || 'Ansh Yadav');
    setNetBankingUserId(`${code}792810`);
    setNetBankingAccNo('501004829104');
    setNetBankingMobile(bookingData.phone || '+91 98765 43210');
    setIsNetBankingVerified(true);
  };

  const handleVerifyNeft = () => {
    if (!neftSenderAcc.trim() && !neftUtrNo.trim()) {
      Alert.alert(
        'Details Required',
        'Please enter your Bank Account Number or UTR Reference Number.'
      );
      return;
    }
    setIsNeftVerified(true);
    Alert.alert('Transfer Verified', `${neftMode} transfer details verified and linked.`);
  };

  const handleAutoFillNeft = () => {
    const randomUtr = `UTR${Date.now().toString().slice(-8)}`;
    setNeftUtrNo(randomUtr);
    setNeftSenderName(bookingData.name || 'Ansh Yadav');
    setNeftSenderBank('HDFC Bank');
    setNeftSenderAcc('501004829104');
    setNeftIfsc('HDFC0000021');
    setIsNeftVerified(true);
  };

  const handlePaymentComplete = () => {
    // Synchronously check lock to guarantee booking NEVER runs twice
    if (isSubmittingRef.current || isProcessing || isSuccess) {
      return;
    }
    isSubmittingRef.current = true;
    setIsProcessing(true);

    const newBookingId = `M2N-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxnId = `TXN${Date.now().toString().slice(-8)}`;
    const bankNameFormatted = getBankDisplayName();

    let payMethodName = '';
    if (paymentMode === 'upi') {
      payMethodName = customUpiId ? `UPI (${customUpiId})` : `UPI (${selectedUpiApp.toUpperCase()})`;
    } else if (bankTransferType === 'neft') {
      const finalUtr = neftUtrNo.trim() || `UTR${Date.now().toString().slice(-8)}`;
      const accSuffix = neftSenderAcc.trim() ? ` • A/C ••${neftSenderAcc.trim().slice(-4)}` : '';
      payMethodName = `${neftMode} Transfer (${neftSenderBank || 'HDFC Bank'}${accSuffix} • ${finalUtr})`;
    } else {
      const accSuffix = netBankingAccNo.trim() ? ` • A/C ••${netBankingAccNo.trim().slice(-4)}` : '';
      payMethodName = `Net Banking (${bankNameFormatted}${accSuffix})`;
    }

    // Add confirmed & paid trip to tripsStore
    tripsStore.addPaidTrip({
      hotelName,
      location,
      dates: `${checkIn} - ${checkOut}`,
      bookingId: newBookingId,
      txnId: newTxnId,
      amount: formattedTotal,
      total,
      guestsCount,
      roomsCount,
      paymentMethod: payMethodName,
      image: bookingData.image
    });

    setTimeout(() => {
      setIsProcessing(false);
      setBookingId(newBookingId);
      setTxnId(newTxnId);
      setIsSuccess(true);
    }, 1400);
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSuccess) {
    const bankNameFormatted = getBankDisplayName();
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={38} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your luxury reservation at {hotelName} is complete.
          </Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Booking ID</Text>
              <Text style={styles.successIdHighlight}>{bookingId}</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Transaction ID</Text>
              <Text style={styles.successValue}>{txnId}</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment Method</Text>
              <Text style={styles.successValue}>
                {paymentMode === 'upi'
                  ? `UPI (${selectedUpiApp.toUpperCase()})`
                  : bankTransferType === 'neft'
                  ? `${neftMode} Transfer`
                  : `Net Banking (${bankNameFormatted})`}
              </Text>
            </View>

            {/* Net Banking Specific Details */}
            {paymentMode === 'bank' && bankTransferType === 'netbanking' && (
              <>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Bank Name</Text>
                  <Text style={styles.successValue}>{bankNameFormatted}</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Account Holder</Text>
                  <Text style={styles.successValue}>{netBankingName || 'Ansh Yadav'}</Text>
                </View>
                {netBankingUserId ? (
                  <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Customer / User ID</Text>
                    <Text style={styles.successValue}>{netBankingUserId}</Text>
                  </View>
                ) : null}
                {netBankingAccNo ? (
                  <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Account Number</Text>
                    <Text style={styles.successValue}>•••• {netBankingAccNo.slice(-4)}</Text>
                  </View>
                ) : null}
              </>
            )}

            {/* NEFT Transfer Specific Details */}
            {paymentMode === 'bank' && bankTransferType === 'neft' && (
              <>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Transfer Channel</Text>
                  <Text style={styles.successValue}>{neftMode} Transfer</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Bank Name</Text>
                  <Text style={styles.successValue}>{neftSenderBank || 'HDFC Bank'}</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Account Holder</Text>
                  <Text style={styles.successValue}>{neftSenderName || 'Ansh Yadav'}</Text>
                </View>
                {neftSenderAcc ? (
                  <View style={styles.successRow}>
                    <Text style={styles.successLabel}>Account Number</Text>
                    <Text style={styles.successValue}>•••• {neftSenderAcc.slice(-4)}</Text>
                  </View>
                ) : null}
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>UTR / Ref No.</Text>
                  <Text style={styles.successIdHighlight}>
                    {neftUtrNo || `UTR${txnId.slice(-8)}`}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.successDivider} />

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Total Paid</Text>
              <Text style={styles.successTotal}>{formattedTotal}</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Stay Dates</Text>
              <Text style={styles.successValue}>{checkIn} to {checkOut} ({nights}N)</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Guests & Rooms</Text>
              <Text style={styles.successValue}>{guestsCount} Guests • {roomsCount} Room</Text>
            </View>
          </View>

          <View style={styles.successActions}>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('TripsTab')}
            >
              <Ionicons name="briefcase" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>View in My Trips</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.secondaryBtnText}>Back to Home</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // PROCESSING LOADER VIEW
  if (isProcessing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loadingTitle}>Processing Payment...</Text>
          <Text style={styles.loadingSubtitle}>
            Connecting securely with {paymentMode === 'upi' ? 'UPI Gateway' : 'Bank Gateway'}
          </Text>
          <View style={styles.securityPill}>
            <Ionicons name="shield-checkmark" size={15} color="#16A34A" />
            <Text style={styles.securityPillText}>256-Bit Bank Grade Encryption</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
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
          <Text style={styles.headerTitle}>Select Payment Method</Text>
          <View style={styles.sslBadge}>
            <Ionicons name="lock-closed" size={11} color="#16A34A" />
            <Text style={styles.sslBadgeText}>100% SECURE & ENCRYPTED</Text>
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Amount Banner */}
        <View style={styles.amountBanner}>
          <View>
            <Text style={styles.amountBannerLabel}>TOTAL PAYABLE</Text>
            <Text style={styles.amountBannerValue}>{formattedTotal}</Text>
          </View>
          <View style={styles.stayChip}>
            <Text style={styles.stayChipText}>{nights} Nights • {roomsCount} Room</Text>
          </View>
        </View>

        {/* Hotel mini summary */}
        <View style={styles.hotelMiniCard}>
          <Ionicons name="business" size={18} color="#EA580C" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.hotelMiniName}>{hotelName}</Text>
            <Text style={styles.hotelMiniLoc}>{location}</Text>
          </View>
        </View>

        {/* Payment Mode Selector: Bank Transfer vs UPI Transfer */}
        <Text style={styles.sectionHeading}>CHOOSE PAYMENT METHOD</Text>
        <View style={styles.modeTabsRow}>
          {/* UPI Transfer Tab */}
          <Pressable
            style={[styles.modeTab, paymentMode === 'upi' && styles.modeTabActive]}
            onPress={() => setPaymentMode('upi')}
          >
            <View style={[styles.modeIconCircle, paymentMode === 'upi' && styles.modeIconCircleActive]}>
              <Ionicons
                name="flash"
                size={18}
                color={paymentMode === 'upi' ? '#EA580C' : '#64748B'}
              />
            </View>
            <Text style={[styles.modeTabTitle, paymentMode === 'upi' && styles.modeTabTitleActive]}>
              UPI Transfer
            </Text>
            <Text style={styles.modeTabSubtitle}>Instant • 0% Fee</Text>
            {paymentMode === 'upi' && <View style={styles.activePillIndicator} />}
          </Pressable>

          {/* Bank Transfer Tab */}
          <Pressable
            style={[styles.modeTab, paymentMode === 'bank' && styles.modeTabActive]}
            onPress={() => setPaymentMode('bank')}
          >
            <View style={[styles.modeIconCircle, paymentMode === 'bank' && styles.modeIconCircleActive]}>
              <MaterialCommunityIcons
                name="bank"
                size={18}
                color={paymentMode === 'bank' ? '#EA580C' : '#64748B'}
              />
            </View>
            <Text style={[styles.modeTabTitle, paymentMode === 'bank' && styles.modeTabTitleActive]}>
              Bank Transfer
            </Text>
            <Text style={styles.modeTabSubtitle}>Net Banking / NEFT</Text>
            {paymentMode === 'bank' && <View style={styles.activePillIndicator} />}
          </Pressable>
        </View>

        {/* =============================================================== */}
        {/* UPI TRANSFER OPTIONS                                             */}
        {/* =============================================================== */}
        {paymentMode === 'upi' && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardHeaderTitle}>Pay Using UPI Apps</Text>

            <View style={styles.upiGrid}>
              {UPI_APPS.map((app) => {
                const isSelected = selectedUpiApp === app.id;
                return (
                  <Pressable
                    key={app.id}
                    style={[styles.upiItem, isSelected && styles.upiItemActive]}
                    onPress={() => {
                      setSelectedUpiApp(app.id);
                      setIsUpiVerified(false);
                    }}
                  >
                    <Ionicons
                      name={app.icon}
                      size={20}
                      color={isSelected ? '#EA580C' : '#0F172A'}
                    />
                    <Text style={[styles.upiItemName, isSelected && styles.upiItemNameActive]}>
                      {app.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#EA580C"
                        style={styles.selectedCheck}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.orDividerRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR ENTER UPI ID</Text>
              <View style={styles.orLine} />
            </View>

            {/* Custom UPI ID Input */}
            <View style={styles.upiInputRow}>
              <TextInput
                style={styles.upiInput}
                placeholder="e.g. mobile@okhdfcbank"
                placeholderTextColor="#94A3B8"
                value={customUpiId}
                onChangeText={(val) => {
                  setCustomUpiId(val);
                  setIsUpiVerified(false);
                }}
                autoCapitalize="none"
              />
              <Pressable
                style={[styles.verifyBtn, isUpiVerified && styles.verifyBtnActive]}
                onPress={handleVerifyUpi}
              >
                <Text style={styles.verifyBtnText}>
                  {isUpiVerified ? 'Verified ✓' : 'Verify'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* =============================================================== */}
        {/* BANK TRANSFER OPTIONS                                            */}
        {/* =============================================================== */}
        {paymentMode === 'bank' && (
          <View style={styles.detailsCard}>
            <View style={styles.bankSubTabs}>
              <Pressable
                style={[styles.bankSubTab, bankTransferType === 'netbanking' && styles.bankSubTabActive]}
                onPress={() => setBankTransferType('netbanking')}
              >
                <Ionicons
                  name="globe-outline"
                  size={14}
                  color={bankTransferType === 'netbanking' ? '#EA580C' : '#64748B'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.bankSubTabText, bankTransferType === 'netbanking' && styles.bankSubTabTextActive]}>
                  Net Banking
                </Text>
              </Pressable>

              <Pressable
                style={[styles.bankSubTab, bankTransferType === 'neft' && styles.bankSubTabActive]}
                onPress={() => setBankTransferType('neft')}
              >
                <MaterialCommunityIcons
                  name="bank-transfer"
                  size={16}
                  color={bankTransferType === 'neft' ? '#EA580C' : '#64748B'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.bankSubTabText, bankTransferType === 'neft' && styles.bankSubTabTextActive]}>
                  NEFT / RTGS / IMPS
                </Text>
              </Pressable>
            </View>

            {bankTransferType === 'netbanking' ? (
              <View style={styles.bankSectionWrap}>
                <Text style={styles.cardHeaderTitle}>POPULAR INDIAN BANKS</Text>
                
                {/* 2-Column Popular Banks Grid (Rigid Equal Width) */}
                <View style={styles.bankGrid}>
                  {POPULAR_BANKS.map((b) => {
                    const isSelected = selectedBank === b.id;
                    return (
                      <Pressable
                        key={b.id}
                        style={[styles.bankGridItem, isSelected && styles.bankGridItemActive]}
                        onPress={() => {
                          setSelectedBank(b.id);
                          setIsNetBankingVerified(false);
                        }}
                      >
                        <View style={[styles.bankBadgeCircle, isSelected && styles.bankBadgeCircleActive]}>
                          <MaterialCommunityIcons
                            name={b.icon}
                            size={18}
                            color={isSelected ? '#EA580C' : '#0F172A'}
                          />
                        </View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={[styles.bankGridName, isSelected && styles.bankGridNameActive]} numberOfLines={1}>
                            {b.name}
                          </Text>
                          <Text style={styles.bankGridCode}>{b.code}</Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color="#EA580C" style={{ marginLeft: 4 }} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Additional Indian Banks Selector */}
                <View style={styles.otherBanksBox}>
                  <Text style={styles.otherBanksLabel}>ALL OTHER INDIAN BANKS</Text>
                  <View style={styles.otherBanksChips}>
                    {['Canara Bank', 'Union Bank', 'Bank of Baroda', 'IndusInd', 'IDFC FIRST', 'Yes Bank'].map((name) => (
                      <Pressable
                        key={name}
                        style={[styles.otherBankChip, selectedBank === name && styles.otherBankChipActive]}
                        onPress={() => {
                          setSelectedBank(name);
                          setIsNetBankingVerified(false);
                        }}
                      >
                        <Text style={[styles.otherBankChipText, selectedBank === name && styles.otherBankChipTextActive]}>
                          {name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* NET BANKING DETAILS INPUT FORM */}
                <View style={styles.bankFormBox}>
                  <View style={styles.formHeaderRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <MaterialCommunityIcons name="shield-account" size={18} color="#EA580C" />
                      <Text style={styles.formHeaderTitle}>NET BANKING DETAILS</Text>
                    </View>
                    <Pressable
                      style={styles.autoFillPill}
                      onPress={handleAutoFillNetBanking}
                    >
                      <Ionicons name="flash" size={12} color="#EA580C" />
                      <Text style={styles.autoFillPillText}>Auto-Fill Demo</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.formSubNotice}>
                    Enter your {getBankDisplayName()} credentials to link authorization:
                  </Text>

                  {/* Field 1: Account Holder Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME</Text>
                    <View style={styles.inputWithIconRow}>
                      <Ionicons name="person-outline" size={17} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputField}
                        value={netBankingName}
                        onChangeText={setNetBankingName}
                        placeholder="e.g. Ansh Yadav"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Field 2: Customer ID / User ID */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelWithRequiredRow}>
                      <Text style={styles.inputLabel}>CUSTOMER ID / NET BANKING USER ID</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <View style={styles.inputWithIconRow}>
                      <Ionicons name="finger-print-outline" size={17} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputField}
                        value={netBankingUserId}
                        onChangeText={(val) => {
                          setNetBankingUserId(val);
                          setIsNetBankingVerified(false);
                        }}
                        placeholder="e.g. 79281034 or USERNAME"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>

                  {/* Field 3: Bank Account Number */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelWithRequiredRow}>
                      <Text style={styles.inputLabel}>BANK ACCOUNT NUMBER</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <View style={styles.inputWithIconRow}>
                      <Ionicons name="card-outline" size={17} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputField}
                        value={netBankingAccNo}
                        onChangeText={(val) => {
                          setNetBankingAccNo(val);
                          setIsNetBankingVerified(false);
                        }}
                        placeholder="e.g. 501004829104"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Field 4: Registered Mobile Number */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>REGISTERED MOBILE (FOR BANK OTP)</Text>
                    <View style={styles.inputWithIconRow}>
                      <Ionicons name="call-outline" size={17} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputField}
                        value={netBankingMobile}
                        onChangeText={setNetBankingMobile}
                        placeholder="e.g. +91 98765 43210"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  {/* Verification Status or Button */}
                  {isNetBankingVerified ? (
                    <View style={styles.verifiedSuccessBanner}>
                      <Ionicons name="checkmark-circle" size={16} color="#15803D" />
                      <Text style={styles.verifiedSuccessText}>
                        Account Verified with {getBankDisplayName()} NetBanking
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.verifyDetailsBtn}
                      onPress={handleVerifyNetBanking}
                    >
                      <Ionicons name="shield-checkmark-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.verifyDetailsBtnText}>Verify Bank Account Details</Text>
                    </Pressable>
                  )}
                </View>

                {/* Secure Gateway Note */}
                <View style={styles.bankSecureNote}>
                  <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                  <Text style={styles.bankSecureNoteText}>
                    Authorized directly via {getBankDisplayName()} 256-bit encrypted gateway.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.neftUnifiedCard}>
                {/* Header */}
                <View style={styles.formHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons name="bank-transfer" size={20} color="#EA580C" />
                    <Text style={styles.formHeaderTitle}>NEFT / RTGS / IMPS DETAILS</Text>
                  </View>
                  <Pressable
                    style={styles.autoFillPill}
                    onPress={handleAutoFillNeft}
                  >
                    <Ionicons name="flash" size={12} color="#EA580C" />
                    <Text style={styles.autoFillPillText}>Auto-Fill Demo</Text>
                  </Pressable>
                </View>

                <Text style={styles.formSubNotice}>
                  Select transfer mode and enter transaction details to link payment to your reservation:
                </Text>

                {/* Transfer Mode Chips: IMPS vs NEFT vs RTGS */}
                <View style={styles.neftModeChipsRow}>
                  {[
                    { id: 'IMPS', label: 'IMPS (Instant 24x7)' },
                    { id: 'NEFT', label: 'NEFT Transfer' },
                    { id: 'RTGS', label: 'RTGS Transfer' }
                  ].map((item) => (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.neftModeChip,
                        neftMode === item.id && styles.neftModeChipActive
                      ]}
                      onPress={() => setNeftMode(item.id)}
                    >
                      <Text
                        style={[
                          styles.neftModeChipText,
                          neftMode === item.id && styles.neftModeChipTextActive
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Quick Bank Chips */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>SELECT YOUR BANK</Text>
                  <View style={styles.quickBankChipsRow}>
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'].map((bName) => (
                      <Pressable
                        key={bName}
                        style={[
                          styles.quickBankChip,
                          neftSenderBank === bName && styles.quickBankChipActive
                        ]}
                        onPress={() => {
                          setNeftSenderBank(bName);
                          if (bName === 'HDFC Bank') setNeftIfsc('HDFC0000021');
                          if (bName === 'ICICI Bank') setNeftIfsc('ICIC0000102');
                          if (bName === 'SBI') setNeftIfsc('SBIN0000421');
                          if (bName === 'Axis Bank') setNeftIfsc('UTIB0000182');
                          if (bName === 'Kotak Bank') setNeftIfsc('KKBK0000142');
                        }}
                      >
                        <Text
                          style={[
                            styles.quickBankChipText,
                            neftSenderBank === bName && styles.quickBankChipTextActive
                          ]}
                        >
                          {bName}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Field 1: Account Holder Name */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithRequiredRow}>
                    <Text style={styles.inputLabel}>REMITTER / ACCOUNT HOLDER NAME</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="person-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      value={neftSenderName}
                      onChangeText={setNeftSenderName}
                      placeholder="e.g. Ansh Yadav"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Field 2: Bank Account Number */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithRequiredRow}>
                    <Text style={styles.inputLabel}>BANK ACCOUNT NUMBER</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="card-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      value={neftSenderAcc}
                      onChangeText={(val) => {
                        setNeftSenderAcc(val);
                        setIsNeftVerified(false);
                      }}
                      placeholder="e.g. 501004829104"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Field 3: Bank IFSC Code */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithRequiredRow}>
                    <Text style={styles.inputLabel}>BANK IFSC CODE</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="key-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      value={neftIfsc}
                      onChangeText={setNeftIfsc}
                      placeholder="e.g. HDFC0000021"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                {/* Field 4: UTR / Reference Number */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithRequiredRow}>
                    <Text style={styles.inputLabel}>UTR / TRANSACTION REFERENCE NUMBER</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="receipt-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      value={neftUtrNo}
                      onChangeText={(val) => {
                        setNeftUtrNo(val);
                        setIsNeftVerified(false);
                      }}
                      placeholder="e.g. 423981092831 or UTR982104"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="characters"
                    />
                  </View>
                  <Text style={styles.inputHelpText}>
                    12 or 16-digit reference number from your bank app/SMS receipt
                  </Text>
                </View>

                {/* Transfer Summary Pill */}
                <View style={styles.transferSummaryPill}>
                  <Ionicons name="cash-outline" size={15} color="#EA580C" />
                  <Text style={styles.transferSummaryText}>
                    Payable Amount: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{formattedTotal}</Text> (GST Included) • 0% Extra Fee
                  </Text>
                </View>

                {/* Verification Status or Button */}
                {isNeftVerified ? (
                  <View style={styles.verifiedSuccessBanner}>
                    <Ionicons name="shield-checkmark" size={16} color="#15803D" />
                    <Text style={styles.verifiedSuccessText}>
                      {neftMode} Transfer Verified & Ready to Confirm
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.verifyDetailsBtn}
                    onPress={handleVerifyNeft}
                  >
                    <Ionicons name="shield-checkmark-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.verifyDetailsBtnText}>Verify & Link {neftMode} Details</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {/* Pricing Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Price Breakdown (INR)</Text>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Room Charges ({nights} Nights)</Text>
            <Text style={styles.calcVal}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Luxury Hospitality GST (12%)</Text>
            <Text style={styles.calcVal}>₹{taxes.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalVal}>{formattedTotal}</Text>
          </View>
        </View>

        {/* Interactive SWIPE TO PAY Component */}
        <View style={styles.swipeContainer}>
          <Text style={styles.swipeHint}>Slide thumb all the way right to confirm</Text>
          <SwipeToPay
            totalAmount={formattedTotal}
            onSwipeSuccess={handlePaymentComplete}
            disabled={isProcessing || isSuccess}
          />

          {/* Quick Click Fallback Button */}
          <Pressable
            style={({ pressed }) => [
              styles.instantPayBtn,
              (isProcessing || isSuccess) && { opacity: 0.5 },
              pressed && { opacity: 0.85 }
            ]}
            onPress={handlePaymentComplete}
            disabled={isProcessing || isSuccess}
          >
            <Text style={styles.instantPayText}>Or Tap to Pay {formattedTotal}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        maxWidth: 480,
        width: '100%',
        marginHorizontal: 'auto',
        minHeight: '100vh'
      }
    })
  },
  header: {
    width: '100%',
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
  sslBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2
  },
  sslBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5
  },
  scroll: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'stretch',
    padding: 16,
    paddingBottom: 60
  },
  amountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A', // Obsidian Black
    borderRadius: 16,
    padding: 18,
    marginBottom: 12
  },
  amountBannerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8
  },
  amountBannerValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#EA580C', // Orangish
    marginTop: 2
  },
  stayChip: {
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.3)'
  },
  stayChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C'
  },
  hotelMiniCard: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  hotelMiniName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  hotelMiniLoc: {
    fontSize: 12,
    color: '#64748B'
  },
  sectionHeading: {
    width: '100%',
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2
  },
  modeTabsRow: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  modeTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    position: 'relative'
  },
  modeTabActive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED'
  },
  modeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  modeIconCircleActive: {
    backgroundColor: '#FFEDD5'
  },
  modeTabTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155'
  },
  modeTabTitleActive: {
    color: '#EA580C'
  },
  modeTabSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  activePillIndicator: {
    position: 'absolute',
    bottom: -1.5,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#EA580C',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  detailsCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  upiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14
  },
  upiItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC'
  },
  upiItemActive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED'
  },
  upiItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
    flex: 1
  },
  upiItemNameActive: {
    color: '#EA580C'
  },
  selectedCheck: {
    marginLeft: 4
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0'
  },
  orText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginHorizontal: 8,
    letterSpacing: 0.5
  },
  upiInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  upiInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF'
  },
  verifyBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  verifyBtnActive: {
    backgroundColor: '#16A34A'
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  bankSubTabs: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16
  },
  bankSubTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9
  },
  bankSubTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  bankSubTabText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B'
  },
  bankSubTabTextActive: {
    color: '#0F172A',
    fontWeight: '800'
  },
  bankSectionWrap: {
    width: '100%',
    alignSelf: 'stretch'
  },
  bankGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  bankGridItem: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC'
  },
  bankGridItemActive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED'
  },
  bankBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  bankBadgeCircleActive: {
    backgroundColor: '#FFEDD5'
  },
  bankGridName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  bankGridNameActive: {
    color: '#EA580C',
    fontWeight: '800'
  },
  bankGridCode: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600'
  },
  otherBanksBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  otherBanksLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8
  },
  otherBanksChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  otherBankChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  otherBankChipActive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFEDD5'
  },
  otherBankChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600'
  },
  otherBankChipTextActive: {
    color: '#EA580C',
    fontWeight: '800'
  },
  bankSecureNote: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  bankSecureNoteText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
    flex: 1
  },

  /* NEFT / ESCROW STYLES */
  /* NEFT UNIFIED STYLES */
  neftUnifiedCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  neftModeChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  neftModeChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  neftModeChipActive: {
    backgroundColor: '#FFEDD5',
    borderColor: '#EA580C'
  },
  neftModeChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700'
  },
  neftModeChipTextActive: {
    color: '#EA580C',
    fontWeight: '800'
  },
  quickBankChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4
  },
  quickBankChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  quickBankChipActive: {
    backgroundColor: '#FFEDD5',
    borderColor: '#EA580C'
  },
  quickBankChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600'
  },
  quickBankChipTextActive: {
    color: '#EA580C',
    fontWeight: '800'
  },

  /* NET BANKING FORM STYLES */
  bankFormBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
    marginBottom: 14
  },
  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  formHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6
  },
  autoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EA580C'
  },
  autoFillPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EA580C'
  },
  formSubNotice: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 12
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10
  },
  labelWithRequiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  requiredStar: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C'
  },
  inputWithIconRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10
  },
  inputIcon: {
    marginRight: 8
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },
  inputHelpText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 3,
    marginLeft: 2
  },
  verifyDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    height: 44,
    borderRadius: 10,
    marginTop: 6
  },
  verifyDetailsBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800'
  },
  verifiedSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6
  },
  verifiedSuccessText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    flex: 1
  },

  transferSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8
  },
  transferSummaryText: {
    fontSize: 11.5,
    color: '#475569'
  },
  breakdownCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10
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
  calcVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EA580C'
  },
  swipeContainer: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 8
  },
  swipeHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4
  },
  instantPayBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  instantPayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
    textDecorationLine: 'underline'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 6
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center'
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20
  },
  securityPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D'
  },
  successContainer: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 40
  },
  successIconOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  successIconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20
  },
  successCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 24
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  successLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  successValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  successIdHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 0.5
  },
  successTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EA580C'
  },
  successDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8
  },
  successActions: {
    width: '100%',
    gap: 12
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    height: 52,
    borderRadius: 14
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1'
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700'
  }
});
