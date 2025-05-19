import { PaymentMethod } from '@/lib/types';
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
    paymentMethod: PaymentMethod["name"] | undefined;
    setPaymentMethod: (paymentMethod: PaymentMethod["name"] | undefined) => void;
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
    paymentMethod: undefined,
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    resetPaymentStore: () => set({
        amount: 0,
        category: null,
        description: "",
        datetime: undefined,
    })
}))

export default usePaymentStore;