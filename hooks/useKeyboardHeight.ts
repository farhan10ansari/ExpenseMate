import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";
import { Keyboard, KeyboardEventName, Platform } from "react-native";

//Currently its not perfect, but it works for now. When focus changes from one input to another, the keyboard height is not updated.
export default function useKeyboardHeight() {
    const keyboardHeight = useAppStore(state => state.keyboardHeight);
    const setKeyboardHeight = useAppStore(state => state.setKeyboardHeight);

    useEffect(() => {
        const showEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const subShow = Keyboard.addListener(showEvent, e => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const subHide = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            subShow.remove();
            subHide.remove();
        };
    }, []);

    return {
        keyboardHeight,
        setKeyboardHeight,
    }
}