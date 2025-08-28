// import { expenseCategoriesSchema, ExpenseCategory, IncomeSource, incomeSourcesSchema } from '@/db/schema';
// import { DefaultExpenseCategories, DefaultIncomeSources } from '@/lib/constants';
// import db from '@/db/client';
// import { eq } from 'drizzle-orm';

// export const seedDefaultExpenseCategoriesData = async (): Promise<void> => {
//     try {
//         // Insert expense categories
//         await db
//             .insert(expenseCategoriesSchema)
//             .values(
//                 DefaultExpenseCategories.map(category => ({
//                     ...category,
//                     enabled: true,
//                     deletable: false,
//                 }))
//             )
//             .onConflictDoNothing();

//         console.log('Default categories seeded successfully');
//     } catch (error) {
//         console.error('Error seeding default category data:', error);
//         throw error;
//     }
// };

// export const seedDefaultIncomeSourcesData = async (): Promise<void> => {
//     try {
//         // Insert income sources
//         await db
//             .insert(incomeSourcesSchema)
//             .values(
//                 DefaultIncomeSources.map(source => ({
//                     ...source,
//                     enabled: true,
//                     deletable: false,
//                 }))
//             )
//             .onConflictDoNothing();
//         console.log('Default income sources seeded successfully');
//     } catch (error) {
//         console.error('Error seeding default income sources:', error);
//         throw error;
//     }
// };

// export const getAllExpenseCategories = async (
//     includeDisabled: boolean = false
// ): Promise<ExpenseCategory[]> => {
//     try {
//         if (includeDisabled) {
//             return await db.select().from(expenseCategoriesSchema);
//         }

//         return await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.enabled, true));
//     } catch (error) {
//         console.error('Error fetching expense categories:', error);
//         throw error;
//     }
// };

// export const getAllIncomeSources = async (
//     includeDisabled: boolean = false
// ): Promise<IncomeSource[]> => {
//     try {
//         if (includeDisabled) {
//             return await db.select().from(incomeSourcesSchema);
//         }

//         return await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.enabled, true));
//     } catch (error) {
//         console.error('Error fetching income sources:', error);
//         throw error;
//     }
// };


// // Types for the functions
// type CreateCategoryData = {
//     name: string;
//     label: string;
//     icon: string;
//     color: string;
// }

// type UpdateCategoryData = Partial<{
//     label: string;
//     icon: string;
//     color: string;
//     enabled: boolean;
// }>


// /**
//  * Create a new expense category
//  */
// export const createNewExpenseCategory = async (data: CreateCategoryData): Promise<ExpenseCategory> => {
//     try {
//         const newCategory = {
//             ...data,
//             enabled: true,
//             deletable: true,
//         };

//         await db
//             .insert(expenseCategoriesSchema)
//             .values(newCategory);

//         // Return the created category
//         const [createdCategory] = await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, data.name));

//         console.log(`Expense category '${data.name}' created successfully`);
//         return createdCategory;
//     } catch (error) {
//         console.error('Error creating expense category:', error);
//         throw error;
//     }
// };

// /**
//  * Create a new income source
//  */
// export const createNewIncomeSource = async (data: CreateCategoryData): Promise<IncomeSource> => {
//     try {
//         const newSource = {
//             ...data,
//             enabled: true,
//             deletable: true,
//         };

//         await db
//             .insert(incomeSourcesSchema)
//             .values(newSource);

//         // Return the created source
//         const [createdSource] = await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, data.name));

//         console.log(`Income source '${data.name}' created successfully`);
//         return createdSource;
//     } catch (error) {
//         console.error('Error creating income source:', error);
//         throw error;
//     }
// };

// /**
//  * Update an existing expense category (name cannot be updated)
//  */
// export const updateExpenseCategory = async (
//     name: string,
//     data: UpdateCategoryData
// ): Promise<ExpenseCategory> => {
//     try {
//         await db
//             .update(expenseCategoriesSchema)
//             .set(data)
//             .where(eq(expenseCategoriesSchema.name, name));

//         // Return the updated category
//         const [updatedCategory] = await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, name));

//         if (!updatedCategory) {
//             throw new Error(`Expense category with name '${name}' not found`);
//         }

//         console.log(`Expense category '${name}' updated successfully`);
//         return updatedCategory;
//     } catch (error) {
//         console.error('Error updating expense category:', error);
//         throw error;
//     }
// };



// /**
//  * Update an existing income source (name cannot be updated)
//  */
// export const updateIncomeSource = async (
//     name: string,
//     data: UpdateCategoryData
// ): Promise<IncomeSource> => {
//     try {
//         await db
//             .update(incomeSourcesSchema)
//             .set(data)
//             .where(eq(incomeSourcesSchema.name, name));

//         // Return the updated source
//         const [updatedSource] = await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, name));

//         if (!updatedSource) {
//             throw new Error(`Income source with name '${name}' not found`);
//         }

//         console.log(`Income source '${name}' updated successfully`);
//         return updatedSource;
//     } catch (error) {
//         console.error('Error updating income source:', error);
//         throw error;
//     }
// };


// /**
//  * Delete an expense category
//  */
// export const deleteExpenseCategory = async (name: string): Promise<void> => {
//     try {
//         // First check if the category exists and is deletable
//         const [category] = await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, name));

//         if (!category) {
//             throw new Error(`Expense category with name '${name}' not found`);
//         }

//         if (!category.deletable) {
//             throw new Error(`Expense category '${name}' cannot be deleted`);
//         }

//         await db
//             .delete(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, name));

//         console.log(`Expense category '${name}' deleted successfully`);
//     } catch (error) {
//         console.error('Error deleting expense category:', error);
//         throw error;
//     }
// };

// /**
//  * Delete an income source
//  */
// export const deleteIncomeSource = async (name: string): Promise<void> => {
//     try {
//         // First check if the source exists and is deletable
//         const [source] = await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, name));

//         if (!source) {
//             throw new Error(`Income source with name '${name}' not found`);
//         }

//         if (!source.deletable) {
//             throw new Error(`Income source '${name}' cannot be deleted`);
//         }

//         await db
//             .delete(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, name));

//         console.log(`Income source '${name}' deleted successfully`);
//     } catch (error) {
//         console.error('Error deleting income source:', error);
//         throw error;
//     }
// };





// // UTILITY FUNCTIONS

// /**
//  * Check if expense category name exists
//  */
// export const expenseCategoryExists = async (name: string): Promise<boolean> => {
//     try {
//         const [category] = await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, name));

//         return !!category;
//     } catch (error) {
//         console.error('Error checking expense category existence:', error);
//         throw error;
//     }
// };

// /**
//  * Check if income source name exists
//  */
// export const incomeSourceExists = async (name: string): Promise<boolean> => {
//     try {
//         const [source] = await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, name));

//         return !!source;
//     } catch (error) {
//         console.error('Error checking income source existence:', error);
//         throw error;
//     }
// };

// /**
//  * Get a single expense category by name
//  */
// export const getExpenseCategoryByName = async (name: string): Promise<ExpenseCategory | null> => {
//     try {
//         const [category] = await db
//             .select()
//             .from(expenseCategoriesSchema)
//             .where(eq(expenseCategoriesSchema.name, name));

//         return category || null;
//     } catch (error) {
//         console.error('Error fetching expense category by name:', error);
//         throw error;
//     }
// };

// /**
//  * Get a single income source by name
//  */
// export const getIncomeSourceByName = async (name: string): Promise<IncomeSource | null> => {
//     try {
//         const [source] = await db
//             .select()
//             .from(incomeSourcesSchema)
//             .where(eq(incomeSourcesSchema.name, name));

//         return source || null;
//     } catch (error) {
//         console.error('Error fetching income source by name:', error);
//         throw error;
//     }
// };
