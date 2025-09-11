import { categoriesSchema, CategoryRes, CategoryDB } from '@/db/schema';
import db from '@/db/client';
import { eq, and } from 'drizzle-orm';

// Types
type CreateCategoryData = Omit<CategoryDB, 'type'>;
type UpdateCategoryData = Partial<Pick<CategoryDB, 'label' | 'icon' | 'color' | 'enabled'>>;
type Type = CategoryDB['type'];

export const seedDefaultCategoriesData = async ({ type, categories }: { type: Type, categories: Omit<CategoryDB, 'type' | 'enabled' | 'isCustom'>[] }): Promise<void> => {
    try {
        await db
            .insert(categoriesSchema)
            .values(
                categories.map(item => ({
                    name: item.name,
                    type: type,
                    label: item.label,
                    icon: (item.icon as string),
                    color: item.color,
                    enabled: true,
                    isCustom: false
                }))
            )
            .onConflictDoNothing();
    } catch (error) {
        console.error(`Error seeding default ${type} data:`, error);
        throw error;
    }
};

/**
* Get all categories/sources
*/
export const getAllCategories = async (
    type: Type,
    includeDisabled: boolean = false
): Promise<CategoryRes[]> => {
    try {
        if (includeDisabled) {
            return await db
                .select()
                .from(categoriesSchema)
                .where(eq(categoriesSchema.type, type));
        }

        return await db
            .select()
            .from(categoriesSchema)
            .where(
                and(
                    eq(categoriesSchema.type, type),
                    eq(categoriesSchema.enabled, true)
                )
            );
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
): Promise<CategoryRes> => {
    try {
        const newItem = {
            ...data,
            type: type,
            enabled: true,
            isCustom: true,
        };

        const [createdItem] = await db
            .insert(categoriesSchema)
            .values(newItem).returning();
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
): Promise<CategoryRes> => {
    try {
        const [updatedItem] = await db
            .update(categoriesSchema)
            .set(data)
            .where(
                and(
                    eq(categoriesSchema.name, name),
                    eq(categoriesSchema.type, type)
                )
            ).returning();

        // Return the updated item or throw an error if not found
        if (!updatedItem) {
            throw new Error(`Item with name '${name}' not found`);
        }
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
        // First check if the item exists and is custom (deletable)
        const [item] = await db
            .select()
            .from(categoriesSchema)
            .where(
                and(
                    eq(categoriesSchema.name, name),
                    eq(categoriesSchema.type, type)
                )
            );

        if (!item) {
            throw new Error(`Item with name '${name}' not found`);
        }

        if (!item.isCustom) {
            throw new Error(`'${name}' cannot be deleted`);
        }

        await db
            .delete(categoriesSchema)
            .where(
                and(
                    eq(categoriesSchema.name, name),
                    eq(categoriesSchema.type, type)
                )
            );
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
//         const [item] = await db
//             .select()
//             .from(categoriesSchema)
//             .where(
//                 and(
//                     eq(categoriesSchema.name, name),
//                     eq(categoriesSchema.type, type)
//                 )
//             );

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
//         const [item] = await db
//             .select()
//             .from(categoriesSchema)
//             .where(
//                 and(
//                     eq(categoriesSchema.name, name),
//                     eq(categoriesSchema.type, type)
//                 )
//             );

//         return item || null;
//     } catch (error) {
//         console.error(`Error fetching ${type} category by name:`, error);
//         throw error;
//     }
// };
