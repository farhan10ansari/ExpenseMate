import useSystemStateStore from "@/stores/useSystemStateStore";
import { useLowPowerMode } from 'expo-battery';
import { useEffect } from "react";


export default function useSystemState() {
    const isLowPowerMode = useLowPowerMode();
    const setLowPowerMode = useSystemStateStore((state) => state.setLowPowerMode);
    useEffect(() => {
        setLowPowerMode(isLowPowerMode);
    }, [isLowPowerMode, setLowPowerMode]);
}