import React, { createContext, useContext, useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useLowPowerMode } from 'expo-battery';
import usePersistentAppStore from '@/stores/usePersistentAppStore';

interface HapticsContextType {
    // Core haptic functions
    hapticImpact: (style?: "light" | "medium" | "heavy" | "rigid" | "soft", force?: boolean) => Promise<void>;
    hapticNotify: (type: "success" | "error" | "warning", force?: boolean) => Promise<void>;
    hapticSelect: (force?: boolean) => Promise<void>;

    // Status information
    isEnabled: boolean;
    intensity: "light" | "medium" | "heavy";
    canVibrate: boolean;
}

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

// Optimized selectors for Zustand
export const HapticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLowPowerMode = useLowPowerMode();

    // Use separate selectors to prevent unnecessary re-renders
    const enabled = usePersistentAppStore(state => state.settings.haptics.enabled);
    const intensity = usePersistentAppStore(state => state.settings.haptics.intensity);

    // Memoize derived state
    const canVibrate = useMemo(() =>
        enabled && !isLowPowerMode,
        [enabled, isLowPowerMode]
    );

    // Memoize haptic functions with useCallback
    const hapticImpact: HapticsContextType['hapticImpact'] = useCallback(async (style, force = false) => {
        if (!force && !canVibrate) return;

        const resolvedIntensity = style || intensity;

        try {
            switch (resolvedIntensity) {
                case "light":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case "medium":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case "heavy":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
                case "rigid":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    break;
                case "soft":
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    break;
            }
        } catch (error) {
            console.warn('Haptic impact failed:', error);
        }
    }, [canVibrate, intensity]);

    const hapticNotify: HapticsContextType['hapticNotify'] = useCallback(async (type, force = false) => {
        if (!force && !canVibrate) return;

        try {
            switch (type) {
                case "success":
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    break;
                case "error":
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    break;
                case "warning":
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    break;
            }
        } catch (error) {
            console.warn('Haptic notification failed:', error);
        }
    }, [canVibrate]);

    const hapticSelect: HapticsContextType['hapticSelect'] = useCallback(async (force = false) => {
        if (!force && !canVibrate) return;

        try {
            await Haptics.selectionAsync();
        } catch (error) {
            console.warn('Haptic selection failed:', error);
        }
    }, [canVibrate]);

    //  Memoize the entire context value
    const contextValue = useMemo((): HapticsContextType => ({
        // Core functions
        hapticImpact,
        hapticNotify,
        hapticSelect,

        // Status
        isEnabled: enabled,
        intensity: intensity,
        canVibrate,
    }), [hapticImpact, hapticNotify, hapticSelect, enabled, intensity, canVibrate]);

    return (
        <HapticsContext.Provider value={contextValue}>
            {children}
        </HapticsContext.Provider>
    );
};

// Custom hook to use haptics
export const useHaptics = () => {
    const context = useContext(HapticsContext);
    if (!context) {
        throw new Error('useHaptics must be used within a HapticsProvider');
    }
    return context;
};
