import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function Logo({ light = false, size = 'medium', showTagline = true, style }) {
  
  const logoSource = light
    ? require('../../../assets/m2n_logo2.png')
    : require('../../../assets/m2n_logo1.png');

  const dimensions = {
    small: { width: 100, height: 32 },
    medium: { width: 140, height: 44 },
    large: { width: 180, height: 56 }
  }[size] || { width: 140, height: 44 };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSource}
        style={[styles.logoImage, dimensions]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    maxWidth: '100%'
  }
});
