import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function GalleryGrid({ images }) {
  return (
    <View style={styles.grid}>
      {images.map((uri, index) => (
        <View
          key={uri + index}
          style={[styles.card, index % 3 === 0 ? styles.tallCard : styles.regularCard]}
        >
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  regularCard: {
    width: '48%',
    height: 170
  },
  tallCard: {
    width: '100%',
    height: 240
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
