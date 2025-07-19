import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import ExpenseCard from "@/components/main/ExpenseCard";
import { Expense } from "@/db/schema";
import { getExpenseById, getExpensesPaginated } from "@/repositories/expenses";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from "react-native";

const PageSize = 10;

export default function ExpensesScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { colors } = useAppTheme();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['expenses'],
        queryFn: ({ pageParam = 0 }) => {
            return getExpensesPaginated({
                page: pageParam,
                pageSize: PageSize
            })
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasMore) {
                return lastPage.page + 1; // Increment page number for next fetch
            }
        },
    })

    const expenses = useMemo(() => data?.pages.flatMap((page) => page.expenses) ?? [], [data])

    const onPressExpenseCard = useCallback(async (id: number) => {
        //Prefetch data so that formsheet size do not change on data load
        queryClient.prefetchQuery({
            queryKey: ['expense', id.toString()],
            queryFn: async () => getExpenseById(id),
        }).then(() => {
            router.push(`/expense/${id}`);
        }).catch(() => {
            //Route to an error screen with reload option
        })
    }, [])

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.refetchQueries({ queryKey: ['expenses'] });
        } finally {
            setIsRefreshing(false);
        }
    };

    const renderItem: ListRenderItem<Expense> = useCallback(({ item }) => (
        <ExpenseCard expense={item} onPress={onPressExpenseCard} />
    ), [onPressExpenseCard]);

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id?.toString()!}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 180 }}
                onEndReachedThreshold={3}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                style={{ padding: 10 }}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />
                )}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                            Loading more...
                        </ThemedText>
                    ) : null
                }
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});