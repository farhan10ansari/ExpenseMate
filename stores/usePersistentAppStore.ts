import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

type PersistentAppStore = {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
    // showDevOptions: boolean;
    // setShowDevOptions: (show: boolean) => void;
    language: "english";
    setLanguage: (language: "english") => void;
    currency: "rupees";
    setCurrency: (currency: "rupees") => void;
    uiFlags: {
        showDevOptions: boolean;
        showNegativeStats: boolean;
    }
    updateUIFlag: (flag: keyof PersistentAppStore['uiFlags'], value: boolean) => void;
}

const usePersistentAppStore = create<PersistentAppStore>()(persist(
    (set) => ({
        theme: "system",
        setTheme: (theme) => set({ theme }),
        // showDevOptions: false,
        // setShowDevOptions: (show) => set({ showDevOptions: show }),
        language: "english",
        setLanguage: (language) => set({ language }),
        currency: "rupees",
        setCurrency: (currency) => set({ currency }),
        uiFlags: {
            showDevOptions: false,
            showNegativeStats: true,
        },
        updateUIFlag: (flag, value) => set((state) => ({
            uiFlags: {
                ...state.uiFlags,
                [flag]: value,
            }
        })),
    }), {
    name: "app-storage", // unique name
    storage: createJSONStorage(() => AsyncStorage),
}))

export default usePersistentAppStore;
