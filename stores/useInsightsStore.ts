import { InsightPeriod } from '@/lib/types';
import { create } from 'zustand';



export type InsightPeriodOption = {
    label: string;
    value: InsightPeriod;
}

export const insightPeriodOptions: InsightPeriodOption[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
];

type InsightsStore = {
    period: InsightPeriodOption;
    setPeriod: (period: InsightPeriodOption) => void;
}

const useInsightsStore = create<InsightsStore>()((set) => ({
    period: {
        label: "This Month", // Default label
        value: "this-month", // Default value
    }, // Default period
    setPeriod: (period: InsightPeriodOption) => set(() => ({
        period,
    })),
}))

export default useInsightsStore;


