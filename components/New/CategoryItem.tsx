import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Switch, IconButton } from 'react-native-paper';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { useHaptics } from '@/contexts/HapticsProvider';
import { Category } from '@/lib/types';
import { CategoryIcon } from '../ui/CategoryIcon';

interface CategoryItemProps {
    category: Category;
    onToggle: (name: string, enabled: boolean) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    type?: 'expense' | 'income';
}

export const CategoryItem = React.memo<CategoryItemProps>(({
    category,
    onToggle,
    onEdit,
    onDelete,
    type = 'expense',
}) => {
    const { colors } = useAppTheme();
    const { hapticImpact } = useHaptics();

    const handleToggle = useCallback(() => {
        onToggle(category.name, !category.enabled);
    }, [category.name, category.enabled, onToggle, hapticImpact]);

    const handleEdit = useCallback(() => {
        onEdit(category);
    }, [category, onEdit, hapticImpact]);

    const handleDelete = useCallback(() => {
        onDelete(category);
    }, [category, onDelete, hapticImpact]);

    const itemStyle = useMemo(() => [
        styles.item,
        {
            backgroundColor: colors.surface,
            opacity: category.enabled ? 1 : 0.7,
        }
    ], [colors.surface, category.enabled]);

    const labelStyle = useMemo(() => [
        styles.label,
        {
            color: colors.onSurface,
            opacity: category.enabled ? 1 : 0.7,
        }
    ], [colors.onSurface, category.enabled]);

    return (
        <Surface style={itemStyle} elevation={1}>
            <CategoryIcon
                size={40}
                icon={category.icon}
                color={category.color}
            />
            <View style={styles.labelContainer}>
                <Text variant="bodyLarge" style={labelStyle}>
                    {category.label}
                </Text>
                {category.type === "custom" && (
                    <Surface
                        style={[styles.customBadge, { backgroundColor: colors.primaryContainer }]}
                        elevation={0}
                    >
                        <Text
                            variant="labelSmall"
                            style={[styles.customText, { color: colors.onPrimaryContainer }]}
                        >
                            Custom
                        </Text>
                    </Surface>
                )}
            </View>

            <View style={styles.actions}>
                {category.type === "custom" && (
                    <IconButton
                        icon="delete-outline"
                        size={24}
                        iconColor={colors.error}
                        onPress={handleDelete}
                        style={styles.actionButton}
                    />
                )}
                <Switch
                    value={category.enabled}
                    onValueChange={handleToggle}
                    color={type === "income" ? colors.tertiary : colors.primary}
                />
                <IconButton
                    icon="square-edit-outline"
                    size={24}
                    iconColor={colors.onSurfaceVariant}
                    onPress={handleEdit}
                    style={styles.actionButton}
                />
            </View>
        </Surface>
    );
});

CategoryItem.displayName = 'CategoryItem';

const styles = StyleSheet.create({
    item: {
        borderRadius: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
        minHeight: 76,
    },
    labelContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontWeight: '600',
        lineHeight: 22,
    },
    customBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    customText: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        lineHeight: 12,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    actionButton: {
        margin: 0,
        width: 36,
        height: 36,
    },
});
