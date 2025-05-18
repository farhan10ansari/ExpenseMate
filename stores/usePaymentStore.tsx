import { create } from 'zustand';

type PaymentStore = {
    amount: number;
    setAmount: (amount: number) => void;
    category: string | null;
    setCategory: (category: string) => void;
    description: string;
    setDescription: (description: string) => void;
    datetime: Date | undefined;
    setDatetime: (datetime: Date | undefined) => void;
    resetPaymentStore: () => void;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
    amount: 0,
    setAmount: (amount) => set({ amount }),
    category: null,
    setCategory: (category) => set({ category }),
    description: "",
    setDescription: (description) => set({ description }),
    datetime: undefined,
    setDatetime: (datetime) => set({ datetime }),
    resetPaymentStore: () => set({
        amount: 0,
        category: null,
        description: "",
        datetime: undefined,
    })
}))

export default usePaymentStore;