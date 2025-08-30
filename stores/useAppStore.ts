import { CustomSnackbarProps } from '@/components/ui/CustomSnackbar';
import { Screens } from '@/lib/types';
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
    screens?: Screens[]; // Optional array of screens where this snackbar should be shown
}

type AppStore = {
    keyboardHeight: number;
    setKeyboardHeight: (height: number) => void;
    globalSnackbar: GlobalSnackbarProps | null;
    setGlobalSnackbar: (snackbar: GlobalSnackbarProps | null) => void;
    currentScreen: Screens | null;
    setCurrentScreen: (screen: Screens | null) => void;

    // UI Flags for toggling features in the app. resets on app restart
    uiFlags: {
        showManageCategoryInfoBanner: boolean;
    }
    updateUIFlag: (flag: keyof AppStore['uiFlags'], value: boolean) => void;
}

const useAppStore = create<AppStore>()((set) => ({
    keyboardHeight: 0,
    setKeyboardHeight: (height) => set({ keyboardHeight: height }),
    globalSnackbar: null,
    setGlobalSnackbar: (snackbar) => set({ globalSnackbar: snackbar }),
    currentScreen: null,
    setCurrentScreen: (screen) => set({ currentScreen: screen }),

    // UI Flags for toggling features in the app. resets on app restart
    uiFlags: {
        showManageCategoryInfoBanner: true,
    },
    updateUIFlag: (flag, value) => set((state) => ({
        uiFlags: {
            ...state.uiFlags,
            [flag]: value,
        }
    })),
}))

export default useAppStore;


