import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function SectionTitle({ eyebrow, title, light = false }) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={[styles.eyebrow, light && styles.light]}>{eyebrow}</Text> : null}
      <Text style={[styles.title, light && styles.light]}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  eyebrow: { color: COLORS.gold, fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 },
  title: { color: COLORS.ink, fontSize: 30, lineHeight: 36, fontWeight: '500' },
  light: { color: COLORS.white }
});
