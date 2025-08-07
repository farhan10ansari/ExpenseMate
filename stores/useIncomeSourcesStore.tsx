import { create } from 'zustand'
import { Category } from '@/lib/types';
import { DefaultIncomeSources } from '@/lib/constants';

// "Add Source" chip for UI addition
export const AddIncomeSource: Category = {
    name: "add source",
    icon: "plus",
    label: "Add Source",
}

type IncomeSourcesStore = {
    sources: Category[],
    sourceMapping: Record<string, Category>,
}

const useIncomeSourcesStore = create<IncomeSourcesStore>()(() => ({
    sources: [...DefaultIncomeSources],
    sourceMapping: DefaultIncomeSources.reduce((acc, source) => {
        acc[source.name] = source;
        return acc;
    }, {} as Record<string, Category>),
}))

export default useIncomeSourcesStore;

// Utility: get sources as rows for grid display
export const getSourceRows = (sources: Category[]) => {
    const rows = [];
    const numberOfRows = 2; // Or however you want to arrange
    const rowSize = Math.ceil(sources.length / numberOfRows);
    for (let i = 0; i < sources.length; i += rowSize) {
        rows.push(sources.slice(i, i + rowSize));
    }
    return rows;
}
