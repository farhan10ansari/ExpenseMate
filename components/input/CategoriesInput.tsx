import { Category, ColorType } from '@/lib/types';
import { ScrollView, StyleSheet, View } from 'react-native';
import ThemedButton from '@/components/ui/ThemedButton';
import { useHaptics } from '@/contexts/HapticsProvider';
import { useRouter } from 'expo-router';
import { getCategoryRows } from '@/lib/helpers';

type CategoryInputProps = {
    categories: Category[];
    category: string | null;
    setCategory: (category: string) => void;
    colorType?: ColorType;
    type: "expense" | "income"
};

export default function CategoriesInput({ categories, category, setCategory, colorType = "primary", type }: CategoryInputProps) {
    const { hapticImpact } = useHaptics()
    const router = useRouter();

    const styles = StyleSheet.create({
        categoriesMain: {
            flexDirection: 'column',
            gap: 10,
            paddingVertical: 3, // to correctly show elevation shadow for the elevated button
            paddingRight: 5, //to correctly show elevation shadow for the elevated button
        },
        categoryRow: {
            flexDirection: 'row',
            gap: 10,
        },
        categoryButtonStyle: {
            borderRadius: 10,
        },
        categoryButtonLabelStyle: {
            marginVertical: 8,
            marginHorizontal: 10,
        }
    });

    const categoryRows = getCategoryRows(categories);

    const handleNavigateToManage = () => {
        router.back()
        setTimeout(() => {
            router.push(type === 'expense' ? '/menu/(manage-categories)/expense-categories' : '/menu/(manage-categories)/income-sources');
        }, 100);
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesMain}>
                {categoryRows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.categoryRow}>
                        {row.map((c) => (
                            <ThemedButton
                                compact
                                key={c.name}
                                icon={c.icon}
                                mode={c.name === category ? 'contained' : 'outlined'}
                                colorType={colorType}
                                style={styles.categoryButtonStyle}
                                labelStyle={styles.categoryButtonLabelStyle}
                                themedBorder
                                onPress={() => {
                                    hapticImpact();
                                    setCategory(c.name);
                                }}
                            >
                                {c.label}
                            </ThemedButton>
                        ))}
                        {rowIndex === categoryRows.length - 1 && (
                            <ThemedButton
                                compact
                                icon="cog-outline"
                                mode='elevated'
                                style={[styles.categoryButtonStyle, {
                                    // borderColor: colors.muted
                                }]}
                                colorType={type === "expense" ? "primary" : "tertiary"}
                                labelStyle={styles.categoryButtonLabelStyle}
                                onPress={handleNavigateToManage}
                            // textColor={colors.muted}

                            >{type === 'expense' ? "Manage Category" : "Manage Source"}
                            </ThemedButton>)
                        }
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}