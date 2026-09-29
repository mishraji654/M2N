import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function Screen({ children, dark = false }) {
  return (
    <SafeAreaView style={[styles.safe, dark && styles.dark]}>
      <View style={[styles.container, dark && styles.dark]}>{children}</View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  container: { flex: 1, backgroundColor: COLORS.paper },
  dark: { backgroundColor: COLORS.ink }
});
