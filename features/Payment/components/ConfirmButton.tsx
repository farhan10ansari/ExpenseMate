import { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardEventName, Platform, StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";

type ConfirmButtonProps = {
    onPress?: () => void;
}

export default function ConfirmButton({ onPress }: ConfirmButtonProps) {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [show, setShow] = useState(false);
    const timeout = useRef<number | null>(null);

    useEffect(() => {
        const showEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent: KeyboardEventName =
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const subShow = Keyboard.addListener(showEvent, e => {
            console.log("keyboard show", e);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const subHide = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        // Add a timeout to delay the showing of the FAB
        timeout.current = setTimeout(() => {
            setShow(true);
        }, 500);

        return () => {
            subShow.remove();
            subHide.remove();
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
                setShow(false);
            }
        };
    }, []);

    const styles = StyleSheet.create({
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: keyboardHeight + 20
        },
    })

    return (
        <Portal>
            {show && (
                <FAB
                    icon="check"
                    onPress={onPress}
                    style={styles.fab}
                />
            )}
        </Portal>
    )
}