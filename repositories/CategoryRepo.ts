import { expenseCategoriesSchema, ExpenseCategory, IncomeSource, incomeSourcesSchema } from '@/db/schema';
import { DefaultExpenseCategories, DefaultIncomeSources } from '@/lib/constants';
import db from '@/db/client';
import { eq } from 'drizzle-orm';

// Keep seed functions separate as requested
export const seedDefaultExpenseCategoriesData = async (): Promise<void> => {
    try {
        await db
            .insert(expenseCategoriesSchema)
            .values(
                DefaultExpenseCategories.map(category => ({
                    name: category.name,
                    label: category.label,
                    icon: (category.icon as string),
                    color: category.color,
                    enabled: true,
                    isCustom: false
                }))
            )
            .onConflictDoNothing();

        console.log('Default categories seeded successfully');
    } catch (error) {
        console.error('Error seeding default category data:', error);
        throw error;
    }
};

export const seedDefaultIncomeSourcesData = async (): Promise<void> => {
    try {
        await db
            .insert(incomeSourcesSchema)
            .values(
                DefaultIncomeSources.map(source => ({
                    name: source.name,
                    label: source.label,
                    icon: (source.icon as string),
                    color: source.color,
                    enabled: true,
                    isCustom: false
                }))
            )
            .onConflictDoNothing();
        console.log('Default income sources seeded successfully');
    } catch (error) {
        console.error('Error seeding default income sources:', error);
        throw error;
    }
};

// Types
type CreateCategoryData = {
    name: string;
    label: string;
    icon: string;
    color: string;
}

type UpdateCategoryData = Partial<{
    label: string;
    icon: string;
    color: string;
    enabled: boolean;
}>

type Type = 'expense' | 'income';
type CategoryResult = ExpenseCategory | IncomeSource;

// Helper function to get the correct schema and table
const getSchemaAndTable = (type: Type) => {
    return type === 'expense' 
        ? { schema: expenseCategoriesSchema, tableName: 'expense category' }
        : { schema: incomeSourcesSchema, tableName: 'income source' };
};

/**
 * Get all categories/sources
 */
export const getAllCategories = async (
    type: Type,
    includeDisabled: boolean = false
): Promise<CategoryResult[]> => {
    try {
        const { schema } = getSchemaAndTable(type);

        if (includeDisabled) {
            return await db.select().from(schema);
        }

        return await db
            .select()
            .from(schema)
            .where(eq(schema.enabled, true));
    } catch (error) {
        console.error(`Error fetching ${type} categories:`, error);
        throw error;
    }
};

/**
 * Create a new category/source
 */
export const createNewCategory = async (
    type: Type,
    data: CreateCategoryData
): Promise<CategoryResult> => {
    try {
        const { schema, tableName } = getSchemaAndTable(type);
        
        const newItem = {
            ...data,
            enabled: true,
            isCustom: true,
        };

        await db
            .insert(schema)
            .values(newItem);

        // Return the created item
        const [createdItem] = await db
            .select()
            .from(schema)
            .where(eq(schema.name, data.name));

        console.log(`${tableName} '${data.name}' created successfully`);
        return createdItem;
    } catch (error) {
        console.error(`Error creating ${type} category:`, error);
        throw error;
    }
};

/**
 * Update an existing category/source (name cannot be updated)
 */
export const updateCategory = async (
    type: Type,
    name: string,
    data: UpdateCategoryData
): Promise<CategoryResult> => {
    try {
        const { schema, tableName } = getSchemaAndTable(type);

        await db
            .update(schema)
            .set(data)
            .where(eq(schema.name, name));

        // Return the updated item
        const [updatedItem] = await db
            .select()
            .from(schema)
            .where(eq(schema.name, name));

        if (!updatedItem) {
            throw new Error(`${tableName} with name '${name}' not found`);
        }

        console.log(`${tableName} '${name}' updated successfully`);
        return updatedItem;
    } catch (error) {
        console.error(`Error updating ${type} category:`, error);
        throw error;
    }
};

/**
 * Delete a category/source
 */
export const deleteCategory = async (type: Type, name: string): Promise<void> => {
    try {
        const { schema, tableName } = getSchemaAndTable(type);

        // First check if the item exists and is custom (deletable)
        const [item] = await db
            .select()
            .from(schema)
            .where(eq(schema.name, name));

        if (!item) {
            throw new Error(`${tableName} with name '${name}' not found`);
        }

        if (!item.isCustom) {
            throw new Error(`${tableName} '${name}' cannot be deleted`);
        }

        await db
            .delete(schema)
            .where(eq(schema.name, name));

        console.log(`${tableName} '${name}' deleted successfully`);
    } catch (error) {
        console.error(`Error deleting ${type} category:`, error);
        throw error;
    }
};

// /**
//  * Check if category/source name exists
//  */
// export const categoryExists = async (type: Type, name: string): Promise<boolean> => {
//     try {
//         const { schema } = getSchemaAndTable(type);

//         const [item] = await db
//             .select()
//             .from(schema)
//             .where(eq(schema.name, name));

//         return !!item;
//     } catch (error) {
//         console.error(`Error checking ${type} category existence:`, error);
//         throw error;
//     }
// };

// /**
//  * Get a single category/source by name
//  */
// export const getCategoryByName = async (
//     type: Type, 
//     name: string
// ): Promise<CategoryResult | null> => {
//     try {
//         const { schema } = getSchemaAndTable(type);

//         const [item] = await db
//             .select()
//             .from(schema)
//             .where(eq(schema.name, name));

//         return item || null;
//     } catch (error) {
//         console.error(`Error fetching ${type} category by name:`, error);
//         throw error;
//     }
// };
