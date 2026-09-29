import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function SectionHeader({ title = 'Most Popular', actionText = 'See all', onActionPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary
  }
});
