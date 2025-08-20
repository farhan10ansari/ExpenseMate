import React, { createContext, useContext } from 'react';
import * as Haptics from 'expo-haptics';
import { useLowPowerMode } from 'expo-battery';
import usePersistentAppStore from '@/stores/usePersistentAppStore';

interface HapticsContextType {
    // Core haptic functions
    hapticImpact: (style?: "light" | "medium" | "heavy" | "rigid" | "soft") => Promise<void>;
    hapticNotify: (type: "success" | "error" | "warning") => Promise<void>;
    hapticSelect: () => Promise<void>;

    // Status information
    isEnabled: boolean;
    intensity: "light" | "medium" | "heavy";
    canVibrate: boolean;
}

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

export const HapticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLowPowerMode = useLowPowerMode();

    // Get settings from your persistent store
    const { enabled, intensity } = usePersistentAppStore(state => state.haptics);

    // Calculate if haptics can actually be triggered
    const canVibrate = enabled && !isLowPowerMode;

    // Core haptic functions
    const hapticImpact = async (style?: "light" | "medium" | "heavy" | "rigid" | "soft") => {
        if (!canVibrate) return;

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
    };

    const hapticNotify = async (type: "success" | "error" | "warning") => {
        if (!canVibrate) return;

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
    };

    const hapticSelect = async () => {
        if (!canVibrate) return;

        try {
            await Haptics.selectionAsync();
        } catch (error) {
            console.warn('Haptic selection failed:', error);
        }
    };


    const value: HapticsContextType = {
        // Core functions
        hapticImpact,
        hapticNotify,
        hapticSelect,

        // Status
        isEnabled: enabled,
        intensity: intensity,
        canVibrate,
    };

    return (
        <HapticsContext.Provider value={value}>
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
