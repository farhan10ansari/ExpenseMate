import { Category, PaymentMethod } from "./types";

type CategoryData = Omit<Category, "enabled" | "deletable">;

export const DefaultExpenseCategories: CategoryData[] = [
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


export const DefaultIncomeSources: CategoryData[] = [
    {
        name: "salary",
        label: "Salary",
        icon: "cash",
        color: "#8BC34A"
    },
    {
        name: "business",
        label: "Business",
        icon: "briefcase",
        color: "#4FC3F7"
    },
    {
        name: "freelance",
        label: "Freelance",
        icon: "laptop",
        color: "#FFB300"
    },
    {
        name: "investment",
        label: "Investment",
        icon: "chart-line",
        color: "#9575CD"
    },
    {
        name: "rental",
        label: "Rental",
        icon: "home-city",
        color: "#FFD54F"
    },
    {
        name: "gift",
        label: "Gift",
        icon: "gift",
        color: "#E57373"
    },
    {
        name: "bonus",
        label: "Bonus",
        icon: "star",
        color: "#F06292"
    },
    {
        name: "refund",
        label: "Refund",
        icon: "undo",
        color: "#A1887F"
    },
    {
        name: "pension",
        label: "Pension",
        icon: "account-tie",
        color: "#90A4AE"
    },
    {
        name: "other",
        label: "Other",
        icon: "dots-horizontal-circle-outline",
        color: "#B0BEC5"
    }
];


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


// ✅ Comprehensive icon list organized by category
// constants/icons.ts
export const CATEGORY_ICONS = [
    // Money & Banking
    'cash', 'credit-card', 'bank', 'wallet', 'piggy-bank', 'currency-usd',
    'currency-eur', 'currency-gbp', 'currency-inr', 'hand-coin', 'safe',

    // Shopping & Commerce
    'shopping', 'store', 'cart', 'receipt', 'sale', 'gift', 'card-account-details',

    // Food & Dining
    'food', 'coffee', 'pizza', 'hamburger', 'silverware', 'glass-wine', 'tea',

    // Transportation
    'car', 'gas-station', 'bus', 'train', 'train-car', 'airplane', 'taxi', 'bicycle', 'parking',

    // Utilities & Bills
    'home', 'file-document', 'lightbulb', 'water', 'fire', 'power-plug', 'phone', 'wifi', 'fuel',

    // Health & Medical
    'medical-bag', 'walk', 'pill', 'heart', 'hospital', 'tooth', 'eye', 'stethoscope',

    // Entertainment
    'movie', 'music', 'gamepad-variant', 'television', 'camera', 'book-open',
    'football', 'theater',

    // Work & Education
    'briefcase', 'school', 'book', 'laptop', 'printer',

    // Personal Care
    'face-man', 'spa', 'glasses', 'watch', 'tshirt-crew',

    // Miscellaneous
    'star', 'heart-outline', 'gift-outline', 'bell', 'flag', 'shield', 'dots-horizontal-circle-outline'
] as const;
