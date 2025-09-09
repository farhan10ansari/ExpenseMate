import { create } from 'zustand';
import Storage from 'expo-sqlite/kv-store';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useMemo } from 'react';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/types';
import { DefaultIncomeSources } from '@/lib/constants';

interface IncomeSourcesStore {
    sources: Category[];

    // Basic operations
    setSources: (sources: Category[]) => void;
    addSource: (source: CreateCategoryData) => void;
    updateSource: (name: string, updates: UpdateCategoryData) => void;
    deleteSource: (name: string) => void;

    // Utility functions
    getSourceByName: (name: string) => Category | undefined;
    sourceExists: (name: string) => boolean;

    // Bulk operations
    resetToDefaults: (defaultSources: Category[]) => void;
    clearAll: () => void;
}

export const useIncomeSourcesStore = create<IncomeSourcesStore>()(
    persist(
        (set, get) => ({
            sources: DefaultIncomeSources.map(src => ({
                ...src, enabled: true
            })),
            setSources: (sources) => set({ sources }),

            addSource: (sourceData) => {
                const { sources } = get();

                // Check if source already exists
                if (sources.some(src => src.name === sourceData.name)) {
                    throw new Error(`Income source with name '${sourceData.name}' already exists`);
                }

                const newSource: Category = {
                    ...sourceData,
                    enabled: true,
                    isCustom: true,
                };

                set({ sources: [...sources, newSource] });
            },

            updateSource: (name, updates) => {
                const { sources } = get();
                const sourceIndex = sources.findIndex(src => src.name === name);

                if (sourceIndex === -1) {
                    throw new Error(`Income source with name '${name}' not found`);
                }

                const updatedSources = [...sources];
                updatedSources[sourceIndex] = {
                    ...updatedSources[sourceIndex],
                    ...updates
                };

                set({ sources: updatedSources });
            },

            deleteSource: (name) => {
                const { sources } = get();
                const source = sources.find(src => src.name === name);

                if (!source) {
                    throw new Error(`Income source with name '${name}' not found`);
                }

                if (!source.isCustom) {
                    throw new Error(`Income source '${name}' cannot be deleted`);
                }

                set({ sources: sources.filter(src => src.name !== name) });
            },

            getSourceByName: (name) => {
                return get().sources.find(src => src.name === name);
            },

            sourceExists: (name) => {
                return get().sources.some(src => src.name === name);
            },

            resetToDefaults: (defaultSources) => {
                set({ sources: defaultSources });
            },

            clearAll: () => {
                set({ sources: [] });
            },
        }),
        {
            name: 'income-sources-storage',
            storage: createJSONStorage(() => Storage),
        }
    )
);

// Hooks
export const useIncomeSources = () => {
    return useIncomeSourcesStore(state => state.sources);
};

export const useEnabledIncomeSources = () => {
    const sources = useIncomeSourcesStore(state => state.sources);
    return useMemo(() => sources.filter(src => src.enabled), [sources]);
};

export const useIncomeSourceMapping = () => {
    const sources = useIncomeSourcesStore(state => state.sources);
    return useMemo(() => {
        const map = new Map<string, Category>();
        sources.forEach(source => {
            map.set(source.name, source);
        });
        return map;
    }, [sources]);
};