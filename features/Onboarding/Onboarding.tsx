import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { OnboardingStep, useOnboardingData } from './OnboardingData';
import OnboardingItem from './OnboardingItem';
import PaginationDots from './PaginationDots';
import OnboardingButton from './OnboardingButton';
import usePersistentAppStore from '@/stores/usePersistentAppStore';
import { useHaptics } from '@/contexts/HapticsProvider';
import { uiLog as log } from '@/lib/logger';


export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<OnboardingStep>>();
  const updateUIFlag = usePersistentAppStore(state => state.updateUIFlag);
  const onboardingData = useOnboardingData();
  const { hapticNotify } = useHaptics();

  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'en',
    currency: 'USD',
    secureLogin: false,
    haptics: true,
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // sometimes viewableItems can be empty when scrolling fast, so we guard against that
      if (!viewableItems[0]) return;

      if (viewableItems[0]?.index !== null) {
        flatListIndex.value = viewableItems[0].index ?? 0;
      }
    },
    []
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: OnboardingStep;
      index: number;
    }) => {
      return (
        <OnboardingItem
          item={item}
          index={index}
          x={x}
          settings={settings}
          onSettingChange={setSettings}
        />
      );
    },
    [x, settings]
  );

  const onFinish = useCallback(() => {
    // Navigate to main app
    hapticNotify('success');
    updateUIFlag('onboardingCompleted', true);
    log.info("Onboarding completed, navigating to main app");
  }, [updateUIFlag, hapticNotify]);

  const onSkip = useCallback(() => {
    hapticNotify('success');
    updateUIFlag('onboardingCompleted', true);
    log.info("Onboarding skipped, navigating to main app");
  }, [updateUIFlag, hapticNotify]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ alignItems: 'flex-end', marginTop: 20, marginRight: 10 }}>
        <Button
          mode="text"
          onPress={onSkip}
          labelStyle={{ color: theme.colors.primary, fontSize: 16 }}
        >
          Skip
        </Button>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        data={onboardingData}
        keyExtractor={(item) => item.id}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 50,
        }}
      />

      <View style={styles.bottomContainer}>
        <PaginationDots length={onboardingData.length} x={x} />
        <OnboardingButton
          currentIndex={flatListIndex}
          length={onboardingData.length}
          flatListRef={flatListRef}
          onFinish={onFinish}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    alignItems: 'center',
    gap: 30,
    paddingBottom: 20,
  },
});
