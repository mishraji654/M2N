import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelectCategory(cat)}
            style={({ pressed }) => [
              styles.pill,
              isActive ? styles.activePill : styles.inactivePill,
              pressed && { opacity: 0.85 }
            ]}
          >
            <Text style={[styles.pillText, isActive ? styles.activeText : styles.inactiveText]}>
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activePill: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  inactivePill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600'
  },
  activeText: {
    color: COLORS.white,
    fontWeight: '700'
  },
  inactiveText: {
    color: COLORS.textSecondary
  }
});
