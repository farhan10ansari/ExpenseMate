import { StyleSheet, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAvailableExpenseMonths } from "@/repositories/ExpenseRepo";
import MonthTab from "./MonthTab";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";

interface MonthTabsContainerProps {
    selectedOffsetMonth: number | null; // null means "All"
    onMonthSelect: (offsetMonth: number | null) => void;
}

export default function MonthTabsContainer({
    selectedOffsetMonth,
    onMonthSelect
}: MonthTabsContainerProps) {
    const { colors } = useAppTheme();

    const { data: availableMonths = [], isLoading } = useQuery({
        queryKey: ["expenses", "availableExpenseMonths"],
        queryFn: getAvailableExpenseMonths,
    });

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        scrollContainer: {
            paddingHorizontal: 16,
        },
        contentContainer: {
            paddingRight: 16,
            alignItems: 'center',
        },
    });

    if (isLoading || availableMonths.length === 0) {
        return null;
    }

    // Calculate total count for "All" tab
    const totalCount = availableMonths.reduce((sum, month) => sum + month.count, 0);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
            >
                {/* All Tab */}
                <MonthTab
                    month="All"
                    count={totalCount}
                    isSelected={selectedOffsetMonth === null}
                    onPress={() => onMonthSelect(null)}
                />

                {/* Month Tabs */}
                {availableMonths.map((monthData) => (
                    <MonthTab
                        key={monthData.offsetMonth}
                        month={monthData.month}
                        count={monthData.count}
                        isSelected={selectedOffsetMonth === monthData.offsetMonth}
                        onPress={() => onMonthSelect(monthData.offsetMonth)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
