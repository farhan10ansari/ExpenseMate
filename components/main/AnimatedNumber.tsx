import { useIsFocused } from "@react-navigation/native";
import { useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';


type Props = {
    value: number;
    fontStyle?: StyleProp<TextStyle>
    containerStyle?: StyleProp<ViewStyle>
}

export default function AnimatedNumber({ value, fontStyle, containerStyle }: Props) {
    const segments = useSegments();
    const [displayValue, setDisplayValue] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        // Start from 0 and animate to actual value
        if (isFocused) {
            setDisplayValue(value);
        } else if ((segments as string[]).includes("(tabs)")) { // if screen belongs to the main tab navigator then only reset to 0 for animating it next time
            setDisplayValue(0);
        }
    }, [value, isFocused]);

    return (
        <AnimatedNumbers
            includeComma
            animateToNumber={displayValue} // Use displayValue instead
            animationDuration={2000}
            fontStyle={fontStyle}
            containerStyle={containerStyle}
        />
    );
}