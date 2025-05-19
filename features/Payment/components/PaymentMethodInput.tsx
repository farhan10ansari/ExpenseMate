import { paymentMethods } from "@/lib/constants";
import { PaymentMethod } from "@/lib/types";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";


type PaymentMethodInputProps = {
    paymentMethod: string | undefined;
    setPaymentMethod: (method: PaymentMethod["name"] | undefined) => void;
}

export default function PaymentMethodInput({ paymentMethod, setPaymentMethod }: PaymentMethodInputProps) {
    const { colors } = useAppTheme()
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 10,
            paddingVertical: 10,
            paddingHorizontal: 5,
        },
        buttonStyle: {
            borderRadius: 20,
            backgroundColor: colors.onTertiary,
            paddingHorizontal: 5
        },
        buttonLabelStyle: {
            marginVertical: 8,
            marginHorizontal: 10,
            color: colors.tertiary
        },
        selectedButton: {
            backgroundColor: colors.tertiary,
        },
        selectedButtonLabel: {
            color: colors.onTertiary
        }
    });


    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                {paymentMethods.map((method) => (
                    <Button
                        compact
                        key={method.name}
                        mode={paymentMethod === method.name ? "contained" : "elevated"}
                        icon={method.icon}
                        style={[
                            styles.buttonStyle,
                            paymentMethod === method.name && styles.selectedButton
                        ]}
                        labelStyle={[
                            styles.buttonLabelStyle,
                            paymentMethod === method.name && styles.selectedButtonLabel
                        ]}
                        onPress={() => setPaymentMethod(method.name)}
                    >
                        {method.label}
                    </Button>
                ))}
            </View>
        </ScrollView>
    );
}