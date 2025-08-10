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
import { Button } from "react-native-paper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

    // Create query key based on selected month
    const queryKey = selectedOffsetMonth === null
        ? ["expenses", "all"]
        : ["expenses", "month", selectedOffsetMonth];

    // Fetch expenses based on selected month
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
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
        await queryClient.prefetchQuery({
            queryKey: ["expense", id.toString()],
            queryFn: () => getExpenseById(id),
        });
        router.push(`/expense/${id}`);
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
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
            marginTop: 20,
            marginBottom: 10,
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
            backgroundColor: colors.border,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
        },
    });

    return (
        <SectionList<Expense, ExpenseSection>
            ref={scrollRef}
            sections={totalExpenses > 0 ? sections : []}
            keyExtractor={(item) => item.id!.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
                <ThemedText type="subtitle" style={styles.sectionHeader}>
                    {section.title}
                </ThemedText>
            )}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage && selectedOffsetMonth === null) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ThemedText style={styles.loadingMore}>
                        Loading more months data…
                    </ThemedText>
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
                    <ThemedText type="subtitle">No expenses found...</ThemedText>
                    <Button onPress={() => router.push("/expense/new")}>
                        Add Expense
                    </Button>
                </View>
            }
        />
    );
}
