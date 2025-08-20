import { ThemedText } from "@/components/base/ThemedText";
import ExpenseCard from "@/components/main/ExpenseCard";
import { Expense } from "@/db/schema";
import { getExpenseById, getExpensesByMonthPaginated } from "@/repositories/ExpenseRepo";
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
import { Button, ActivityIndicator } from "react-native-paper";
import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorState from "@/components/main/ErrorState";
import { useHaptics } from "@/contexts/HapticsProvider";


type ExpenseSection = {
    title: string;
    data: Expense[];
};

interface ExpensesListProps {
    selectedOffsetMonth: number | null;
    onScroll?: (event: any) => void;
    scrollRef?: React.Ref<SectionList<Expense, ExpenseSection>>
}

export default function ExpensesList({
    selectedOffsetMonth,
    onScroll,
    scrollRef
}: ExpensesListProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { hapticImpact } = useHaptics()


    // Create query key based on selected month
    const queryKey = selectedOffsetMonth === null
        ? ["expenses", "all"]
        : ["expenses", "month", selectedOffsetMonth];

    // Fetch expenses based on selected month
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch, isError, error } =
        useInfiniteQuery({
            queryKey,
            queryFn: ({ pageParam = 0 }) => {
                if (selectedOffsetMonth === null) {
                    // For "All", start from current month and go backwards
                    return getExpensesByMonthPaginated({ offsetMonth: pageParam });
                } else {
                    // For specific month, only fetch that month
                    return getExpensesByMonthPaginated({ offsetMonth: selectedOffsetMonth });
                }
            },
            initialPageParam: selectedOffsetMonth ?? 0,
            getNextPageParam: (last, allPages) => {
                if (selectedOffsetMonth !== null) {
                    // For specific month, no pagination needed
                    return undefined;
                }
                // For "All", continue with next month
                return last.hasMore ? last.offsetMonth + 1 : undefined;
            },
            enabled: true,
        });

    const sections: ExpenseSection[] = useMemo(
        () =>
            data?.pages
                .filter((p) => p.expenses.length > 0)
                .map((p) => ({
                    title: p.month,
                    data: p.expenses,
                })) ?? [],
        [data]
    );

    const onPressExpenseCard = useCallback(async (id: number) => {
        hapticImpact();
        await queryClient.prefetchQuery({
            queryKey: ["expense", id.toString()],
            queryFn: () => getExpenseById(id),
        });
        router.push(`/expense/${id}`);
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        hapticImpact();
        try {
            await refetch();
            // Also refresh available months
            await queryClient.refetchQueries({ queryKey: ["availableExpenseMonths"] });
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch]);

    const totalExpenses = useMemo(() => {
        return data?.pages.reduce((prev, item) => prev + item.expenses.length, 0) ?? 0;
    }, [data]);

    // Auto-load more for "All" view if needed
    useEffect(() => {
        if (selectedOffsetMonth === null && data && data.pages) {
            const lastPage = data.pages[data.pages.length - 1];
            if (lastPage?.hasMore === true && totalExpenses <= 20) {
                fetchNextPage();
            }
        }
    }, [data, selectedOffsetMonth, totalExpenses]);

    const renderItem: SectionListRenderItem<Expense, ExpenseSection> = useCallback(
        ({ item }) => <ExpenseCard expense={item} onPress={onPressExpenseCard} />,
        [onPressExpenseCard]
    );

    const styles = StyleSheet.create({
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
        },
        itemSeparator: {
            height: 1,
            marginVertical: 10,
            backgroundColor: colors.border,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
        },
        errorContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        errorIcon: {
            marginBottom: 16,
        },
        errorTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.onSurface,
            marginBottom: 8,
            textAlign: "center",
        },
        errorMessage: {
            fontSize: 14,
            color: colors.error,
            marginBottom: 12,
            textAlign: "center",
            lineHeight: 20,
        },
        errorHint: {
            fontSize: 14,
            color: colors.onSurfaceVariant,
            marginBottom: 24,
            textAlign: "center",
            opacity: 0.8,
        },
        retryButton: {
            marginBottom: 16,
            paddingHorizontal: 24,
        },
        errorFooter: {
            fontSize: 12,
            color: colors.onSurfaceVariant,
            textAlign: "center",
            opacity: 0.6,
            fontStyle: "italic",
        },
    });

    if (isLoading) return null; // Show nothing while loading to avoid flicker as data fetching is very fast

    if (isError) {
        console.error("Error fetching expenses:", error);
        return (
            <ErrorState
                title="Failed to load expenses"
                message={error instanceof Error ? error.message : "Unknown error occurred"}
                onRetry={handleRefresh}
                showRestartHint={true}
            />
        );
    }


    return (
        <SectionList<Expense, ExpenseSection>
            ref={scrollRef}
            sections={totalExpenses > 0 ? sections : []}
            keyExtractor={(item) => item.id!.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
                <ThemedText type="defaultSemiBold" fontSize={16} style={styles.sectionHeader}>
                    {section.title}
                </ThemedText>
            )}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage && selectedOffsetMonth === null) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={1}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : null
            }
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            onScroll={onScroll}
            scrollEventThrottle={100}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            style={styles.sectionList}
            contentContainerStyle={styles.sectionListContentContainer}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <ThemedText type="subtitle">No expenses records found...</ThemedText>
                    <Button onPress={() => router.push("/transaction/new")}>
                        Add Expense
                    </Button>
                </View>
            }
        />
    );
}
