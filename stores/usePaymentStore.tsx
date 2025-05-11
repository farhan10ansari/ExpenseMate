import { create } from 'zustand'

type PaymentStore = {
    amount: number;
    setAmount: (amount: number) => void;
    category: string | null;
    setCategory: (category: string) => void;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
    amount: 0,
    setAmount: (amount) => set({ amount }),
    category: null,
    setCategory: (category) => set({ category }),
}))

export default usePaymentStore;