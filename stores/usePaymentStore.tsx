import { create } from 'zustand'

type PaymentStore = {
    amount: number;
    setAmount: (amount: number) => void;
    category: string | null;
    setCategory: (category: string) => void;
    description: string;
    setDescription: (description: string) => void;
    datetime: Date | null;
    setDatetime: (datetime: Date | null) => void;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
    amount: 0,
    setAmount: (amount) => set({ amount }),
    category: null,
    setCategory: (category) => set({ category }),
    description: "",
    setDescription: (description) => set({ description }),
    datetime: null,
    setDatetime: (datetime) => set({ datetime }),
}))

export default usePaymentStore;