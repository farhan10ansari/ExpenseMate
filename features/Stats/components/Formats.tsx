import AnimatedNumber from "@/components/main/AnimatedNumber";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { FontAwesome } from "@expo/vector-icons";


type Props = {
    amount: number
}

const FormatCurrency = ({ amount }: Props) => {
    const { colors } = useAppTheme();

    return (
        <>
            <FontAwesome name="rupee" size={18} color={colors.text} />
            <AnimatedNumber
                fontStyle={{
                    fontSize: 20,
                    lineHeight: 26,
                    color: colors.text,
                    fontWeight: 'bold'
                }}
                containerStyle={{
                    paddingVertical: 4,
                    paddingHorizontal: 2,
                }}
                value={amount}
            />
        </>
    )
}

const FormatCurrencyPrimary = ({ amount }: Props) => {
    const { colors } = useAppTheme();
    return (
        <>
            <FontAwesome name="rupee" size={18} color={colors.onPrimary} />
            <AnimatedNumber
                fontStyle={{
                    fontSize: 20,
                    lineHeight: 26,
                    color: colors.onPrimary,
                    fontWeight: 'bold'
                }}
                containerStyle={{
                    paddingVertical: 4,
                    paddingHorizontal: 2,
                }}
                value={amount}
            />
        </>
    )
}

export {
    FormatCurrency,
    FormatCurrencyPrimary
}