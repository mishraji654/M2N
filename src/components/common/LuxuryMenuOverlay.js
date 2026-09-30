import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    { id: '06', number: '06', title: 'SPA & WELLNESS', route: 'SpaWellness' }
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
  // 10 menu item blocks + 1 footer card = 11 animated blocks
  const anims = useRef(
    [...Array(11)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset all blocks before starting the cascade
      anims.forEach((anim) => anim.setValue(0));

      // Staggered top-drop animation with 0.5s duration per block
      const animations = anims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 480, // ~0.5s per block
          easing: Easing.out(Easing.back(1.4)), // Elastic bounce like dropping/throwing from top
          useNativeDriver: true
        })
      );

      Animated.stagger(50, animations).start();
    } else {
      anims.forEach((anim) => anim.setValue(0));
    }
  }, [visible]);

  const handleItemPress = (item) => {
    onClose();

    if (!navigation) return;

    if (item.route === 'HomeTab') {
      navigation.navigate('HomeTab');
    } else if (item.route === 'HotelsTab') {
      navigation.navigate('HotelsTab');
    } else if (item.route === 'Rooms') {
      navigation.navigate('Rooms');
    } else if (item.route === 'DiningTab') {
      navigation.navigate('DiningTab');
    } else if (item.route === 'GalleryTab') {
      navigation.navigate('GalleryTab');
    } else if (item.route === 'WeddingsTab') {
      navigation.navigate('WeddingsTab');
    } else if (item.route === 'SpaWellness' || item.route === 'Spa') {
      navigation.navigate('SpaWellness');
    } else if (item.route === 'Offers') {
      navigation.navigate('Offers');
    } else if (item.route === 'Journal') {
      navigation.navigate('About');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
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
            {MENU_PAIRS.map((pair, rowIndex) => {
              const leftIdx = rowIndex * 2;
              const rightIdx = rowIndex * 2 + 1;

              return (
                <View key={`row-${rowIndex}`} style={styles.gridRow}>
                  {/* Left Column Block */}
                  <Animated.View
                    style={[
                      styles.animatedCard,
                      {
                        opacity: anims[leftIdx].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        }),
                        transform: [
                          {
                            translateY: anims[leftIdx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-45, 0]
                            })
                          },
                          {
                            scale: anims[leftIdx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.92, 1]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.menuCard,
                        pressed && styles.menuCardPressed
                      ]}
                      onPress={() => handleItemPress(pair[0])}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardNumber}>{pair[0].number}</Text>
                        <Ionicons name="arrow-forward" size={14} color="#EA580C" style={styles.cardArrow} />
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={2}>{pair[0].title}</Text>
                    </Pressable>
                  </Animated.View>

                  {/* Right Column Block */}
                  <Animated.View
                    style={[
                      styles.animatedCard,
                      {
                        opacity: anims[rightIdx].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        }),
                        transform: [
                          {
                            translateY: anims[rightIdx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-45, 0]
                            })
                          },
                          {
                            scale: anims[rightIdx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.92, 1]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.menuCard,
                        pressed && styles.menuCardPressed
                      ]}
                      onPress={() => handleItemPress(pair[1])}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardNumber}>{pair[1].number}</Text>
                        <Ionicons name="arrow-forward" size={14} color="#EA580C" style={styles.cardArrow} />
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={2}>{pair[1].title}</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              );
            })}
          </View>

          {/* Bottom Brand Story & Hotline */}
          <Animated.View
            style={[
              styles.footerNote,
              {
                opacity: anims[10].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                }),
                transform: [
                  {
                    translateY: anims[10].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-35, 0]
                    })
                  },
                  {
                    scale: anims[10].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.94, 1]
                    })
                  }
                ]
              }
            ]}
          >
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
          </Animated.View>
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        maxWidth: 720,
        marginHorizontal: 'auto',
        width: '100%'
      }
    })
  },
  gridWrapper: {
    gap: 12
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch'
  },
  animatedCard: {
    flex: 1
  },
  menuCard: {
    flex: 1,
    minHeight: 90,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1
  },
  menuCardPressed: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    transform: [{ scale: 0.98 }]
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5
  },
  cardArrow: {
    opacity: 0.7
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: 20
  },
  footerNote: {
    marginTop: 36,
    paddingTop: 8
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14
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
