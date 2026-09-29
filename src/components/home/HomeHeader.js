import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function HomeHeader({ onSearchPress, onProfilePress }) {
  return (
    <View style={styles.header}>
      {/* Top Brand Bar */}
      <View style={styles.brandRow}>
        <Image
          source={require('../../../assets/m2n_logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { backgroundColor: '#E2E8F0' }
            ]}
            onPress={onSearchPress}
          >
            <Ionicons name="search-outline" size={20} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      {/* Title Text */}
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Find Your</Text>
        <Text style={styles.title}>Perfect Stay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: COLORS.background
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  logo: {
    width: 120,
    height: 36
  },
  textContainer: {
    marginTop: 2
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 2
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  }
});
