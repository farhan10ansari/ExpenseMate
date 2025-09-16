import { Currency, Language } from '@/lib/types';
import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

type AppSettings = {
    language: Language;
    currency: Currency;
    biometricLogin: boolean;
    haptics: {
        enabled: boolean;
        intensity: "light" | "medium" | "heavy";
    };
};

type PersistentAppStore = {
    // Theme management
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;

    // App settings management
    settings: AppSettings;
    updateSettings: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;

    // UI flags
    uiFlags: {
        showDevOptions: boolean;
        showNegativeStats: boolean;
        onboardingCompleted: boolean;
    };
    updateUIFlag: (flag: keyof PersistentAppStore['uiFlags'], value: boolean) => void;

    // Data seeding management
    seededKeys: string[];
    markDataSeeded: (key: string) => void;
    isDataSeeded: (key: string) => boolean;
};

const defaultSettings: AppSettings = {
    language: "english",
    currency: "rupees",
    biometricLogin: false,
    haptics: {
        enabled: true,
        intensity: "medium",
    }
};

const usePersistentAppStore = create<PersistentAppStore>()(persist(
    (set, get) => ({
        // Theme management
        theme: "system",
        setTheme: (theme) => set({ theme }),

        // App settings management
        settings: defaultSettings,
        updateSettings: (key, value) => set((state) => ({
            settings: {
                ...state.settings,
                [key]: value,
            }
        })),

        // UI flags
        uiFlags: {
            showDevOptions: false,
            showNegativeStats: true,
            onboardingCompleted: false,
        },
        updateUIFlag: (flag, value) => set((state) => ({
            uiFlags: {
                ...state.uiFlags,
                [flag]: value,
            }
        })),

        // Data seeding management
        seededKeys: [],
        markDataSeeded: (key) => set((state) => ({
            seededKeys: state.seededKeys.includes(key)
                ? state.seededKeys
                : [...state.seededKeys, key]
        })),
        isDataSeeded: (key) => get().seededKeys.includes(key),
    }), {
    name: "app-storage",
    storage: createJSONStorage(() => Storage),
}));

export default usePersistentAppStore;
export type { AppSettings };
