import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
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
    SectionListData,
} from "react-native";
import { Button, Card, FAB, Portal } from "react-native-paper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsFocused } from "@react-navigation/native";

type ExpenseSection = {
    title: string;
    data: Expense[];
};

export default function ExpensesScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const scrollElementRef = useRef<SectionList<Expense, ExpenseSection>>(null);
    const { handleScroll, scrollToTop, showScrollToTop } = useScrollToTop(scrollElementRef)
    const isFocused = useIsFocused();


    // fetch expenses by month with pagination
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["expenses"],
            queryFn: ({ pageParam = 0 }) =>
                getExpensesByMonthPaginated({ offsetMonth: pageParam }),
            initialPageParam: 0,
            getNextPageParam: (last) =>
                last.hasMore ? last.offsetMonth + 1 : undefined
        });

    const sections: ExpenseSection[] = useMemo(
        () =>
            data?.pages.map((p) => ({
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
            await queryClient.refetchQueries({ queryKey: ["expensesByMonth"] });
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const totalExpenses = useMemo(() => {
        return data?.pages.reduce((prev, item) => prev + item.expenses.length, 0) ?? 0;
    }, [data]);

    // This is a workaround to ensure at least a minimum of 20 expenses are loaded to enable the user to scroll & able to load more
    // This is needed because the initial fetch may not have enough expenses to trigger the onEnd
    useEffect(() => {
        if (data && data.pages) {
            console.log("Loading more expenses because initial fetch is less than 20");
            if (data.pages[data.pages.length - 1].hasMore === true && totalExpenses <= 20) {
                fetchNextPage();
            }
        }
    }, [data])

    const renderItem: SectionListRenderItem<Expense, ExpenseSection> = useCallback(({ item }) => (
        <ExpenseCard expense={item} onPress={onPressExpenseCard} />
    ), [onPressExpenseCard]);


    return (
        <ThemedView style={styles.container}>
            <SectionList<Expense, ExpenseSection>
                ref={scrollElementRef}
                sections={totalExpenses > 0 ? sections : []} // Only render sections if there are expenses else rended ListEmptyComponent
                keyExtractor={(item) => item.id!.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                    <ThemedText type="subtitle" style={styles.sectionHeader}>
                        {section.title}
                    </ThemedText>
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
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
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={100} // set it to 16 for faster showing of FAB
                ItemSeparatorComponent={() => (
                    <View
                        style={[styles.itemSeparator, { backgroundColor: colors.border }]}
                    />
                )}
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
            // debug
            />
            <Portal>
                <FAB
                    visible={showScrollToTop && isFocused}
                    variant="tertiary"
                    icon="arrow-up"
                    size="small"
                    style={styles.fab}
                    onPress={scrollToTop}


                />
            </Portal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    fab: {
        position: "absolute",
        right: 16,
        bottom: 120,
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
    }
});
