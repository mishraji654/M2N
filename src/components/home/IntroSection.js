import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionTitle from '../common/SectionTitle';
import { COLORS } from '../../theme/colors';

export default function IntroSection() {
  return (
    <View style={styles.wrap}>
      <SectionTitle eyebrow="The M2N philosophy" title="Spaces that feel considered, not crowded." />
      <Text style={styles.body}>
        M2N is presented as a collection of stays where architecture and hospitality meet. The mobile experience keeps that idea simple: strong imagery, generous spacing and a calm editorial rhythm.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 44 },
  body: { color: '#5E6965', fontSize: 16, lineHeight: 26 }
});
