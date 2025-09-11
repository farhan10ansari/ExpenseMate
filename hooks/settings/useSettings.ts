import { useHaptics } from "@/contexts/HapticsProvider";
import { Currency, Language } from "@/lib/types";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useCallback } from "react";

const useSettings = () => {
    const language = usePersistentAppStore(state => state.settings.language);
    const currency = usePersistentAppStore(state => state.settings.currency);
    const haptics = usePersistentAppStore(state => state.settings.haptics);

    const updateSettings = usePersistentAppStore(state => state.updateSettings);

    const { hapticImpact } = useHaptics();

    const handleLanguageChange = useCallback((language: Language) => {
        hapticImpact("light");
        updateSettings('language', language);
    }, [hapticImpact, updateSettings]);

    const handleCurrencyChange = useCallback((currency: Currency) => {
        hapticImpact("light");
        updateSettings('currency', currency);
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
        currency: currency,
        haptics: haptics,
        handleLanguageChange,
        handleCurrencyChange,
        handleHapticsToggle,
    };
};

export default useSettings;
