import { StatsPeriodOption } from '@/lib/types';
import { create } from 'zustand';

type StatsStore = {
  period: StatsPeriodOption;
  setPeriod: (period: StatsPeriodOption) => void;
};

const useStatsStore = create<StatsStore>()((set) => ({
  period: {
    primaryLabel: "This",
    secondaryLabel: "Month",
    type: "month",
    offset: 0,
  },
  setPeriod: (period: StatsPeriodOption) => set(() => ({ period })),
}));

export default useStatsStore;
