import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const BUTTON_HEIGHT = 62;
const THUMB_SIZE = 48;
const PADDING = 7;

export default function SwipeButton({ onSwipeComplete, title = 'Get Started' }) {
  const windowWidth = Dimensions.get('window').width;
  const initialWidth = Math.min(windowWidth - 44, 420);
  const [trackWidth, setTrackWidth] = useState(initialWidth);
  const panX = useRef(new Animated.Value(0)).current;
  const isCompleted = useRef(false);

  const maxSwipe = Math.max(80, trackWidth - THUMB_SIZE - PADDING * 2);

  const animateToComplete = () => {
    if (isCompleted.current) return;
    isCompleted.current = true;

    Animated.timing(panX, {
      toValue: maxSwipe,
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      if (onSwipeComplete) {
        onSwipeComplete();
      }
      setTimeout(() => {
        resetPosition();
      }, 700);
    });
  };

  const resetPosition = () => {
    Animated.spring(panX, {
      toValue: 0,
      friction: 7,
      tension: 50,
      useNativeDriver: false
    }).start(() => {
      isCompleted.current = false;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 2,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dx) > 2,

      onPanResponderGrant: () => {
        panX.stopAnimation();
      },

      onPanResponderMove: (_, gestureState) => {
        if (isCompleted.current) return;
        const currentSwipe = Math.max(0, Math.min(gestureState.dx, maxSwipe));
        panX.setValue(currentSwipe);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (isCompleted.current) return;

        if (gestureState.dx > maxSwipe * 0.35 || gestureState.vx > 0.4) {
          animateToComplete();
        } else {
          resetPosition();
        }
      },

      onPanResponderTerminate: () => {
        if (!isCompleted.current) {
          resetPosition();
        }
      }
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        if (width > 50 && Math.abs(width - trackWidth) > 5) {
          setTrackWidth(width);
        }
      }}
    >
      {/* Background Track with Glassmorphic styling and tap fallback */}
      <Pressable
        style={styles.track}
        onPress={animateToComplete}
      >
        {/* Always-visible Label & Chevrons - Centered & High Contrast */}
        <View style={styles.labelContainer}>
          <Text style={styles.sliderText}>{title}</Text>
          <View style={styles.chevronGroup}>
            <Ionicons name="chevron-forward" size={17} color="rgba(255,255,255,0.45)" style={{ marginRight: -7 }} />
            <Ionicons name="chevron-forward" size={17} color="rgba(255,255,255,0.8)" style={{ marginRight: -7 }} />
            <Ionicons name="chevron-forward" size={17} color="#FFFFFF" />
          </View>
        </View>

        {/* Draggable Knob */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: panX }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    height: BUTTON_HEIGHT
  },
  track: {
    flex: 1,
    height: BUTTON_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: BUTTON_HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        userSelect: 'none',
        backdropFilter: 'blur(20px)'
      }
    })
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: THUMB_SIZE + 6,
    paddingRight: 16,
    pointerEvents: 'none'
  },
  sliderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  chevronGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
    ...Platform.select({
      web: {
        cursor: 'grab'
      }
    })
  }
});
