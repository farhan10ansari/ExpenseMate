import { Category, PaymentMethod } from "./types";

export const DefaultCategories: Category[] = [
    {
        name: "food",
        label: "Food",
        icon: "food",
        color: "#A8D0E6"
    },
    {
        name: "transport",
        label: "Transport",
        icon: "train-car",
        color: "#F76C6C"
    },
    {
        name: "shopping",
        label: "Shopping",
        icon: "shopping",
        color: "#F8E9A1"
    },
    {
        name: "entertainment",
        label: "Entertainment",
        icon: "movie",
        color: "#8BC6A3"
    },
    {
        name: "health",
        label: "Health",
        icon: "heart",
        color: "#CBAACB"
    },
    {
        name: "travel",
        label: "Travel",
        icon: "walk",
        color: "#FFBCB3"
    },
    {
        name: "bills",
        label: "Bills",
        icon: "file-document",
        color: "#D3D3D3"
    },
    {
        name: "other",
        label: "Other",
        icon: "dots-horizontal-circle-outline",
        color: "#B0BEC5"
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