// In-memory reactive trips store for M2N Hotels
// Only shows trips where payment has been completed (or refunded on cancellation)

let trips = [
  {
    id: 'trip-up-01',
    hotelName: 'M2N Grand Palace & Spa',
    location: 'Udaipur, Rajasthan',
    roomType: 'Royal Lake View Suite',
    dates: '24 Dec - 28 Dec, 2026',
    bookingId: 'M2N-10293',
    txnId: 'TXN49201948',
    status: 'Upcoming',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI Transfer (GPAY)',
    paidAt: '28 Sep 2026, 11:20',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    guests: '2 Guests • 1 Room',
    amount: '₹36,960',
    numericAmount: 36960
  },
  {
    id: 'trip-past-01',
    hotelName: 'M2N Heritage Palace',
    location: 'Jaipur, Rajasthan',
    roomType: 'Heritage Courtyard Suite',
    dates: '10 Sep - 13 Sep, 2026',
    bookingId: 'M2N-71284',
    txnId: 'TXN89214710',
    status: 'Completed',
    paymentStatus: 'PAID',
    paymentMethod: 'Bank Transfer (HDFC)',
    paidAt: '08 Sep 2026, 14:32',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    guests: '2 Guests • 1 Room',
    amount: '₹28,560',
    numericAmount: 28560
  },
  {
    id: 'trip-canc-01',
    hotelName: 'M2N Mountain Retreat',
    location: 'Shimla, Himachal Pradesh',
    roomType: 'Cedar Mountain Lodge Suite',
    dates: '01 Nov - 04 Nov, 2026',
    bookingId: 'M2N-55192',
    txnId: 'TXN31948502',
    status: 'Cancelled',
    paymentStatus: 'REFUNDED',
    refundStatus: '100% Full refund of ₹24,192 credited to UPI ID (GPAY)',
    paymentMethod: 'UPI Transfer (GPAY)',
    paidAt: '25 Sep 2026, 18:40',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    guests: '2 Guests • 1 Room',
    amount: '₹24,192',
    numericAmount: 24192
  }
];

const listeners = new Set();

export const tripsStore = {
  getTrips() {
    return [...trips];
  },

  getTripsByTab(tab) {
    return trips.filter((t) => t.status.toLowerCase() === tab.toLowerCase());
  },

  addPaidTrip(tripData) {
    const bookingId = tripData.bookingId || `M2N-${Math.floor(10000 + Math.random() * 90000)}`;
    const txnId = tripData.txnId || `TXN${Date.now().toString().slice(-8)}`;

    // Guard 1: Deduplication by bookingId or txnId
    const existingById = trips.find(
      (t) => t.bookingId === bookingId || (t.txnId && t.txnId === txnId)
    );
    if (existingById) {
      console.warn('Duplicate booking ignored (matching ID):', bookingId);
      return existingById;
    }

    // Guard 2: Prevent rapid double submission (same hotel, dates within 4 seconds)
    const now = Date.now();
    const recentDuplicate = trips.find(
      (t) =>
        t.hotelName === (tripData.hotelName || 'Zaarang Hotel & Suites') &&
        t.dates === (tripData.dates || `${tripData.checkIn || '15 Oct'} - ${tripData.checkOut || '18 Oct 2026'}`) &&
        t._timestamp &&
        now - t._timestamp < 4000
    );
    if (recentDuplicate) {
      console.warn('Duplicate booking ignored (submitted within 4s):', recentDuplicate.bookingId);
      return recentDuplicate;
    }

    const newTrip = {
      id: `trip-${now}-${Math.floor(Math.random() * 1000)}`,
      _timestamp: now,
      hotelName: tripData.hotelName || 'Zaarang Hotel & Suites',
      location: tripData.location || 'Lucknow, Uttar Pradesh',
      roomType: tripData.roomType || 'Royal Heritage Suite',
      dates: tripData.dates || `${tripData.checkIn || '15 Oct'} - ${tripData.checkOut || '18 Oct 2026'}`,
      bookingId: bookingId,
      txnId: txnId,
      status: 'Upcoming',
      paymentStatus: 'PAID',
      paymentMethod: tripData.paymentMethod || 'UPI Transfer (GPAY)',
      paidAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      image: tripData.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      guests: `${tripData.guestsCount || 2} Guests • ${tripData.roomsCount || 1} Room`,
      amount: tripData.amount || `₹${(tripData.total || 15120).toLocaleString('en-IN')}`,
      numericAmount: tripData.total || 15120
    };

    // Prepend to trips list
    trips = [newTrip, ...trips];
    this.notify();
    return newTrip;
  },

  cancelTrip(tripId) {
    trips = trips.map((t) => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'Cancelled',
          paymentStatus: 'REFUNDED',
          refundStatus: `100% Full refund of ${t.amount} credited to ${t.paymentMethod}`
        };
      }
      return t;
    });
    this.notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((listener) => {
      try {
        listener([...trips]);
      } catch (err) {
        console.error('Error notifying trip listener:', err);
      }
    });
  }
};
