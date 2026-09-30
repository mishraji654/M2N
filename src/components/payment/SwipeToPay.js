import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BUTTON_HEIGHT = 58;
const THUMB_SIZE = 50;
const PADDING = 4;

export default function SwipeToPay({
  onSwipeSuccess,
  totalAmount = '₹15,120',
  disabled = false
}) {
  const [containerWidth, setContainerWidth] = useState(300);
  const [swiped, setSwiped] = useState(false);
  const hasTriggeredRef = useRef(false);
  const dragX = useRef(new Animated.Value(0)).current;

  const maxDrag = Math.max(0, containerWidth - THUMB_SIZE - PADDING * 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !swiped && !hasTriggeredRef.current,
      onMoveShouldSetPanResponder: () => !disabled && !swiped && !hasTriggeredRef.current,
      onPanResponderMove: (_, gestureState) => {
        if (swiped || disabled || hasTriggeredRef.current) return;
        const newX = Math.max(0, Math.min(gestureState.dx, maxDrag));
        dragX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (swiped || disabled || hasTriggeredRef.current) return;
        if (gestureState.dx > maxDrag * 0.7) {
          // Immediately lock so it can NEVER fire twice
          hasTriggeredRef.current = true;
          setSwiped(true);
          Animated.timing(dragX, {
            toValue: maxDrag,
            duration: 150,
            useNativeDriver: false
          }).start(() => {
            if (onSwipeSuccess) onSwipeSuccess();
          });
        } else {
          // Spring back to start
          Animated.spring(dragX, {
            toValue: 0,
            friction: 5,
            tension: 50,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  // Text opacity fades as thumb moves
  const textOpacity = dragX.interpolate({
    inputRange: [0, maxDrag * 0.6, maxDrag],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.track, disabled && styles.trackDisabled]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0) setContainerWidth(w);
        }}
      >
        {/* Shimmer/Fill track background as thumb moves */}
        <Animated.View
          style={[
            styles.fillTrack,
            {
              width: Animated.add(dragX, new Animated.Value(THUMB_SIZE + PADDING * 2))
            }
          ]}
        />

        {/* Center Prompt Text */}
        <Animated.View
          style={[styles.textContainer, { opacity: textOpacity }]}
          pointerEvents="none"
        >
          <Text style={styles.trackText}>
            Swipe to Pay {totalAmount}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#EA580C"
            style={{ marginLeft: 4 }}
          />
        </Animated.View>

        {/* Sliding Thumb Handle */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: dragX }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Ionicons
            name={swiped ? 'checkmark-circle' : 'arrow-forward'}
            size={22}
            color="#FFFFFF"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: 10
  },
  track: {
    width: '100%',
    alignSelf: 'stretch',
    height: BUTTON_HEIGHT,
    backgroundColor: '#0F172A', // Obsidian Black theme
    borderRadius: BUTTON_HEIGHT / 2,
    position: 'relative',
    justifyContent: 'center',
    padding: PADDING,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  trackDisabled: {
    opacity: 0.5
  },
  fillTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    borderRadius: BUTTON_HEIGHT / 2
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40
  },
  trackText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#EA580C', // Signature Orangish/Terracotta
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6
  }
});
