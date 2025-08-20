import usePersistentAppStore from '@/stores/usePersistentAppStore';
import useSystemStateStore from '@/stores/useSystemStateStore';
import * as Haptics from 'expo-haptics';

class HapticsEngineClass {
    // Impact Feedback
    async impact(style?: "light" | "medium" | "heavy" | "rigid" | "soft") {
        const { haptics } = usePersistentAppStore.getState();
        if (!haptics.enabled) return;

        const intensity = style || haptics.intensity;

        const isLowPowerMode = useSystemStateStore.getState().isLowPowerMode
        if (isLowPowerMode) return;

        switch (intensity) {
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
    }

    // Notification Feedback
    async notify(type: "success" | "error" | "warning") {
        const { haptics } = usePersistentAppStore.getState();
        if (!haptics.enabled) return;

        const isLowPowerMode = useSystemStateStore.getState().isLowPowerMode
        if (isLowPowerMode) return;

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
    }

    // Selection Feedback
    async select() {
        const { haptics } = usePersistentAppStore.getState();
        if (!haptics.enabled) return;
        const isLowPowerMode = useSystemStateStore.getState().isLowPowerMode
        if (isLowPowerMode) return;
        await Haptics.selectionAsync();
    }
}

// Export singleton instance
export const HapticsEngine = new HapticsEngineClass();

// Export convenience functions for global use
export const hapticImpact = (style?: "light" | "medium" | "heavy" | "rigid" | "soft") =>
    HapticsEngine.impact(style);

export const hapticNotify = (type: "success" | "error" | "warning") =>
    HapticsEngine.notify(type);

export const hapticSelect = () => {
    HapticsEngine.select();
}

