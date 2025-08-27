import { Category, ColorType } from '@/lib/types';
import { getCategoryRows } from '@/contexts/CategoryDataProvider';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { ScrollView, StyleSheet, View } from 'react-native';
import ThemedButton from '@/components/ui/ThemedButton';
import { useHaptics } from '@/contexts/HapticsProvider';

type CategoryInputProps = {
    categories: Category[];
    category: string | null;
    setCategory: (category: string) => void;
    colorType?: ColorType;
};

export default function CategoriesInput({ categories, category, setCategory, colorType = "primary" }: CategoryInputProps) {
    const { colors } = useAppTheme();
    const { hapticImpact } = useHaptics()

    // categories store

    const styles = StyleSheet.create({
        categoriesMain: {
            flexDirection: 'column',
            gap: 10,
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
                                icon={"plus"}
                                mode='outlined'
                                style={[styles.categoryButtonStyle, {
                                    borderColor: colors.muted
                                }]}
                                labelStyle={styles.categoryButtonLabelStyle}
                                onPress={() => { }}
                                // disabled
                                textColor={colors.muted}

                            >Add Category
                            </ThemedButton>)
                        }
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}