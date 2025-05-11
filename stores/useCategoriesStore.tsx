import { create } from 'zustand'
import { Category } from '@/lib/types';
import { DefaultCategories } from '@/lib/constants';

type CategoriesStore = {
    categories: Category[],
}

const useCategoriesStore = create<CategoriesStore>()((set) => ({
    categories: [...DefaultCategories],
}))

export default useCategoriesStore;