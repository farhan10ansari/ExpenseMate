import { Category } from '@/lib/types';
import { AddCategory, getCategoryRows } from '@/stores/useCategoriesStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

type CategoryInputProps = {
    category: string | null;
    setCategory: (category: string) => void;
    categories: Category[];
};

export default function CategoriesInput({ category, setCategory, categories }: CategoryInputProps) {
    const { colors } = useAppTheme();

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
            borderColor: colors.primary,
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
                            <Button
                                compact
                                key={c.name}
                                icon={c.icon}
                                mode={c.name === category ? 'contained' : 'outlined'}
                                style={styles.categoryButtonStyle}
                                labelStyle={styles.categoryButtonLabelStyle}
                                onPress={() => {
                                    setCategory(c.name);
                                }}
                            >
                                {c.name}
                            </Button>
                        ))}
                        {rowIndex === categoryRows.length - 1 && (
                            <Button
                                compact
                                icon={AddCategory.icon}
                                mode='outlined'
                                style={[styles.categoryButtonStyle, {
                                    borderColor: colors.muted
                                }]}
                                labelStyle={styles.categoryButtonLabelStyle}
                                onPress={() => { }}
                                // disabled
                                textColor={colors.muted}

                            >{AddCategory.name}
                            </Button>)
                        }
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}