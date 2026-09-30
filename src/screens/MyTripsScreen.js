import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Modal,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { tripsStore } from '../data/tripsStore';

const TRIP_TABS = ['Upcoming', 'Completed', 'Cancelled'];

export default function MyTripsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [allTrips, setAllTrips] = useState(tripsStore.getTrips());
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    const unsubscribe = tripsStore.subscribe((updated) => {
      setAllTrips(updated);
    });
    return unsubscribe;
  }, []);

  // Filter trips strictly by active tab
  const displayTrips = allTrips.filter(
    (t) => t.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleCancelTrip = (trip) => {
    Alert.alert(
      'Cancel Reservation & Refund',
      `Are you sure you want to cancel your stay at ${trip.hotelName}? A full refund of ${trip.amount} will be credited back to your ${trip.paymentMethod}.`,
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Confirm Cancellation',
          style: 'destructive',
          onPress: () => {
            tripsStore.cancelTrip(trip.id);
            Alert.alert('Refund Initiated', `Cancellation confirmed. Full refund of ${trip.amount} is being processed.`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Trips</Text>
          <Text style={styles.headerSubtitle}>Verified & Paid Luxury Stays</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.newTripBtn, pressed && { opacity: 0.8 }]}
          onPress={() => navigation.navigate('HotelsTab')}
        >
          <Ionicons name="add" size={17} color="#FFFFFF" />
          <Text style={styles.newTripBtnText}>Book Stay</Text>
        </Pressable>
      </View>

      {/* UNIFORM 3-COLUMN EQUAL WIDTH SEGMENTED TABS */}
      <View style={styles.tabsRow}>
        {TRIP_TABS.map((tab) => {
          const isSelected = activeTab === tab;
          const count = allTrips.filter(
            (t) => t.status.toLowerCase() === tab.toLowerCase()
          ).length;

          return (
            <Pressable
              key={tab}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <View style={styles.tabInner}>
                <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextActive]}>
                  {tab}
                </Text>
                <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isSelected && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </View>
              {isSelected && <View style={styles.activeTabIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {displayTrips.length > 0 ? (
          displayTrips.map((trip) => {
            const isUpcoming = trip.status === 'Upcoming';
            const isCompleted = trip.status === 'Completed';
            const isCancelled = trip.status === 'Cancelled';

            return (
              <View key={trip.id} style={styles.tripCard}>
                {/* 1. Card Cover Image with Status Badge */}
                <ImageBackground
                  source={{ uri: trip.image }}
                  style={styles.cardCover}
                  imageStyle={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Uniform Status Badge across all states */}
                  <View style={styles.pillRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        isUpcoming && styles.statusBadgeUpcoming,
                        isCompleted && styles.statusBadgeCompleted,
                        isCancelled && styles.statusBadgeCancelled
                      ]}
                    >
                      <Ionicons
                        name={
                          isCancelled
                            ? 'close-circle'
                            : isCompleted
                            ? 'checkmark-done-circle'
                            : 'checkmark-circle'
                        }
                        size={13}
                        color="#FFFFFF"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.statusBadgeText}>
                        {isUpcoming && 'CONFIRMED & PAID'}
                        {isCompleted && 'STAY COMPLETED'}
                        {isCancelled && 'CANCELLED & REFUNDED'}
                      </Text>
                    </View>
                  </View>

                  {/* Cover Content (Booking ID & Hotel Name) */}
                  <View style={styles.coverContent}>
                    <Text style={styles.bookingIdText}>BOOKING ID: {trip.bookingId}</Text>
                    <Text style={styles.hotelTitleText} numberOfLines={1}>
                      {trip.hotelName}
                    </Text>
                    <Text style={styles.hotelLocationText} numberOfLines={1}>
                      <Ionicons name="location-sharp" size={12} color="#FFFFFF" /> {trip.location}
                    </Text>
                  </View>
                </ImageBackground>

                {/* 2. Card Body with Uniform Info Rows */}
                <View style={styles.cardBody}>
                  {/* Room Type & Stay Dates (50% / 50% split) */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoColLeft}>
                      <Text style={styles.infoLabel}>ROOM & GUESTS</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {trip.roomType}
                      </Text>
                      <Text style={styles.infoSubText} numberOfLines={1}>
                        {trip.guests}
                      </Text>
                    </View>
                    <View style={styles.infoColRight}>
                      <Text style={styles.infoLabel}>STAY DATES</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {trip.dates}
                      </Text>
                      <Text style={styles.infoSubText} numberOfLines={1}>
                        {isUpcoming
                          ? 'Check-in: 02:00 PM'
                          : isCompleted
                          ? 'Checked-out: 11:00 AM'
                          : 'Reservation Void'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* Payment Details Box (Identical 4-Row Design On All Cards) */}
                  <View style={styles.paymentDetailsBox}>
                    <View style={styles.payDetailRow}>
                      <Text style={styles.payDetailLabel}>Payment Channel</Text>
                      <Text style={styles.payDetailVal} numberOfLines={1}>{trip.paymentMethod}</Text>
                    </View>
                    <View style={styles.payDetailRow}>
                      <Text style={styles.payDetailLabel}>Transaction ID</Text>
                      <Text style={styles.payDetailVal} numberOfLines={1}>{trip.txnId}</Text>
                    </View>
                    <View style={styles.payDetailRow}>
                      <Text style={styles.payDetailLabel}>
                        {isCancelled ? 'Refund Amount' : 'Amount Paid'}
                      </Text>
                      <Text
                        style={[
                          styles.payDetailAmount,
                          isCancelled && { color: '#DC2626' }
                        ]}
                      >
                        {trip.amount}
                      </Text>
                    </View>

                    {/* Uniform Status Assurance Notice on ALL 3 cards */}
                    <View
                      style={[
                        styles.tripStatusNoticeBox,
                        isUpcoming && styles.statusNoticeUpcoming,
                        isCompleted && styles.statusNoticeCompleted,
                        isCancelled && styles.statusNoticeCancelled
                      ]}
                    >
                      <Ionicons
                        name={
                          isCancelled
                            ? 'information-circle'
                            : isCompleted
                            ? 'checkmark-done-circle'
                            : 'shield-checkmark'
                        }
                        size={14}
                        color={
                          isCancelled
                            ? '#DC2626'
                            : isCompleted
                            ? '#334155'
                            : '#16A34A'
                        }
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.tripStatusNoticeText,
                          isCancelled && { color: '#DC2626' },
                          isCompleted && { color: '#334155' },
                          isUpcoming && { color: '#16A34A' }
                        ]}
                        numberOfLines={1}
                      >
                        {isUpcoming && 'Payment Verified • Full Refund Protection Active'}
                        {isCompleted && 'Stay Finished • Verified Luxury Member Stay'}
                        {isCancelled && (trip.refundStatus || '100% Refund Credited to original source')}
                      </Text>
                    </View>
                  </View>

                  {/* 3. Action Buttons Row: EXACT 50% / 50% EQUAL WIDTH ON EVERY TAB */}
                  <View style={styles.uniformActionRow}>
                    {/* Button 1 (50% Width): Payment Receipt */}
                    <Pressable
                      style={styles.actionBtnLeft}
                      onPress={() => setSelectedReceipt(trip)}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={15}
                        color="#EA580C"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.actionBtnLeftText}>Payment Receipt</Text>
                    </Pressable>

                    {/* Button 2 (50% Width): Stay Voucher / Confirmation */}
                    <Pressable
                      style={styles.actionBtnRight}
                      onPress={() => setSelectedVoucher(trip)}
                    >
                      <Ionicons
                        name={isCancelled ? 'close-circle-outline' : 'document-text-outline'}
                        size={15}
                        color="#FFFFFF"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.actionBtnRightText}>
                        {isCancelled ? 'Cancel Voucher' : 'Stay Voucher'}
                      </Text>
                    </Pressable>
                  </View>

                  {/* 4. Uniform Bottom Helper Link Row (Exact same height & slot on ALL tabs) */}
                  <View style={styles.cardFooterActionRow}>
                    {isUpcoming ? (
                      <Pressable
                        style={styles.footerLinkBtn}
                        onPress={() => handleCancelTrip(trip)}
                      >
                        <Ionicons name="close-circle-outline" size={13} color="#DC2626" style={{ marginRight: 4 }} />
                        <Text style={styles.cancelLinkText}>Need to cancel? Request cancellation & refund</Text>
                      </Pressable>
                    ) : isCompleted ? (
                      <Pressable
                        style={styles.footerLinkBtn}
                        onPress={() => navigation.navigate('HotelsTab')}
                      >
                        <Ionicons name="refresh-outline" size={13} color="#EA580C" style={{ marginRight: 4 }} />
                        <Text style={styles.rebookLinkText}>Loved this stay? Tap to re-book this property</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.footerLinkBtn}
                        onPress={() => navigation.navigate('HotelsTab')}
                      >
                        <Ionicons name="compass-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.refundedLinkText}>100% Refunded • Explore other luxury stays</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name={
                  activeTab === 'Upcoming'
                    ? 'calendar-clock'
                    : activeTab === 'Completed'
                    ? 'check-decagram'
                    : 'close-octagon'
                }
                size={40}
                color="#EA580C"
              />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} Trips</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'Upcoming'
                ? 'Only verified stays with completed payment will appear in this itinerary.'
                : `You currently have no ${activeTab.toLowerCase()} trips.`}
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('HotelsTab')}
            >
              <Text style={styles.exploreBtnText}>Book a Luxury Stay</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* =================================================================== */}
      {/* 1. PAYMENT RECEIPT / TAX INVOICE MODAL                              */}
      {/* =================================================================== */}
      <Modal
        visible={!!selectedReceipt}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedReceipt(null)}
        >
          <Pressable style={styles.receiptSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />

            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptBrand}>M2N HOTELS & RESORTS</Text>
                <Text style={styles.receiptTaxTitle}>Official Tax Invoice & Payment Receipt</Text>
                <Text style={styles.receiptGst}>GSTIN: 09AAECM2N1234F1Z5</Text>
              </View>
              <View style={styles.paidStamp}>
                <Text style={styles.paidStampText}>PAID</Text>
              </View>
            </View>

            <View style={styles.receiptCardBody}>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Booking Reference</Text>
                <Text style={styles.receiptLineBold}>{selectedReceipt?.bookingId}</Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Property</Text>
                <Text style={styles.receiptLineVal}>{selectedReceipt?.hotelName}</Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Stay Dates</Text>
                <Text style={styles.receiptLineVal}>{selectedReceipt?.dates}</Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Payment Channel</Text>
                <Text style={styles.receiptLineVal}>{selectedReceipt?.paymentMethod}</Text>
              </View>
              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Transaction Ref</Text>
                <Text style={styles.receiptLineVal}>{selectedReceipt?.txnId}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptLine}>
                <Text style={styles.receiptLineLabel}>Total Amount Paid (INR)</Text>
                <Text style={styles.receiptGrandTotal}>{selectedReceipt?.amount}</Text>
              </View>
              <Text style={styles.taxInclusiveNote}>
                Inclusive of 12% Hospitality GST & Luxury Surcharges
              </Text>
            </View>

            <Pressable
              style={styles.closeModalBtn}
              onPress={() => setSelectedReceipt(null)}
            >
              <Text style={styles.closeModalBtnText}>Close Receipt</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* =================================================================== */}
      {/* 2. DIGITAL STAY VOUCHER MODAL                                       */}
      {/* =================================================================== */}
      <Modal
        visible={!!selectedVoucher}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVoucher(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedVoucher(null)}
        >
          <Pressable style={styles.voucherSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />

            <View style={styles.voucherHeaderRow}>
              <Ionicons
                name={
                  selectedVoucher?.status === 'Cancelled'
                    ? 'close-circle'
                    : selectedVoucher?.status === 'Completed'
                    ? 'checkmark-done-circle'
                    : 'shield-checkmark'
                }
                size={24}
                color={
                  selectedVoucher?.status === 'Cancelled'
                    ? '#DC2626'
                    : selectedVoucher?.status === 'Completed'
                    ? '#334155'
                    : '#EA580C'
                }
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.voucherTitle}>
                  {selectedVoucher?.status === 'Cancelled'
                    ? 'Cancellation & Refund Voucher'
                    : selectedVoucher?.status === 'Completed'
                    ? 'Completed Stay Archive'
                    : 'Digital Stay Voucher'}
                </Text>
                <Text style={styles.voucherSub}>
                  {selectedVoucher?.status === 'Cancelled'
                    ? '100% Refund Confirmation Record'
                    : selectedVoucher?.status === 'Completed'
                    ? 'Official Stay Confirmation & Verification'
                    : 'Present at Reception for Instant Check-in'}
                </Text>
              </View>
            </View>

            <View style={styles.voucherPass}>
              <Text style={styles.voucherHotelName}>{selectedVoucher?.hotelName}</Text>
              <Text style={styles.voucherDates}>{selectedVoucher?.dates}</Text>
              <Text style={styles.voucherIdLarge}>BOOKING ID: {selectedVoucher?.bookingId}</Text>

              <View
                style={[
                  styles.voucherStatusPill,
                  selectedVoucher?.status === 'Upcoming' && { backgroundColor: '#16A34A' },
                  selectedVoucher?.status === 'Completed' && { backgroundColor: '#334155' },
                  selectedVoucher?.status === 'Cancelled' && { backgroundColor: '#DC2626' }
                ]}
              >
                <Text style={styles.voucherStatusPillText}>
                  {selectedVoucher?.status === 'Upcoming' && 'STATUS: CONFIRMED & PAID'}
                  {selectedVoucher?.status === 'Completed' && 'STATUS: STAY COMPLETED'}
                  {selectedVoucher?.status === 'Cancelled' && 'STATUS: CANCELLED & REFUNDED'}
                </Text>
              </View>

              <View style={styles.barcodeWrap}>
                <View style={styles.fakeBarcode} />
                <Text style={styles.barcodeNum}>{selectedVoucher?.txnId} • M2N-VERIFIED</Text>
              </View>
            </View>

            <Pressable
              style={styles.closeModalBtn}
              onPress={() => setSelectedVoucher(null)}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignSelf: 'stretch',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1
  },
  newTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4
  },
  newTripBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },

  /* 3 EQUAL-WIDTH RIGID TABS (33.333% EACH) */
  tabsRow: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  tabBtn: {
    flex: 1,
    width: '33.333%',
    maxWidth: '33.333%',
    flexBasis: '33.333%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  tabBtnActive: {},
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  tabBtnTextActive: {
    fontWeight: '800',
    color: '#EA580C'
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10
  },
  countBadgeActive: {
    backgroundColor: '#FFEDD5'
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  countTextActive: {
    color: '#EA580C'
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 3,
    backgroundColor: '#EA580C',
    borderRadius: 1.5
  },

  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFC',
    alignSelf: 'stretch'
  },
  content: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'stretch',
    padding: 16,
    paddingBottom: 110
  },

  /* UNIFORM TRIP CARD WITH STRETCHED RIGID WIDTH */
  tripCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  cardCover: {
    height: 160,
    width: '100%',
    justifyContent: 'space-between',
    padding: 14
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  statusBadgeUpcoming: {
    backgroundColor: '#16A34A'
  },
  statusBadgeCompleted: {
    backgroundColor: '#334155'
  },
  statusBadgeCancelled: {
    backgroundColor: '#DC2626'
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  coverContent: {},
  bookingIdText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFEDD5',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  hotelTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2
  },
  hotelLocationText: {
    fontSize: 12,
    color: '#E2E8F0'
  },

  cardBody: {
    width: '100%',
    padding: 16
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  infoColLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8
  },
  infoColRight: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
    paddingLeft: 8
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 3
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2
  },
  infoSubText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12
  },

  /* Payment Details Box (Uniform across all cards) */
  paymentDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  payDetailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3.5
  },
  payDetailLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  payDetailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right'
  },
  payDetailAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#EA580C'
  },
  tripStatusNoticeBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 8
  },
  statusNoticeUpcoming: {
    backgroundColor: '#DCFCE7'
  },
  statusNoticeCompleted: {
    backgroundColor: '#F1F5F9'
  },
  statusNoticeCancelled: {
    backgroundColor: '#FEE2E2'
  },
  tripStatusNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    minWidth: 0
  },

  /* EXACT 50% / 50% UNIFORM ACTION BUTTONS */
  uniformActionRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10
  },
  actionBtnLeft: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1.2,
    borderColor: '#EA580C',
    borderRadius: 12
  },
  actionBtnLeftText: {
    color: '#EA580C',
    fontSize: 12.5,
    fontWeight: '800'
  },
  actionBtnRight: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12
  },
  actionBtnRightText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800'
  },

  /* UNIFORM BOTTOM HELPER LINK ROW */
  cardFooterActionRow: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  footerLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  cancelLinkText: {
    fontSize: 11.5,
    color: '#DC2626',
    fontWeight: '600'
  },
  rebookLinkText: {
    fontSize: 11.5,
    color: '#EA580C',
    fontWeight: '700'
  },
  refundedLinkText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600'
  },

  /* EMPTY STATE */
  emptyContainer: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 320
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  receiptSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40
  },
  voucherSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  receiptBrand: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5
  },
  receiptTaxTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  receiptGst: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1
  },
  paidStamp: {
    borderWidth: 2,
    borderColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    transform: [{ rotate: '-8deg' }]
  },
  paidStampText: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1
  },
  receiptCardBody: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20
  },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  receiptLineLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  receiptLineVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  receiptLineBold: {
    fontSize: 13,
    fontWeight: '900',
    color: '#EA580C'
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10
  },
  receiptGrandTotal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#EA580C'
  },
  taxInclusiveNote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right'
  },
  closeModalBtn: {
    backgroundColor: '#0F172A',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  voucherTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A'
  },
  voucherSub: {
    fontSize: 12,
    color: '#64748B'
  },
  voucherPass: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#EA580C',
    alignItems: 'center',
    marginBottom: 20
  },
  voucherHotelName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4
  },
  voucherDates: {
    fontSize: 13,
    color: '#EA580C',
    fontWeight: '700',
    marginBottom: 12
  },
  voucherIdLarge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 16
  },
  voucherStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 16
  },
  voucherStatusPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  barcodeWrap: {
    alignItems: 'center',
    width: '100%'
  },
  fakeBarcode: {
    height: 42,
    width: '80%',
    backgroundColor: '#0F172A',
    borderRadius: 4,
    marginBottom: 6
  },
  barcodeNum: {
    fontSize: 10,
    color: '#64748B',
    letterSpacing: 2
  }
});
