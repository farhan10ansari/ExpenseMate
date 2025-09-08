// import { Category, ColorType } from '@/lib/types';
// import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
// import ThemedButton from '@/components/ui/ThemedButton';
// import { useHaptics } from '@/contexts/HapticsProvider';
// import { useRouter } from 'expo-router';
// import { getCategoryRows } from '@/lib/helpers';
// import React, { useMemo } from 'react';
// import { useAppTheme } from '@/themes/providers/AppThemeProviders';
// import Color from 'color';
// import { Icon } from "react-native-paper";
// import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

// // Custom Category Button Component
// interface CustomCategoryButtonProps {
//     /**
//      * The text label to display inside the button.
//      */
//     label: string;
//     /**
//      * Icon source for the button.
//      */
//     icon?: IconSource;
//     /**
//      * The color for the button.
//      */
//     color: string;
//     /**
//      * Whether the button is selected/active.
//      */
//     isSelected?: boolean;
//     /**
//      * Callback fired when the button is pressed.
//      */
//     onPress?: () => void;
//     /**
//      * Whether the button is disabled.
//      */
//     disabled?: boolean;
// }

// const CustomCategoryButton: React.FC<CustomCategoryButtonProps> = React.memo(({
//     label,
//     icon,
//     color,
//     isSelected = false,
//     onPress,
//     disabled = false,
// }) => {
//     const { colors, dark } = useAppTheme();

//     // Memoize button colors based on selection state and theme
//     const buttonColors = useMemo(() => {
//         if (isSelected) {
//             // Selected state - similar to CategoryIcon when selected
//             return {
//                 backgroundColor: dark 
//                     ? Color(color).alpha(0.2).string() 
//                     : color,
//                 textColor: dark ? color : colors.onPrimary,
//                 iconColor: dark ? color : colors.onPrimary,
//                 borderColor: color,
//                 borderWidth: 2,
//             };
//         } else {
//             // Unselected state - subtle background with colored text/icon
//             return {
//                 backgroundColor: dark 
//                     ? Color(color).alpha(0.1).string() 
//                     : Color(color).alpha(0.05).string(),
//                 textColor: color,
//                 iconColor: color,
//                 borderColor: dark ? 'transparent' : Color(color).alpha(0.3).string(),
//                 borderWidth: dark ? 0 : 1,
//             };
//         }
//     }, [color, isSelected, dark, colors.onPrimary]);

//     // Memoize button style
//     const buttonStyle = useMemo(() => [
//         categoryButtonStyles.button,
//         {
//             backgroundColor: buttonColors.backgroundColor,
//             borderColor: buttonColors.borderColor,
//             borderWidth: buttonColors.borderWidth,
//             opacity: disabled ? 0.6 : 1,
//         },
//     ], [buttonColors, disabled]);

//     // Memoize text style
//     const textStyle = useMemo(() => [
//         categoryButtonStyles.text,
//         {
//             color: buttonColors.textColor,
//             marginLeft: icon ? 6 : 0,
//         },
//     ], [buttonColors.textColor, icon]);

//     return (
//         <TouchableOpacity
//             style={buttonStyle}
//             onPress={onPress}
//             disabled={disabled}
//             activeOpacity={0.7}
//         >
//             <View style={categoryButtonStyles.content}>
//                 {icon && (
//                     <Icon
//                         source={icon}
//                         color={buttonColors.iconColor}
//                         size={16}
//                     />
//                 )}
//                 <Text style={textStyle} numberOfLines={1}>
//                     {label}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );
// });

// CustomCategoryButton.displayName = 'CustomCategoryButton';

// const categoryButtonStyles = StyleSheet.create({
//     button: {
//         borderRadius: 10,
//         paddingVertical: 8,
//         paddingHorizontal: 10,
//         minHeight: 36,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     content: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     text: {
//         fontSize: 14,
//         fontWeight: '500',
//         textAlign: 'center',
//     },
// });

// // Categories Input Component
// type CategoryInputProps = {
//     categories: Category[];
//     category: string | null;
//     setCategory: (category: string) => void;
//     colorType?: ColorType;
//     type: "expense" | "income"
// };

// export default function CategoriesInput({ 
//     categories, 
//     category, 
//     setCategory, 
//     colorType = "primary", 
//     type 
// }: CategoryInputProps) {
//     const { colors } = useAppTheme()
//     const { hapticImpact } = useHaptics()
//     const router = useRouter();

//     const styles = StyleSheet.create({
//         categoriesMain: {
//             flexDirection: 'column',
//             gap: 10,
//             paddingVertical: 3,
//             paddingRight: 5,
//         },
//         categoryRow: {
//             flexDirection: 'row',
//             gap: 10,
//         },
//         manageButtonStyle: {
//             borderRadius: 10,
//         },
//         manageButtonLabelStyle: {
//             marginVertical: 8,
//             marginHorizontal: 10,
//         }
//     });

//     const { rows: categoryRows, noOfRows } = useMemo(() => getCategoryRows(categories), [categories])

//     const handleNavigateToManage = () => {
//         router.back()
//         setTimeout(() => {
//             router.push(type === 'expense' ? '/menu/(manage-categories)/expense-categories' : '/menu/(manage-categories)/income-sources');
//         }, 300);
//     }

//     return (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View style={styles.categoriesMain}>
//                 {categoryRows.map((row, rowIndex) => (
//                     <View key={rowIndex} style={styles.categoryRow}>
//                         {row.length > 0 && row.map((c) => (
//                             <CustomCategoryButton
//                                 key={c.name}
//                                 label={c.label}
//                                 icon={c.icon}
//                                 color={c.color}
//                                 isSelected={c.name === category}
//                                 onPress={() => {
//                                     hapticImpact();
//                                     setCategory(c.name);
//                                 }}
//                             />
//                         ))}

//                         {/* Show manage button in the first row, after all categories */}
//                         {((noOfRows === 1 && rowIndex === 0) || (noOfRows === 2 && rowIndex === 1)) && (
//                             <>
//                                 {row.length === 0 && (
//                                     <ThemedButton
//                                         compact
//                                         mode={"text"}
//                                         style={styles.manageButtonStyle}
//                                         labelStyle={[styles.manageButtonLabelStyle, { color: colors.muted }]}
//                                         themedBorder
//                                     >
//                                         No {type === 'expense' ? "Categories" : "Sources"} Available
//                                     </ThemedButton>
//                                 )}
//                                 <ThemedButton
//                                     compact
//                                     icon="cog-outline"
//                                     mode='elevated'
//                                     style={styles.manageButtonStyle}
//                                     colorType={type === "expense" ? "primary" : "tertiary"}
//                                     labelStyle={styles.manageButtonLabelStyle}
//                                     onPress={handleNavigateToManage}
//                                 >
//                                     {type === 'expense' ? "Manage Category" : "Manage Source"}
//                                 </ThemedButton>
//                             </>
//                         )}
//                     </View>
//                 ))}
//             </View>
//         </ScrollView>
//     );
// }
