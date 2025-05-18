import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import { getExpenses } from "@/repositories/expenses";
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, View } from "react-native";

export default function ExpensesScreen() {

    const { data } = useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            return getExpenses(10)
        },
    })

    console.log(data)
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },

    });

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Expenses</ThemedText>
            <ScrollView style={{ flex: 1, paddingBottom:180 }}>
                {data?.map((expense,index) => (
                    <View key={index} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <ThemedText>{expense.description}</ThemedText>
                        <ThemedText>{expense.amount}</ThemedText>
                        <ThemedText>{new Date(expense.dateTime).toLocaleDateString()}</ThemedText>
                    </View>
                ))}

            </ScrollView>
        </ThemedView>
    );
}