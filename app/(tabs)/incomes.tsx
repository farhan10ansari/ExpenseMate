

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

    // Fetch incomes by month with pagination
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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
        await queryClient.prefetchQuery({
            queryKey: ["income", id.toString()],
            queryFn: () => getIncomeById(id),
        });
        router.push(`/income/${id}`);
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
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

    const handleNavigateToNewIncome = useCallback(() => {
        router.push("/income/new");
    }, [router]);

    return (
        <ThemedView style={styles.container}>
            <SectionList<Income, IncomeSection>
                ref={scrollElementRef}
                sections={totalIncomes > 0 ? sections : []}
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
                        <Button onPress={() => router.push("/income/new")}>
                            Add Income
                        </Button>
                    </View>
                }
            />
            <Portal>
                <FAB
                    icon={showScrollToTop ? "arrow-up" : "plus"}
                    style={styles.fab}
                    onPress={showScrollToTop ? scrollToTop : handleNavigateToNewIncome}
                    visible={isFocused}
                    variant="tertiary"
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
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 100,
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

});



















