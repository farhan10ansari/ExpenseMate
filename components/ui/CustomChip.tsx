// // CustomChip.tsx
// import { useAppTheme } from '@/themes/providers/AppThemeProviders';
// import React from 'react';
// import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
// import { Icon } from "react-native-paper";
// import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';


// // --- Configuration for Variants and Sizes ---
// const PADDING = {
//     default: {
//         vertical: 6,
//         horizontal: 12,
//         iconMarginRight: 8,
//         textOnlyHorizontal: 16, // More padding if no icon
//     },
//     small: {
//         vertical: 4,
//         horizontal: 8,
//         iconMarginRight: 4,
//         textOnlyHorizontal: 12,
//     },
// };

// const SIZES = {
//     default: {
//         height: 32,
//         iconSize: 18,
//         fontSize: 14,
//         borderRadius: 16,
//     },
//     small: {
//         height: 24,
//         iconSize: 14,
//         fontSize: 12,
//         borderRadius: 12,
//     },
// };

// // Define base colors for variants
// // These are inspired by common UI themes, you can adjust them as needed.
// const VARIANT_COLORS = {
//     primary: {
//         backgroundColor: '#6200EE', // A deep purple
//         textColor: '#FFFFFF',
//         iconColor: '#FFFFFF',
//         borderColor: 'transparent',
//     },
//     secondary: {
//         backgroundColor: '#03DAC6', // A teal color
//         textColor: '#000000',
//         iconColor: '#000000',
//         borderColor: 'transparent',
//     },
//     tertiary: {
//         backgroundColor: '#E0E0E0', // A light grey
//         textColor: '#000000',
//         iconColor: '#000000',
//         borderColor: '#B0B0B0', // Subtle border for tertiary
//     },
//     // You can add more variants here if needed
//     // e.g., 'error', 'warning', 'success'
// };

// // --- Prop Types ---
// export interface CustomChipProps {
//     /**
//      * The text label to display inside the chip.
//      */
//     label?: string;
//     /**
//      * Name of the icon from MaterialCommunityIcons.
//      * Example: 'information', 'check-circle', 'close'
//      */
//     icon?: IconSource;
//     /**
//      * The color variant of the chip.
//      * @default 'primary'
//      */
//     variant?: 'primary' | 'secondary' | 'tertiary' | string; // Allow custom string for potential future variants
//     /**
//      * The size of the chip.
//      * @default 'default'
//      */
//     size?: 'default' | 'small';
//     /**
//      * Custom background color for the chip. Overrides variant color.
//      */
//     backgroundColor?: string;
//     /**
//      * Custom text color for the label. Overrides variant color.
//      */
//     textColor?: string;
//     /**
//      * Custom color for the icon. Overrides variant color.
//      */
//     iconColor?: string;
//     /**
//      * Custom border color for the chip. Overrides variant color.
//      */
//     borderColor?: string;
//     /**
//      * Custom border width for the chip.
//      */
//     borderWidth?: number;
//     /**
//      * Optional custom style for the chip container.
//      */
//     style?: StyleProp<ViewStyle>;
//     /**
//      * Optional custom style for the text label.
//      */
//     textStyle?: StyleProp<TextStyle>;
//     /**
//      * Optional children to render inside the chip, if label is not provided.
//      * Useful for more complex content.
//      */
//     children?: React.ReactNode;
// }

// // --- The Component ---
// const CustomChip: React.FC<CustomChipProps> = ({
//     label,
//     icon,
//     variant = 'primary',
//     size = 'default',
//     backgroundColor: customBackgroundColor,
//     textColor: customTextColor,
//     iconColor: customIconColor,
//     borderColor: customBorderColor,
//     borderWidth: customBorderWidth,
//     style,
//     textStyle,
//     children
// }) => {
//     const { colors } = useAppTheme();
//     // Determine styles based on size
//     const currentSizeConfig = SIZES[size] || SIZES.default;
//     const currentPaddingConfig = PADDING[size] || PADDING.default;

//     // Determine colors: custom props override variant colors
//     const baseVariantColors = VARIANT_COLORS[variant as keyof typeof VARIANT_COLORS] || VARIANT_COLORS.primary;

//     const chipBackgroundColor = customBackgroundColor || baseVariantColors.backgroundColor;
//     const chipTextColor = customTextColor || baseVariantColors.textColor;
//     const chipIconColor = customIconColor || baseVariantColors.iconColor;
//     const chipBorderColor = customBorderColor || baseVariantColors.borderColor;
//     const chipBorderWidth = customBorderWidth !== undefined ? customBorderWidth : (chipBorderColor !== 'transparent' ? 1 : 0);


//     // Dynamic styles
//     const chipStyle = StyleSheet.flatten([
//         styles.chipBase,
//         {
//             backgroundColor: chipBackgroundColor,
//             borderColor: chipBorderColor,
//             borderWidth: chipBorderWidth,
//             height: currentSizeConfig.height,
//             borderRadius: currentSizeConfig.borderRadius,
//             paddingVertical: currentPaddingConfig.vertical,
//             paddingHorizontal: icon ? currentPaddingConfig.horizontal : currentPaddingConfig.textOnlyHorizontal,
//         },
//         style, // Apply custom container style
//     ]);

//     const labelStyle = StyleSheet.flatten([
//         styles.labelBase,
//         {
//             color: chipTextColor,
//             fontSize: currentSizeConfig.fontSize,
//             marginLeft: icon ? currentPaddingConfig.iconMarginRight : 0,
//         },
//         textStyle, // Apply custom text style
//     ]);

//     return (
//         <View style={chipStyle}>
//             {icon && (
//                 <Icon
//                     source={icon}
//                     color={chipIconColor ?? colors.primary}
//                     size={18}
//                 />
//             )}
//             <Text style={labelStyle} numberOfLines={1} ellipsizeMode="tail">
//                 {label ?? children}
//             </Text>
//         </View>
//     );
// };

// // --- Base Styles ---
// const styles = StyleSheet.create({
//     chipBase: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         alignSelf: 'flex-start', // So it doesn't stretch full width by default
//     },
//     labelBase: {
//         fontWeight: '500', // Medium weight, common for chips
//         // Other base text styles can go here
//     },
// });

// export default CustomChip;



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