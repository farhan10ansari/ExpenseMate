import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from "react-native-paper";
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

const PADDING = {
    default: {
        vertical: 2,
        horizontal: 12,
        iconMarginRight: 8,
        textOnlyHorizontal: 16,
    },
    small: {
        vertical: 1,
        horizontal: 8,
        iconMarginRight: 4,
        textOnlyHorizontal: 12,
    },
};

const SIZES = {
    default: {
        height: 32,
        iconSize: 18,
        fontSize: 14,
        borderRadius: 16,
    },
    small: {
        height: 24,
        iconSize: 12,
        fontSize: 12,
        borderRadius: 12,
    },
};



export interface CustomChipProps {
    /**
     * The text label to display inside the chip.
     */
    label: string; // Label is now mandatory
    /**
     * Icon source for the chip. Uses react-native-paper's IconSource type.
     * Example: 'information', 'check-circle', { uri: '...' }
     */
    icon?: IconSource;
    /**
     * The color variant of the chip.
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'tertiary' | string; // Allow custom string for potential future variants
    /**
     * The size of the chip.
     * @default 'default'
     */
    size?: 'default' | 'small';
}

// --- The Component ---
const CustomChip: React.FC<CustomChipProps> = ({
    label,
    icon,
    variant = 'primary',
    size = 'default',
}) => {
    const { colors } = useAppTheme();
    // Determine styles based on size
    const currentSizeConfig = SIZES[size] || SIZES.default;
    const currentPaddingConfig = PADDING[size] || PADDING.default;

    // Define base colors for variants
    const VARIANT_COLORS = {
        primary: {
            backgroundColor: colors.onPrimary,
            textColor: colors.text,
            iconColor: colors.primary,
            borderColor: colors.primary,
        },
        secondary: {
            backgroundColor: colors.onSecondary,
            textColor: colors.text,
            iconColor: colors.secondary,
            borderColor: colors.secondary,
        },
        tertiary: {
            backgroundColor: colors.onTertiary,
            textColor: colors.text,
            iconColor: colors.tertiary,
            borderColor: colors.tertiary
        },
        // You can add more variants here if needed
    };

    // Determine colors based on variant
    // Fallback to primary if an unknown variant string is provided
    const baseVariantColors = VARIANT_COLORS[variant as keyof typeof VARIANT_COLORS] || VARIANT_COLORS.primary;

    const chipBackgroundColor = baseVariantColors.backgroundColor;
    const chipTextColor = baseVariantColors.textColor;
    const chipIconColor = baseVariantColors.iconColor;
    const chipBorderColor = baseVariantColors.borderColor;
    // Border width is 1 if a border color is set (and not transparent), otherwise 0
    const chipBorderWidth = (chipBorderColor && chipBorderColor !== 'transparent') ? 1 : 0;


    // Dynamic styles for the chip container
    const chipStyle = [
        styles.chipBase,
        {
            backgroundColor: chipBackgroundColor,
            borderColor: chipBorderColor,
            borderWidth: chipBorderWidth,
            height: currentSizeConfig.height,
            borderRadius: currentSizeConfig.borderRadius,
            paddingVertical: currentPaddingConfig.vertical,
            paddingHorizontal: icon ? currentPaddingConfig.horizontal : currentPaddingConfig.textOnlyHorizontal,
        },
    ];

    // Dynamic styles for the label
    const labelStyle = [
        styles.labelBase,
        {
            color: chipTextColor,
            fontSize: currentSizeConfig.fontSize,
            marginLeft: icon ? currentPaddingConfig.iconMarginRight : 0,
        },
    ];

    return (
        <View style={chipStyle}>
            {icon && (
                <Icon // Using react-native-paper Icon component
                    source={icon}
                    color={chipIconColor}
                    size={currentSizeConfig.iconSize}
                />
            )}
            <Text style={labelStyle} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </Text>
        </View>
    );
};


const styles = StyleSheet.create({
    chipBase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    labelBase: {
        fontWeight: '500',
    },
});

export default CustomChip;