import { create } from 'zustand';

type AppStore = {
    keyboardHeight: number;
    setKeyboardHeight: (height: number) => void;

    // UI Flags for toggling features in the app. resets on app restart
    uiFlags: {
        showManageCategoryInfoBanner: boolean;
    }
    updateUIFlag: (flag: keyof AppStore['uiFlags'], value: boolean) => void;
}

const useAppStore = create<AppStore>()((set) => ({
    keyboardHeight: 0,
    setKeyboardHeight: (height) => set({ keyboardHeight: height }),

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
