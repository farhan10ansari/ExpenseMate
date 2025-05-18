import { CustomSnackbarProps } from '@/components/ui/CustomSnackbar';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { create } from 'zustand';

type GlobalSnackbarProps = {
    message: string;
    duration: number;
    actionLabel?: string;
    actionIcon?: IconSource;
    type?: CustomSnackbarProps["type"];
    position?: CustomSnackbarProps["position"];
    offset?: number;
}

type AppStore = {
    keyboardHeight: number;
    setKeyboardHeight: (height: number) => void;
    globalSnackbar: GlobalSnackbarProps | null;
    setGlobalSnackbar: (snackbar: GlobalSnackbarProps | null) => void;
}

const useAppStore = create<AppStore>()((set) => ({
    keyboardHeight: 0,
    setKeyboardHeight: (height) => set({ keyboardHeight: height }),
    globalSnackbar: null,
    setGlobalSnackbar: (snackbar) => set({ globalSnackbar: snackbar }),
}))

export default useAppStore;


