import { Category, PaymentMethod } from "./types";

export const DefaultCategories: Category[] = [
    {
        name: "Food",
        icon: "food",
    },
    {
        name: "Transport",
        icon: "train-car",
    },
    {
        name: "Shopping",
        icon: "shopping",
    },
    {
        name: "Entertainment",
        icon: "movie",
    },
    {
        name: "Health",
        icon: "heart",
    },
    {
        name: "Travel",
        icon: "walk",
    },
    {
        name: "Bills",
        icon: "file-document",
    },
    {
        name: "Other",
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