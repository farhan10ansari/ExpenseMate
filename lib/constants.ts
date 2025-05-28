import { Category, PaymentMethod } from "./types";

export const DefaultCategories: Category[] = [
    {
        name: "food",
        label: "Food",
        icon: "food",
    },
    {
        name: "transport",
        label: "Transport",
        icon: "train-car",
    },
    {
        name: "shopping",
        label: "Shopping",
        icon: "shopping",
    },
    {
        name: "entertainment",
        label: "Entertainment",
        icon: "movie",
    },
    {
        name: "health",
        label: "Health",
        icon: "heart",
    },
    {
        name: "travel",
        label: "Travel",
        icon: "walk",
    },
    {
        name: "bills",
        label: "Bills",
        icon: "file-document",
    },
    {
        name: "other",
        label: "Other",
        icon: "dots-horizontal-circle-outline",
    }
]

export const paymentMethods: PaymentMethod[] = [
    {
        name: "upi",
        label: "UPI",
        icon: "qrcode-scan"
    },
    {
        name: "cash",
        label: "Cash",
        icon: "cash"
    },
    {
        name: "bank-transfer",
        label: "Bank Transfer",
        icon: "bank"
    },
    {
        name: "credit-card",
        label: "Credit Card",
        icon: "credit-card"
    },
    {
        name: "other",
        label: "Other",
        icon: "dots-horizontal"
    }
];

export const paymentMethodsMapping = paymentMethods.reduce((acc, paymentMethod) => {
    acc[paymentMethod.name] = paymentMethod;
    return acc;
}, {} as Record<string, PaymentMethod>);