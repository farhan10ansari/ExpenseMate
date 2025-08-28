import { Category, IconWithColor, PaymentMethod } from "./types";

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



export const ICON_COLORS: IconWithColor[] = [
    // Existing colors from your categories
    { icon: 'food', color: '#A8D0E6' },
    { icon: 'train-car', color: '#F76C6C' },
    { icon: 'shopping', color: '#F8E9A1' },
    { icon: 'movie', color: '#8BC6A3' },
    { icon: 'heart', color: '#CBAACB' },
    { icon: 'walk', color: '#FFBCB3' },
    { icon: 'file-document', color: '#B8E6B8' }, // Changed from gray to soft green
    { icon: 'cash', color: '#8BC34A' },
    { icon: 'briefcase', color: '#4FC3F7' },
    { icon: 'laptop', color: '#FFB300' },
    { icon: 'gift', color: '#E57373' },
    { icon: 'star', color: '#F06292' },
    { icon: 'dots-horizontal-circle-outline', color: '#C8A2C8' }, // Changed from gray to soft purple

    // New colors for remaining icons
    { icon: 'credit-card', color: '#87CEEB' },
    { icon: 'bank', color: '#98D8C8' },
    { icon: 'wallet', color: '#F7DC6F' },
    { icon: 'piggy-bank', color: '#F1948A' },
    { icon: 'currency-usd', color: '#85C1E9' },
    { icon: 'currency-eur', color: '#A9DFBF' },
    { icon: 'currency-gbp', color: '#F8C471' },
    { icon: 'currency-inr', color: '#D7BDE2' },
    { icon: 'hand-coin', color: '#82E0AA' },
    { icon: 'safe', color: '#AED6F1' },

    { icon: 'store', color: '#FAD7A0' },
    { icon: 'cart', color: '#A3E4D7' },
    { icon: 'receipt', color: '#D5A6BD' },
    { icon: 'sale', color: '#F9E79F' },
    { icon: 'card-account-details', color: '#85C1E9' },

    { icon: 'coffee', color: '#D2B48C' },
    { icon: 'pizza', color: '#FF9999' },
    { icon: 'hamburger', color: '#DEB887' },
    { icon: 'silverware', color: '#B0C4DE' },
    { icon: 'glass-wine', color: '#DDA0DD' },
    { icon: 'tea', color: '#90EE90' },

    { icon: 'car', color: '#87CEFA' },
    { icon: 'gas-station', color: '#F0E68C' },
    { icon: 'bus', color: '#FFA07A' },
    { icon: 'train', color: '#98FB98' },
    { icon: 'airplane', color: '#ADD8E6' },
    { icon: 'taxi', color: '#FFFF99' },
    { icon: 'bicycle', color: '#90EE90' },
    { icon: 'parking', color: '#D8BFD8' },

    { icon: 'home', color: '#FFD54F' }, // Similar to home-city
    { icon: 'lightbulb', color: '#FFEB9C' },
    { icon: 'water', color: '#7FB3D3' },
    { icon: 'fire', color: '#F1948A' },
    { icon: 'power-plug', color: '#F7DC6F' },
    { icon: 'phone', color: '#AED6F1' },
    { icon: 'wifi', color: '#82E0AA' },
    { icon: 'fuel', color: '#FAD7A0' },

    { icon: 'medical-bag', color: '#FF6B6B' },
    { icon: 'pill', color: '#4ECDC4' },
    { icon: 'hospital', color: '#45B7D1' },
    { icon: 'tooth', color: '#96CEB4' },
    { icon: 'eye', color: '#FFEAA7' },
    { icon: 'stethoscope', color: '#DDA0DD' },

    { icon: 'music', color: '#A8E6CF' },
    { icon: 'gamepad-variant', color: '#FFB3BA' },
    { icon: 'television', color: '#BFBFFF' },
    { icon: 'camera', color: '#FFDFBA' },
    { icon: 'book-open', color: '#FFFFBA' },
    { icon: 'football', color: '#BAE1FF' },
    { icon: 'theater', color: '#F0B3FF' },

    { icon: 'school', color: '#C7CEEA' },
    { icon: 'book', color: '#FFEAA7' },
    { icon: 'printer', color: '#A8D5BA' },

    { icon: 'face-man', color: '#FFCCCB' },
    { icon: 'spa', color: '#E6E6FA' },
    { icon: 'glasses', color: '#B0E0E6' },
    { icon: 'watch', color: '#F0E68C' },
    { icon: 'tshirt-crew', color: '#FFB6C1' },

    { icon: 'heart-outline', color: '#F8BBD9' },
    { icon: 'gift-outline', color: '#F5B7B1' },
    { icon: 'bell', color: '#F7DC6F' },
    { icon: 'flag', color: '#AED6F1' },
    { icon: 'shield', color: '#A9DFBF' }
] as const;
