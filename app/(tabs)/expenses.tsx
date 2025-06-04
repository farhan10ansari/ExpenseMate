import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import ExpenseCard from "@/components/main/ExpenseCard";
import { getExpensesPaginated } from "@/repositories/expenses";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from "react-native";
import { RootStackParamList } from "@/lib/types";

const PageSize = 10;

export default function ExpensesScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { colors } = useAppTheme();
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

    const expenses = data?.pages.flatMap((page) => page.expenses) || [];

    const onPressExpenseCard = (id: number) => {
        navigation.navigate('ExpenseInfoScreen', { id });
    }

    return (
        <ThemedView style={styles.container}>
            {/* <ThemedText type="title">Expenses</ThemedText> */}
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString(36)}
                renderItem={({ item }) => <ExpenseCard expense={item} onPress={onPressExpenseCard} />}
                contentContainerStyle={{ paddingBottom: 180 }}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                style={{ padding: 10 }}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
                )}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                            Loading more...
                        </ThemedText>
                    ) : null
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom:30
    }
});