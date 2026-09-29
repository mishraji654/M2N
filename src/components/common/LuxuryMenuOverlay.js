import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MENU_PAIRS = [
  [
    { id: '01', number: '01', title: 'HOME', route: 'HomeTab' },
    { id: '02', number: '02', title: 'HOTELS', route: 'HotelsTab' }
  ],
  [
    { id: '03', number: '03', title: 'ROOMS', route: 'Rooms' },
    { id: '04', number: '04', title: 'RESTAURANT & DINE-IN', route: 'DiningTab' }
  ],
  [
    { id: '05', number: '05', title: 'EXPERIENCES', route: 'GalleryTab' },
    { id: '06', number: '06', title: 'SPA & WELLNESS', route: 'Spa' }
  ],
  [
    { id: '07', number: '07', title: 'MEETINGS & EVENTS', route: 'WeddingsTab' },
    { id: '08', number: '08', title: 'OFFERS', route: 'Offers' }
  ],
  [
    { id: '09', number: '09', title: 'GALLERY', route: 'GalleryTab' },
    { id: '10', number: '010', title: 'JOURNAL', route: 'Journal' }
  ]
];

export default function LuxuryMenuOverlay({ visible, onClose, navigation, onSelectSpecial }) {
  const handleItemPress = (item) => {
    onClose();

    if (!navigation) return;

    if (item.route === 'HomeTab') {
      navigation.navigate('HomeTab');
    } else if (item.route === 'HotelsTab') {
      navigation.navigate('HotelsTab');
    } else if (item.route === 'Rooms') {
      // Rooms is in HomeStack or HotelsStack
      navigation.navigate('Rooms');
    } else if (item.route === 'DiningTab') {
      navigation.navigate('DiningTab');
    } else if (item.route === 'GalleryTab') {
      navigation.navigate('GalleryTab');
    } else if (item.route === 'WeddingsTab') {
      navigation.navigate('WeddingsTab');
    } else if (item.route === 'Spa') {
      if (onSelectSpecial) onSelectSpecial('spa');
      else navigation.navigate('MoreTab');
    } else if (item.route === 'Offers') {
      if (onSelectSpecial) onSelectSpecial('offers');
      else navigation.navigate('HotelsTab');
    } else if (item.route === 'Journal') {
      if (onSelectSpecial) onSelectSpecial('journal');
      else navigation.navigate('MoreTab');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header matching m2nhotels.com */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/m2n_logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { backgroundColor: '#F1F5F9' }]}
            onPress={onClose}
            hitSlop={12}
          >
            <Ionicons name="close" size={22} color="#0F172A" />
          </Pressable>
        </View>

        {/* Menu Items Container */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridWrapper}>
            {MENU_PAIRS.map((pair, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.gridRow}>
                {/* Left Column Item */}
                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    styles.leftCol,
                    pressed && styles.menuItemPressed
                  ]}
                  onPress={() => handleItemPress(pair[0])}
                >
                  <Text style={styles.itemTitle}>{pair[0].title}</Text>
                  <Text style={styles.itemNumber}>{pair[0].number}</Text>
                </Pressable>

                {/* Right Column Item */}
                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    styles.rightCol,
                    pressed && styles.menuItemPressed
                  ]}
                  onPress={() => handleItemPress(pair[1])}
                >
                  <Text style={styles.itemTitle}>{pair[1].title}</Text>
                  <Text style={styles.itemNumber}>{pair[1].number}</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Bottom Brand Story & Hotline */}
          <View style={styles.footerNote}>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.footerBrand}>M2N HOTELS</Text>
                <Text style={styles.footerTagline}>Stay Better, Grow Together</Text>
              </View>
              <Pressable
                style={styles.conciergePill}
                onPress={() => {
                  onClose();
                  navigation.navigate('MoreTab', { screen: 'Contact' });
                }}
              >
                <Ionicons name="call-outline" size={14} color="#EA580C" style={{ marginRight: 6 }} />
                <Text style={styles.conciergePillText}>+91 96587 100</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  logo: {
    width: 120,
    height: 42
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    ...Platform.select({
      web: {
        maxWidth: 960,
        marginHorizontal: 'auto',
        width: '100%'
      }
    })
  },
  gridWrapper: {
    gap: Platform.OS === 'web' ? 24 : 16
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 22 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  leftCol: {
    paddingRight: 20
  },
  rightCol: {
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9'
  },
  menuItemPressed: {
    opacity: 0.65
  },
  itemTitle: {
    fontSize: Platform.OS === 'web' ? 26 : 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    flexShrink: 1
  },
  itemNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  footerNote: {
    marginTop: 48,
    paddingTop: 12
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 24
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2
  },
  footerTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  conciergePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  },
  conciergePillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EA580C'
  }
});
