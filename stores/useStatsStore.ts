import { InsightPeriod } from '@/lib/types';
import { create } from 'zustand';



export type statsPeriodOption = {
    label: string;
    value: InsightPeriod;
}

export const statsPeriodOptions: statsPeriodOption[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
];

type StatsStore = {
    period: statsPeriodOption;
    setPeriod: (period: statsPeriodOption) => void;
}

const useStatsStore = create<StatsStore>()((set) => ({
    period: {
        label: "This Month", // Default label
        value: "this-month", // Default value
    }, // Default period
    setPeriod: (period: statsPeriodOption) => set(() => ({
        period,
    })),
}))

export default useStatsStore;


