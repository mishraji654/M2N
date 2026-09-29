import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeButton from '../components/common/SwipeButton';

const ONBOARDING_IMAGE_URI =
  'https://images.unsplash.com/photo-1673388756897-28832439e9aa?fm=jpg&q=80&w=1600&auto=format&fit=crop';

export default function OnboardingScreen({ navigation }) {
  const handleSwipeComplete = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed Luxury Night Hotel Background Image */}
      <Image
        source={{ uri: ONBOARDING_IMAGE_URI }}
        defaultSource={require('../../assets/onboarding_hero.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Soft Transparent Scrim Gradient for Readability */}
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.45)',
          'transparent',
          'rgba(0, 0, 0, 0.3)',
          'rgba(0, 0, 0, 0.92)'
        ]}
        locations={[0, 0.22, 0.52, 1]}
        style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
      />

      {/* Top Header with M2N Logo */}
      <SafeAreaView style={styles.topSafeArea}>
        <Image
          source={require('../../assets/m2n_logo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </SafeAreaView>

      {/* Bottom Content Area */}
      <View style={styles.bottomContent}>
        <Text style={styles.title}>
          Discover Your Perfect{'\n'}Place Book Now.
        </Text>

        <Text style={styles.subtitle}>
          Discover your perfect place for any trip, from cosy stays to luxury escapes.
        </Text>

        {/* Interactive Swipe Button */}
        <View style={styles.swipeContainer}>
          <SwipeButton
            title="Get Started"
            onSwipeComplete={handleSwipeComplete}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    position: 'relative',
    ...Platform.select({
      web: {
        minHeight: '100vh',
        overflow: 'hidden'
      }
    })
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  topSafeArea: {
    paddingTop: Platform.OS === 'web' ? 44 : (Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight || 24) + 12),
    paddingHorizontal: 22,
    alignItems: 'flex-start',
    zIndex: 10
  },
  logo: {
    width: 140,
    height: 48
  },
  bottomContent: {
    width: '100%',
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'web' ? 36 : (Platform.OS === 'ios' ? 44 : 26),
    zIndex: 10,
    ...Platform.select({
      web: {
        maxWidth: 480,
        marginHorizontal: 'auto'
      }
    })
  },
  title: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '900',
    lineHeight: Platform.OS === 'web' ? 38 : 34,
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 20,
    maxWidth: 320,
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
