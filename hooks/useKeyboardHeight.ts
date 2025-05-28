import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";
import { Keyboard, KeyboardEventName, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//Currently its not perfect, but it works for now. When focus changes from one input to another, the keyboard height is not updated.
export default function useKeyboardHeight() {
    const keyboardHeight = useAppStore(state => state.keyboardHeight);
    const setKeyboardHeight = useAppStore(state => state.setKeyboardHeight);
    const insets = useSafeAreaInsets()


    useEffect(() => {
        const showEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const subShow = Keyboard.addListener(showEvent, e => {
            setKeyboardHeight(e.endCoordinates.height + insets.bottom);
        });
        const subHide = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(insets.bottom);
        });

        return () => {
            subShow.remove();
            subHide.remove();
        };
    }, []);

    useEffect(() => {
        setKeyboardHeight(insets.bottom);
    }, []);

    return {
        keyboardHeight,
        setKeyboardHeight,
    }
}