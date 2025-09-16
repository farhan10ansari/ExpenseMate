// components/onboarding/PaginationDots.tsx
import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface Props {
  length: number;
  x: SharedValue<number>;
}

// Separate component for individual dot
interface PaginationDotProps {
  index: number;
  x: SharedValue<number>;
}

function PaginationDot({ index, x }: PaginationDotProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [8, 24, 8],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [
        theme.colors.outline,
        theme.colors.primary,
        theme.colors.outline,
      ]
    );

    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      width,
      backgroundColor,
      opacity,
    };
  }, [x, index, theme]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function PaginationDots({ length, x }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <PaginationDot key={index} index={index} x={x} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
