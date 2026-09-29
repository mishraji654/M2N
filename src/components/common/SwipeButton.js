import React, { useRef, useState, useEffect } from 'react';
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
import { COLORS } from '../../theme/colors';

const BUTTON_HEIGHT = 62;
const THUMB_SIZE = 48;
const PADDING = 7;

export default function SwipeButton({
  onSwipeComplete,
  title = 'Swipe to continue'
}) {
  const windowWidth = Dimensions.get('window').width;
  const defaultWidth = Math.min(windowWidth - 44, 460);
  const [trackWidth, setTrackWidth] = useState(defaultWidth);
  const panX = useRef(new Animated.Value(0)).current;
  const isCompleted = useRef(false);

  // Maximum distance thumb can slide
  const maxSwipe = Math.max(60, trackWidth - THUMB_SIZE - PADDING * 2);
  const maxSwipeRef = useRef(maxSwipe);
  maxSwipeRef.current = maxSwipe;

  const onSwipeCompleteRef = useRef(onSwipeComplete);
  onSwipeCompleteRef.current = onSwipeComplete;

  // Subtle pulsing animation on chevrons
  const chevronPulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(chevronPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true
        }),
        Animated.timing(chevronPulse, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true
        })
      ])
    );
    pulseAnim.start();
    return () => pulseAnim.stop();
  }, [chevronPulse]);

  const animateToComplete = () => {
    if (isCompleted.current) return;
    isCompleted.current = true;

    Animated.timing(panX, {
      toValue: maxSwipeRef.current,
      duration: 220,
      useNativeDriver: false
    }).start(() => {
      if (onSwipeCompleteRef.current) {
        onSwipeCompleteRef.current();
      }
      setTimeout(() => {
        resetPosition();
      }, 700);
    });
  };

  const resetPosition = () => {
    Animated.spring(panX, {
      toValue: 0,
      friction: 8,
      tension: 45,
      useNativeDriver: false
    }).start(() => {
      isCompleted.current = false;
    });
  };

  const touchStartTime = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 3,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dx) > 3,

      onPanResponderGrant: () => {
        touchStartTime.current = Date.now();
        panX.stopAnimation();
      },

      onPanResponderMove: (_, gestureState) => {
        if (isCompleted.current) return;
        const max = maxSwipeRef.current;
        const currentSwipe = Math.max(0, Math.min(gestureState.dx, max));
        panX.setValue(currentSwipe);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (isCompleted.current) return;
        const max = maxSwipeRef.current;
        const duration = Date.now() - touchStartTime.current;

        // Either a quick tap (< 15px movement within 500ms) or a swipe (> 25% or quick flick)
        const isTap = Math.abs(gestureState.dx) < 15 && duration < 500;
        const isSwiped = gestureState.dx > max * 0.25 || gestureState.vx > 0.25;

        if (isTap || isSwiped) {
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

  // Text fades out smoothly as thumb drags over it
  const labelOpacity = panX.interpolate({
    inputRange: [0, Math.max(1, maxSwipe * 0.5)],
    outputRange: [1, 0.05],
    extrapolate: 'clamp'
  });

  // Track progress fill expands with thumb using standard interpolate
  const activeFillWidth = panX.interpolate({
    inputRange: [0, Math.max(1, maxSwipe)],
    outputRange: [THUMB_SIZE + PADDING * 2, maxSwipe + THUMB_SIZE + PADDING * 2],
    extrapolate: 'clamp'
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        if (width > 50 && Math.abs(width - trackWidth) > 3) {
          setTrackWidth(width);
        }
      }}
    >
      {/* Outer interactive Track */}
      <View
        style={styles.track}
        collapsable={false}
        {...panResponder.panHandlers}
      >
        {/* Dynamic Glowing Accent Fill */}
        <Animated.View
          style={[
            styles.activeFill,
            { width: activeFillWidth, pointerEvents: 'none' }
          ]}
          pointerEvents="none"
        />

        {/* Centered High-Contrast Label & Chevrons */}
        <View pointerEvents="none" style={[styles.labelContainer, { pointerEvents: 'none' }]}>
          <Animated.View style={[styles.labelRow, { opacity: labelOpacity }]}>
            <Text style={styles.sliderText} numberOfLines={1}>{title}</Text>
            <Animated.View style={[styles.chevronGroup, { opacity: chevronPulse }]}>
              <Ionicons
                name="chevron-forward"
                size={17}
                color="rgba(255,255,255,0.4)"
                style={{ marginRight: -6 }}
              />
              <Ionicons
                name="chevron-forward"
                size={17}
                color="rgba(255,255,255,0.8)"
                style={{ marginRight: -6 }}
              />
              <Ionicons
                name="chevron-forward"
                size={17}
                color="#EA580C"
              />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Draggable Knob */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: panX }],
              pointerEvents: 'none'
            }
          ]}
          pointerEvents="none"
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    height: BUTTON_HEIGHT,
    justifyContent: 'center'
  },
  track: {
    width: '100%',
    height: BUTTON_HEIGHT,
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Luxury obsidian dark glass
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.42)',
    borderRadius: BUTTON_HEIGHT / 2,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    ...Platform.select({
      web: {
        userSelect: 'none',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer'
      }
    })
  },
  activeFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(234, 88, 12, 0.38)', // Signature terracotta glow
    borderRadius: BUTTON_HEIGHT / 2
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: THUMB_SIZE + 10,
    paddingRight: 20
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginRight: 8,
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  chevronGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    left: PADDING,
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
    elevation: 6,
    zIndex: 10
  }
});
