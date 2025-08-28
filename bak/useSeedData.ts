// import { useEffect, useState } from "react";
// import { seedDefaultExpenseCategoriesData, seedDefaultIncomeSourcesData } from '@/repositories/CategoryRepo';
// import usePersistentAppStore from "@/stores/usePersistentAppStore";

// export type SeedConfig = {
//     key: string;
//     seedFn: () => Promise<void>;
// }

// export const SEED_CONFIG: SeedConfig[] = [
//     {
//         key: 'categories',
//         seedFn: seedDefaultExpenseCategoriesData
//     },
//     {
//         key: 'incomeSources',
//         seedFn: seedDefaultIncomeSourcesData
//     },
//     // Add more seed configurations as needed
// ];


// type SeedResult = {
//   success: boolean;      // true ⇢ all seed tasks finished without error
//   error: Error | null;   // non-null ⇢ something failed
// };

// const useSeedData = (migrationSuccess: boolean): SeedResult => {
//   const [success, setSuccess] = useState(false);
//   const [error,   setError]   = useState<Error | null>(null);

//   const isDataSeeded   = usePersistentAppStore(s => s.isDataSeeded);
//   const markDataSeeded = usePersistentAppStore(s => s.markDataSeeded);

//   useEffect(() => {
//     if (!migrationSuccess || success || error) return;  // nothing to do

//     (async () => {
//       try {
//         for (const { key, seedFn } of SEED_CONFIG) {
//           if (isDataSeeded(key)) continue;             
//           await seedFn();
//           markDataSeeded(key);                          // mark on success
//         }
//         setSuccess(true);                               // everything passed
//       } catch (e) {
//         console.error("Seeding error:", e);
//         setError(e as Error);                           // expose the failure
//       }
//     })();
//   }, [migrationSuccess, success, error, isDataSeeded, markDataSeeded]);

//   return { success, error };
// };

// export default useSeedData;