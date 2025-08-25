import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

type PersistentAppStore = {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
    language: "english";
    setLanguage: (language: "english") => void;
    currency: "rupees";
    setCurrency: (currency: "rupees") => void;
    // Haptics settings
    haptics: {
        enabled: boolean;
        intensity: "light" | "medium" | "heavy";
    };
    setHaptics: (enabled: boolean, intensity?: "light" | "medium" | "heavy") => void;
    // UI Flags
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
        language: "english",
        setLanguage: (language) => set({ language }),
        currency: "rupees",
        setCurrency: (currency) => set({ currency }),

        // Haptics defaults
        haptics: {
            enabled: true,
            intensity: "medium",
        },
        setHaptics: (enabled, intensity) => set((state) => ({
            haptics: {
                ...state.haptics,
                enabled,
                ...(intensity && { intensity }),
            }
        })),
        // UI Flags
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
