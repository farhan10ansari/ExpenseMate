import React, { useCallback } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHaptics } from '@/contexts/HapticsProvider';
import { uiLog as log } from '@/lib/logger';


interface Props {
  currentIndex: SharedValue<number>;
  length: number;
  flatListRef: any;
  onFinish: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OnboardingButton({
  currentIndex,
  length,
  flatListRef,
  onFinish,
}: Props) {
  const theme = useTheme();
  const { hapticImpact } = useHaptics();

  const animatedStyle = useAnimatedStyle(() => {
    const isLastSlide = currentIndex.value === length - 1;

    return {
      width: withSpring(isLastSlide ? 180 : 120, {
        damping: 15,
        stiffness: 100,
      }),
      opacity: withTiming(1, { duration: 300 }),
    };
  }, [currentIndex, length]);

  const textAnimatedStyle = useAnimatedStyle(() => {
    const isLastSlide = currentIndex.value === length - 1;

    return {
      opacity: withTiming(isLastSlide ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateX: withTiming(isLastSlide ? 0 : 30, { duration: 200 }),
        },
      ],
    };
  }, [currentIndex, length]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const isLastSlide = currentIndex.value === length - 1;

    return {
      opacity: withTiming(isLastSlide ? 0 : 1, { duration: 200 }),
      transform: [
        {
          translateX: withTiming(isLastSlide ? -30 : 0, { duration: 200 }),
        },
      ],
    };
  }, [currentIndex, length]);

  const onPress = useCallback(() => {
    log.info("OnboardingButton pressed", { currentIndex: currentIndex.value, length });
    if (currentIndex.value === length - 1) {
      onFinish();
    } else {
      hapticImpact();
      flatListRef?.current?.scrollToIndex({
        index: currentIndex.value + 1,
        animated: true,
      });
    }
  }, [currentIndex, length, flatListRef, onFinish]);

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme.colors.primary },
        animatedStyle,
      ]}
    >
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
          Get Started
        </Text>
      </Animated.View>

      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <Icon
          source="arrow-right"
          size={24}
          color={theme.colors.onPrimary}
        />
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    height: 56,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textContainer: {
    position: 'absolute',
  },
  iconContainer: {
    position: 'absolute',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
