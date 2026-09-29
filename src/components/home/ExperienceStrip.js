import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const items = [
  ['01', 'ARCHITECTURE', 'Spaces designed to be experienced.'],
  ['02', 'HOSPITALITY', 'Service that stays thoughtful and discreet.'],
  ['03', 'ATMOSPHERE', 'Warm materials, light and calm.']
];

export default function ExperienceStrip() {
  return (
    <View style={styles.wrap}>
      {items.map(([num, title, text]) => (
        <View key={num} style={styles.item}>
          <Text style={styles.num}>{num}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { backgroundColor: COLORS.ink, padding: 24, paddingVertical: 34 },
  item: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#263531', paddingVertical: 20, gap: 18 },
  num: { color: COLORS.gold, fontSize: 11, fontWeight: '800' },
  title: { color: COLORS.white, fontSize: 12, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 },
  text: { color: '#AAB4B0', fontSize: 13, lineHeight: 20 }
});
