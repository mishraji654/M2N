import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  ImageBackground,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('guest@m2nhotels.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    navigation.replace('MainTabs');
  };

  const handleGuest = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Luxury Grand Hotel & Resort Background Image */}
      <ImageBackground
        source={require('../../assets/login_hero.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Cinematic Scrim Gradient Overlay for Contrast */}
        <LinearGradient
          colors={[
            'rgba(4, 6, 14, 0.72)',
            'rgba(4, 6, 14, 0.65)',
            'rgba(4, 6, 14, 0.94)'
          ]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
          {/* Top Navigation Bar */}
          <View style={styles.topBar}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View style={styles.portalBadge}>
              <View style={styles.portalDot} />
              <Text style={styles.portalBadgeText}>MEMBER PRIVILEGES</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Centered Brand Header */}
            <View style={styles.brandHeader}>
              <Image
                source={require('../../assets/m2n_logo2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to manage your stays, unlock exclusive rates & enjoy bespoke hospitality.
              </Text>
            </View>

            {/* Frosted Glass Login Card */}
            <View style={styles.glassCard}>
              {/* Hotel Perks Row */}
              <View style={styles.perksRow}>
                <View style={styles.perkBadge}>
                  <Ionicons name="pricetag-outline" size={13} color="#FCD34D" style={{ marginRight: 4 }} />
                  <Text style={styles.perkBadgeText}>Member Rates</Text>
                </View>
                <View style={styles.perkBadge}>
                  <Ionicons name="cafe-outline" size={13} color="#FCD34D" style={{ marginRight: 4 }} />
                  <Text style={styles.perkBadgeText}>Free Breakfast</Text>
                </View>
                <View style={styles.perkBadge}>
                  <Ionicons name="flash-outline" size={13} color="#FCD34D" style={{ marginRight: 4 }} />
                  <Text style={styles.perkBadgeText}>Flex Check-In</Text>
                </View>
              </View>

              {/* Email Address */}
              <Text style={styles.fieldLabel}>EMAIL OR MEMBER ID</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="rgba(255, 255, 255, 0.6)" style={styles.fieldIcon} />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="rgba(255, 255, 255, 0.6)" style={styles.fieldIcon} />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </Pressable>
              </View>

              {/* Options Row */}
              <View style={styles.optionsRow}>
                <Pressable
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </Pressable>

                <Pressable onPress={() => Alert.alert('Forgot Password', 'Password reset instructions have been sent to your email.')}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Primary Sign In Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.signInButton,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] }
                ]}
                onPress={handleLogin}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Logins */}
              <View style={styles.socialRow}>
                <Pressable
                  style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.8 }]}
                  onPress={handleLogin}
                >
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                  <Text style={styles.socialBtnText}>Google</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.8 }]}
                  onPress={handleLogin}
                >
                  <Ionicons name="logo-apple" size={19} color="#FFFFFF" />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </Pressable>
              </View>

              {/* Guest Booking Option */}
              <Pressable
                style={({ pressed }) => [styles.guestBtn, pressed && { opacity: 0.75 }]}
                onPress={handleGuest}
              >
                <Ionicons name="bed-outline" size={17} color="#EA580C" style={{ marginRight: 6 }} />
                <Text style={styles.guestBtnText}>Browse & Book as Guest</Text>
              </Pressable>

              {/* Footer */}
              <View style={styles.footerRow}>
                <Text style={styles.footerMuted}>Not an M2N Member yet? </Text>
                <Pressable onPress={() => Alert.alert('Join M2N Privileges', 'Complimentary membership is included with your stay!')}>
                  <Text style={styles.footerHighlight}>Join Free</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#04060E',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxWidth: 480,
        marginHorizontal: 'auto',
        minHeight: '100vh'
      }
    })
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  safeArea: {
    flex: 1,
    width: '100%'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'web' ? 24 : 10,
    paddingBottom: 6
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)'
      }
    })
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16
  },
  portalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginRight: 6
  },
  portalBadgeText: {
    color: '#FEF3C7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 36
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 18
  },
  logo: {
    width: 155,
    height: 58,
    marginBottom: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center',
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  glassCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)'
      }
    })
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
    flexWrap: 'wrap'
  },
  perkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12
  },
  perkBadgeText: {
    color: '#FEF3C7',
    fontSize: 10,
    fontWeight: '700'
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.6,
    marginBottom: 6
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 14
  },
  fieldIcon: {
    marginRight: 10
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF'
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  rememberText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500'
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C'
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  dividerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 10,
    fontWeight: '500'
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(234, 88, 12, 0.14)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.35)',
    marginBottom: 14
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4
  },
  footerMuted: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    fontWeight: '500'
  },
  footerHighlight: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '800'
  }
});
