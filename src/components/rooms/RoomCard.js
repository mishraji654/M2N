import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function RoomCard({ room, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.985 }] }
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{room.name}</Text>
          <Text style={styles.price}>{room.price}</Text>
        </View>

        <Text style={styles.subtitle}>{room.subtitle}</Text>

        <View style={styles.featuresRow}>
          {room.features?.slice(0, 3).map((f, idx) => (
            <View key={idx} style={styles.featurePill}>
              <Ionicons name="checkmark-sharp" size={12} color={COLORS.primary} style={{ marginRight: 3 }} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <Text style={styles.viewDetailsText}>View Room Details</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4
  },
  image: {
    width: '100%',
    height: 190
  },
  body: {
    padding: 18
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginRight: 10
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 4
  }
});
