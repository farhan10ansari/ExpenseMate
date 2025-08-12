// components/main/FormSheetTabs.tsx
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, View, Pressable } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { Button } from "react-native-paper";
import ThemedButton from '@/components/ui/ThemedButton';
import Color from "color";


type Tab = {
    key: string;
    label: string;
    icon?: string;
};

type FormSheetTabsProps = {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
};

export default function FormSheetTabs({ tabs, activeTab, onTabChange }: FormSheetTabsProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
        },
        tab: {
            paddingVertical: 4,
            // paddingHorizontal: 2,
            borderRadius: 6,
        },
        tabText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        activeTabText: {
            color: activeTab === "expense" ? colors.primary : colors.tertiary,
        },
        inactiveTabText: {
            color: colors.onSurfaceVariant,
            opacity: 0.7,
        },
        divider: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.outline,
            marginHorizontal: 2,
            opacity: 0.5,
        },
    });

    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.key;
                return (
                    <View key={tab.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Pressable
                            style={styles.tab}
                            onPress={() => onTabChange(tab.key)}
                            android_ripple={{
                                color: tab.key === 'expense' ? colors.primary : colors.tertiary,
                                borderless: false,
                            }}
                        >
                            <ThemedText
                                style={[
                                    styles.tabText,
                                    isActive ? styles.activeTabText : styles.inactiveTabText,
                                ]}
                            >
                                {tab.label}
                            </ThemedText>
                        </Pressable> */}
                        <ThemedButton
                            compact
                            mode="text"
                            onPress={() => onTabChange(tab.key)}
                            style={styles.tab}
                            labelStyle={[
                                styles.tabText,
                                isActive ? styles.activeTabText : styles.inactiveTabText,
                            ]}
                            uppercase={false}
                            rippleColor={tab.key === 'expense' ?  Color(colors.primary).alpha(0.12).rgb().string()  :  Color(colors.tertiary).alpha(0.12).rgb().string() }
                        >
                            {tab.label}
                        </ThemedButton>

                        {/* Show divider between tabs, not after the last one */}
                        {index < tabs.length - 1 && (
                            <ThemedText style={styles.divider}>|</ThemedText>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
