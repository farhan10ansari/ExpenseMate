// Updated ExpensesScreen
import { ThemedView } from "@/components/base/ThemedView";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { SectionList, StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { useRef, useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsFocused } from "@react-navigation/native";
import useAppStore from "@/stores/useAppStore";
import { Expense } from "@/db/schema";
import MonthTabsContainer from "@/features/Expense/components/MonthTabsContainer";
import ExpensesList from "@/features/Expense/components/ExpenseList";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import CustomScreenHeader from "@/components/main/CustomScreenHeader";

type ExpenseSection = {
    title: string;
    data: Expense[];
};

export default function ExpensesScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const [selectedOffsetMonth, setSelectedOffsetMonth] = useState<number | null>(null);

    const scrollElementRef = useRef<SectionList<Expense, ExpenseSection>>(null);
    const { handleScroll, scrollToTop, showScrollToTop } = useScrollToTop(scrollElementRef);
    const isFocused = useIsFocused();
    const globalSnackbar = useAppStore((state) => state.globalSnackbar);

    const handleMonthSelect = (offsetMonth: number | null) => {
        setSelectedOffsetMonth(offsetMonth);
        // Scroll to top when changing tabs
        scrollToTop();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        fab: {
            position: "absolute",
            right: 16,
            bottom: 120,
            height: 48,
            width: 48,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <ScreenWrapper style={styles.container}
            header={<CustomScreenHeader title="Expenses" showBackButton={false} />}
            background="background"
        >
            <MonthTabsContainer
                selectedOffsetMonth={selectedOffsetMonth}
                onMonthSelect={handleMonthSelect}
            />
            <ExpensesList
                selectedOffsetMonth={selectedOffsetMonth}
                onScroll={handleScroll}
                scrollRef={scrollElementRef}
            />
            <Portal>
                <FAB
                    visible={showScrollToTop && isFocused && !globalSnackbar}
                    variant="tertiary"
                    icon="arrow-up"
                    style={styles.fab}
                    onPress={scrollToTop}
                />
            </Portal>
        </ScreenWrapper>
    );
}
