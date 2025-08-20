import { create } from 'zustand';


type SystemState = {
    isLowPowerMode: boolean; // Indicates if the device is in low power mode
    setLowPowerMode: (isLowPowerMode: boolean) => void; // Function to set the low power mode state
};

const useSystemStateStore = create<SystemState>()((set) => ({
    isLowPowerMode: false,
    setLowPowerMode: (isLowPowerMode) => set({ isLowPowerMode }),
}));

export default useSystemStateStore;
