import { useEffect, useState } from "react";
import { seedDefaultCategoriesData } from '@/repositories/CategoryRepo';
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { DefaultExpenseCategories, DefaultIncomeSources } from "@/lib/constants";
import { uiLog as log } from "@/lib/logger";

export type SeedConfig = {
  key: string;
  seedFn: () => Promise<void>;
}

export const SEED_CONFIG: SeedConfig[] = [
  {
    key: 'expense-categories',
    seedFn: seedDefaultCategoriesData.bind(null, {
      type: 'expense-category',
      categories: DefaultExpenseCategories
    })
  },
  {
    key: 'income-sources',
    seedFn: seedDefaultCategoriesData.bind(null, {
      type: 'income-source',
      categories: DefaultIncomeSources
    })
  },
  // Add more seed configurations as needed
];

type SeedResult = {
  success: boolean;      // true ⇢ all seed tasks finished without error
  error: Error | null;   // non-null ⇢ something failed
};

const useSeedData = (migrationSuccess: boolean): SeedResult => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isDataSeeded = usePersistentAppStore(s => s.isDataSeeded);
  const markDataSeeded = usePersistentAppStore(s => s.markDataSeeded);

  useEffect(() => {
    // nothing to do
    if (!migrationSuccess || success || error) {
      log.debug("useSeedData: skip seeding", { migrationSuccess, success, hasError: !!error });
      return;
    }

    (async () => {
      try {
        log.debug("useSeedData: start seeding");
        for (const { key, seedFn } of SEED_CONFIG) {
          if (isDataSeeded(key)) {
            log.debug("useSeedData: already seeded - skip", { key });
            continue;
          }
          log.debug("useSeedData: seeding task start", { key });
          await seedFn();
          markDataSeeded(key);                          // mark on success
          log.debug("useSeedData: seeding task done", { key });
        }
        setSuccess(true);                               // everything passed
        log.info("useSeedData: seeding completed");
      } catch (e) {
        log.error("useSeedData: seeding failed", { error: String(e) });
        setError(e as Error);                           // expose the failure
      }
    })();
  }, [migrationSuccess, success, error, isDataSeeded, markDataSeeded]);

  return { success, error };
};

export default useSeedData;
