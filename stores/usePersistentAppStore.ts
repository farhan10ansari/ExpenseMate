import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

type PersistentAppStore = {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
}

const usePersistentAppStore = create<PersistentAppStore>()(persist(
    (set) => ({
        theme: "system",
        setTheme: (theme) => set({ theme }),
    }), {
    name: "app-storage", // unique name
    storage: createJSONStorage(() => AsyncStorage),
}))

export default usePersistentAppStore;


