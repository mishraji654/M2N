import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwipeButton from '../components/common/SwipeButton';

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleSwipeComplete = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed Luxury Night Hotel Background Image */}
      <ImageBackground
        source={require('../../assets/onboarding_hero.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Soft Transparent Scrim Gradient for Readability */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.65)',
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0.45)',
            'rgba(0, 0, 0, 0.96)'
          ]}
          locations={[0, 0.25, 0.55, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Foreground Content Container with exact safe insets */}
        <View
          style={[
            styles.content,
            {
              paddingTop: Math.max(insets.top, 24) + (Platform.OS === 'android' ? 14 : 8),
              paddingBottom: Math.max(insets.bottom, 16) + (Platform.OS === 'android' ? 18 : 12)
            }
          ]}
        >
          {/* Top Header with M2N Logo */}
          <View style={styles.topHeader}>
            <Image
              source={require('../../assets/m2n_logo2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Content Area */}
          <View style={styles.bottomContent}>
            <Text style={styles.title}>
              Discover Your Perfect{'\n'}Place, Book Now.
            </Text>

            <Text style={styles.subtitle}>
              Discover your perfect place for any trip, from cosy stays to luxury escapes.
            </Text>

            {/* Interactive Swipe Button */}
            <View style={styles.swipeContainer}>
              <SwipeButton
                title="Swipe to continue"
                onSwipeComplete={handleSwipeComplete}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    ...Platform.select({
      web: {
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden'
      }
    })
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    ...Platform.select({
      web: {
        maxWidth: 480,
        marginHorizontal: 'auto',
        width: '100%'
      }
    })
  },
  topHeader: {
    width: '100%',
    alignItems: 'flex-start'
  },
  logo: {
    width: 150,
    height: 52
  },
  bottomContent: {
    width: '100%'
  },
  title: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '800',
    lineHeight: Platform.OS === 'web' ? 38 : 35,
    letterSpacing: -0.3,
    marginBottom: 8,
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.90)',
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '400',
    marginBottom: 20,
    maxWidth: 340,
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6
  },
  swipeContainer: {
    width: '100%',
    minHeight: 64,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
