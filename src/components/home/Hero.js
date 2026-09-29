import React from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../common/Logo';
import PrimaryButton from '../common/PrimaryButton';
import { COLORS } from '../../theme/colors';

export default function Hero({ onBook }) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=90' }}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <LinearGradient colors={['rgba(6,14,12,0.25)', 'rgba(6,14,12,0.78)']} style={StyleSheet.absoluteFill} />
      <View style={styles.top}><Logo light /></View>
      <View style={styles.content}>
        <Text style={styles.kicker}>M2N GROUP OF HOTELS</Text>
        <Text style={styles.title}>Where{'\n'}Architecture{'\n'}Breathes.</Text>
        <Text style={styles.copy}>A hotel experience shaped by space, material and quiet details.</Text>
        <PrimaryButton title="Book your stay" onPress={onBook} />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  hero: { height: 610, justifyContent: 'space-between' },
  image: { width: '100%' },
  top: { paddingHorizontal: 24, paddingTop: 16 },
  content: { padding: 24, paddingBottom: 44 },
  kicker: { color: COLORS.goldLight, fontSize: 10, fontWeight: '800', letterSpacing: 2.2, marginBottom: 12 },
  title: { color: COLORS.white, fontSize: 54, lineHeight: 55, fontWeight: '300', letterSpacing: -1 },
  copy: { color: '#E8E7E1', fontSize: 15, lineHeight: 23, marginTop: 18, marginBottom: 24, maxWidth: 330 }
});
