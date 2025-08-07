import React from 'react';
import { Button, ButtonProps, useTheme } from 'react-native-paper';

type Mode = 'contained' | 'outlined' | 'text' | 'contained-tonal';
type ColorType = 'primary' | 'secondary' | 'tertiary';

export interface ThemedButtonProps extends ButtonProps {
    colorType?: ColorType;
    themedBorder?: boolean;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
    colorType = 'primary',
    mode = 'contained',
    themedBorder = false,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    let buttonColor: string | undefined;
    let textColor: string | undefined;
    let borderColor: string = colors.primary

    // Dynamic color selection based on the Paper 5.x+ theme structure
    switch (colorType) {
        case 'secondary':
            if (mode === 'contained') {
                buttonColor = colors.secondary;
                textColor = colors.onSecondary ?? colors.surface;
            } else if (mode === 'contained-tonal') {
                buttonColor = colors.tertiaryContainer ?? colors.secondaryContainer;
                textColor = colors.onTertiaryContainer ?? colors.onSecondaryContainer;
            } else {
                buttonColor = undefined;
                textColor = colors.secondary;
            }
            borderColor = colors.secondary;
            break;
        case 'tertiary':
            if (mode === 'contained') {
                buttonColor = colors.tertiary;
                textColor = colors.onTertiary ?? colors.surface;
            } else if (mode === 'contained-tonal') {
                buttonColor = colors.tertiaryContainer ?? colors.secondaryContainer;
                textColor = colors.onTertiaryContainer ?? colors.onSecondaryContainer;
            } else {
                buttonColor = undefined;
                textColor = colors.tertiary;
            }
            borderColor = colors.tertiary;
            break;
        default:
            break;
    }

    return (
        <Button
            mode={mode as Mode}
            buttonColor={colorType !== "primary" ? buttonColor : undefined} // Use buttonColor only if not primary because primary is handled by the theme
            textColor={colorType !== "primary" ? textColor : undefined} // Use textColor only if not primary because primary is handled by the theme
            style={[themedBorder && { borderColor }, style]} // Apply border color if themedBorder is true
            {...props}
        />
    );
};

export default ThemedButton;
