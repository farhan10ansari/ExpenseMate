import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import IncomeCard from "@/components/main/IncomeCard";
import { Income } from "@/db/schema";
import { getIncomeById, getIncomesByMonthPaginated } from "@/repositories/IncomeRepo";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
    SectionList,
    RefreshControl,
    StyleSheet,
    View,
    SectionListRenderItem,
} from "react-native";
import { Button, FAB, Portal } from "react-native-paper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsFocused } from "@react-navigation/native";
import useAppStore from "@/stores/useAppStore";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import ErrorState from "@/components/main/ErrorState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHaptics } from "@/contexts/HapticsProvider";

type IncomeSection = {
    title: string;
    data: Income[];
};

export default function IncomesScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const scrollElementRef = useRef<SectionList<Income, IncomeSection>>(null);
    const { handleScroll, scrollToTop, showScrollToTop } = useScrollToTop(scrollElementRef);
    const globalSnackbar = useAppStore((state) => state.globalSnackbar);
    const insets = useSafeAreaInsets();
    const { hapticImpact } = useHaptics()

    // Fetch incomes by month with pagination
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isError, error, isRefetching } =
        useInfiniteQuery({
            queryKey: ["incomes"],
            queryFn: ({ pageParam = 0 }) =>
                getIncomesByMonthPaginated({ offsetMonth: pageParam }),
            initialPageParam: 0,
            getNextPageParam: (last) =>
                last.hasMore ? last.offsetMonth + 1 : undefined
        });

    const sections: IncomeSection[] = useMemo(
        () =>
            data?.pages.filter((p) => p.incomes.length > 0).map((p) => ({
                title: p.month,
                data: p.incomes,
            })) ?? [],
        [data]
    );

    const onPressIncomeCard = useCallback(async (id: number) => {
        hapticImpact();
        await queryClient.prefetchQuery({
            queryKey: ["income", id.toString()],
            queryFn: () => getIncomeById(id),
        });
        router.push(`/income/${id}`);
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        hapticImpact();
        try {
            await queryClient.refetchQueries({ queryKey: ["incomes"] });
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const totalIncomes = useMemo(() => {
        return data?.pages.reduce((prev, item) => prev + item.incomes.length, 0) ?? 0;
    }, [data]);

    // Ensure at least a minimum of 20 incomes loaded for scroll trigger
    useEffect(() => {
        if (data && data.pages) {
            if (data.pages[data.pages.length - 1].hasMore === true && totalIncomes <= 20) {
                fetchNextPage();
            }
        }
    }, [data]);

    const renderItem: SectionListRenderItem<Income, IncomeSection> = useCallback(({ item }) => (
        <IncomeCard income={item} onPress={onPressIncomeCard} />
    ), [onPressIncomeCard]);

    if (isLoading) return null; // Show nothing while loading to avoid flicker as data fetching is very fast

    if (isError) {
        console.error("Error fetching expenses:", error);
        return (
            <ErrorState
                title="Failed to load incomes"
                message={error instanceof Error ? error.message : "Unknown error occurred"}
                onRetry={handleRefresh}
                showRestartHint={true}
            />
        );
    }


    const styles = StyleSheet.create({
        container: { flex: 1 },
        sectionHeader: {
            marginTop: 10,
            marginBottom: 4,
            paddingHorizontal: 10,
        },
        sectionList: {
            padding: 10,
            paddingTop: 0,
        },
        sectionListContentContainer: {
            paddingBottom: 150,
            flexGrow: 1,
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
            gap: 5,
        },
        fab: {
            position: "absolute",
            right: insets.right + 16,
            bottom: insets.bottom + 60,
            height: 48,
            width: 48,
            justifyContent: 'center',
            alignItems: 'center',
        },

    });


    return (
        <ScreenWrapper containerStyle={styles.container}
            background="background"
        >
            <ThemedView style={styles.container}>
                <SectionList<Income, IncomeSection>
                    ref={scrollElementRef}
                    sections={totalIncomes > 0 ? sections : []}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={renderItem}
                    renderSectionHeader={({ section }) => (
                        <ThemedText type="defaultSemiBold" fontSize={16} style={styles.sectionHeader}>
                            {section.title}
                        </ThemedText>
                    )}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={1}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <ThemedText style={styles.loadingMore}>
                                Loading more months data…
                            </ThemedText>
                        ) : null
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    onScroll={handleScroll}
                    scrollEventThrottle={100}
                    ItemSeparatorComponent={() => (
                        <View
                            style={[styles.itemSeparator, { backgroundColor: colors.border }]}
                        />
                    )}
                    style={styles.sectionList}
                    contentContainerStyle={styles.sectionListContentContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ThemedText type="subtitle">No income records found...</ThemedText>
                            <Button onPress={() => router.navigate({
                                pathname: '/transaction/new',
                                params: { defaultTab: 'income' }
                            })}
                                textColor={colors.tertiary}
                            >
                                Add Income
                            </Button>
                        </View>
                    }
                />
                <Portal>
                    <FAB
                        visible={showScrollToTop && isFocused && !globalSnackbar}
                        icon="arrow-up"
                        style={styles.fab}
                        onPress={scrollToTop}
                        variant="tertiary"
                    />
                </Portal>
            </ThemedView>
        </ScreenWrapper>
    );
}