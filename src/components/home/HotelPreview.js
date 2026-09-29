import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import SectionTitle from '../common/SectionTitle';
import { COLORS } from '../../theme/colors';

export default function HotelPreview({ hotels, onOpen }) {
  return (
    <View style={styles.wrap}>
      <SectionTitle eyebrow="The collection" title="Stay somewhere with a point of view." />
      {hotels.map((hotel) => (
        <Pressable key={hotel.id} onPress={() => onOpen(hotel)} style={styles.card}>
          <Image source={{ uri: hotel.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.accent}>{hotel.accent}</Text>
            <Text style={styles.name}>{hotel.name}</Text>
            <Text style={styles.description}>{hotel.description}</Text>
            <Text style={styles.link}>EXPLORE  →</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 30 },
  card: { marginBottom: 28, backgroundColor: COLORS.white },
  image: { width: '100%', height: 230 },
  info: { padding: 20 },
  accent: { color: COLORS.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  name: { color: COLORS.ink, fontSize: 25, fontWeight: '500', marginBottom: 8 },
  description: { color: '#69736F', fontSize: 14, lineHeight: 22 },
  link: { color: COLORS.ink, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 }
});
