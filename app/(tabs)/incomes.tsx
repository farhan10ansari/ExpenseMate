import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Button, FAB, Portal } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/base/ThemedText";
import IncomeCard from "@/components/main/IncomeCard";
import { Income } from "@/db/schema";
import { getIncomeById, getIncomesByMonthPaginated } from "@/repositories/IncomeRepo";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useHaptics } from "@/contexts/HapticsProvider";
import useAppStore from "@/stores/useAppStore";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import ErrorState from "@/components/main/ErrorState";
import { useScrollToTop } from "@/hooks/useScrollToTop";

type HeaderItem = {
  type: 'header';
  id: string;
  title: string;
};

type ListItem = HeaderItem | Income;

// Type guard functions for better type safety
const isHeaderItem = (item: ListItem): item is HeaderItem => {
  return 'type' in item && item.type === 'header';
};

export default function IncomesScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const { colors } = useAppTheme();
  const { hapticImpact } = useHaptics();
  const flashListRef = useRef<FlashListRef<ListItem>>(null);
  const { handleScroll, scrollToTop, showScrollToTop } = useScrollToTop(flashListRef);
  const globalSnackbar = useAppStore((state) => state.globalSnackbar);
  const insets = useSafeAreaInsets();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch incomes by month with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ["incomes"],
    queryFn: ({ pageParam = 0 }) => getIncomesByMonthPaginated({ offsetMonth: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.offsetMonth + 1 : undefined,
  });

  const listData = useMemo((): ListItem[] => {
    if (!data?.pages || !data?.pages.some(page => page.incomes.length > 0)) return [];
    return data.pages.filter((page) => page.incomes.length > 0).flatMap((page) => [
      {
        type: 'header' as const,
        id: `header-${page.month}`,
        title: page.month
      },
      ...page.incomes
    ]);
  }, [data]);


  const handleIncomeCardPress = useCallback(async (id: number) => {
    hapticImpact();
    await queryClient.prefetchQuery({
      queryKey: ["income", id.toString()],
      queryFn: () => getIncomeById(id),
    });
    router.push(`/income/${id}`);
  }, [hapticImpact, queryClient, router]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    hapticImpact();
    try {
      await queryClient.refetchQueries({ queryKey: ["incomes"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [hapticImpact, queryClient]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Render item with type guards
  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (isHeaderItem(item)) {
      return (
        <ThemedText
          type="defaultSemiBold"
          fontSize={20}
          style={[styles.sectionHeader, { color: colors.text }]}
        >
          {item.title}
        </ThemedText>
      );
    }

    // TypeScript now knows item is Income
    return (
      <IncomeCard
        income={item}
        onPress={() => handleIncomeCardPress(item.id!)}
      />
    );
  }, [colors.text, handleIncomeCardPress]);

  // Get item type for FlashList optimization
  const getItemType = useCallback((item: ListItem) => {
    return isHeaderItem(item) ? 'header' : 'income';
  }, []);

  // Key extractor that handles both types
  const keyExtractor = useCallback((item: ListItem) => {
    if (typeof item.id === 'number') return item.id.toString();
    return item.id!;
  }, []);

  // Total incomes for auto-loading
  const totalIncomes = useMemo(() => (
    data?.pages.reduce((total, page) => total + page.incomes.length, 0) ?? 0
  ), [data]);

  // Auto-load more data if needed
  useEffect(() => {
    if (data?.pages && hasNextPage && totalIncomes < 20) {
      fetchNextPage();
    }
  }, [data, hasNextPage, totalIncomes, fetchNextPage]);

  if (isLoading) return null;

  if (isError) {
    return (
      <ErrorState
        title="Failed to load incomes"
        message={error instanceof Error ? error.message : "Unknown error occurred"}
        onRetry={handleRefresh}
        showRestartHint
      />
    );
  }


  return (
    <ScreenWrapper background="background" containerStyle={styles.container}>
      <FlashList<ListItem>
        ref={flashListRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={!!isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.tertiary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ThemedText style={styles.loadingMore}>
              Loading more months data…
            </ThemedText>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText type="subtitle">No income records found...</ThemedText>
            <Button
              onPress={() => router.navigate({
                pathname: '/transaction/new',
                params: { defaultTab: 'income' }
              })}
              textColor={colors.tertiary}
            >
              Add Income
            </Button>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.itemSeparator, { backgroundColor: colors.border }]} />
        )}
        contentContainerStyle={styles.contentContainer}
      />

      <Portal>
        <FAB
          visible={showScrollToTop && isFocused && !globalSnackbar}
          icon="arrow-up"
          style={[
            styles.fab,
            {
              bottom: insets.bottom + 60,
              right: insets.right + 16,
            }
          ]}
          onPress={scrollToTop}
          variant="tertiary"
        />
      </Portal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: -10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  loadingMore: {
    textAlign: "center",
    marginVertical: 16,
  },
  itemSeparator: {
    height: 1,
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 150,
  },
  fab: {
    position: "absolute",
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
