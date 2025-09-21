import { useHaptics } from "@/contexts/HapticsProvider";
import {  Language } from "@/lib/types";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useCallback } from "react";

const useSettings = () => {
    const language = usePersistentAppStore(state => state.settings.language);
    const haptics = usePersistentAppStore(state => state.settings.haptics);

    const updateSettings = usePersistentAppStore(state => state.updateSettings);

    const { hapticImpact } = useHaptics();

    const handleLanguageChange = useCallback((language: Language) => {
        hapticImpact("light");
        updateSettings('language', language);
    }, [hapticImpact, updateSettings]);

    const handleHapticsToggle = useCallback((enabled: boolean) => {
        const newHaptics = { ...haptics, enabled };
        updateSettings('haptics', newHaptics);
        if (enabled) {
            hapticImpact(undefined, true);
        }
    }, [haptics, updateSettings, hapticImpact]);

    return {
        language: language,
        haptics: haptics,
        handleLanguageChange,
        handleHapticsToggle,
    };
};

export default useSettings;
