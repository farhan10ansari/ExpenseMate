import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";

export interface CustomSnackbarProps extends SnackbarProps {
    type?: "error" | "success" | "info" | "warning";
    usePortal?: boolean;
    position?: "top" | "bottom";
    offset?: number;
}

export default function CustomSnackbar(props: CustomSnackbarProps) {
    const {
        type = "info",
        usePortal = false,
        position,
        offset = 0,
        children,
        style,
        wrapperStyle,
        ...rest
    } = props;

    const { colors } = useAppTheme();

    const Component = () => {
        return (
            <Snackbar
                {...rest}
                style={[
                    type === "error" && { backgroundColor: colors.error },
                    type === "success" && { backgroundColor: colors.primary },
                    type === "info" && { backgroundColor: colors.primary },
                    type === "warning" && { backgroundColor: "orange" },
                    style
                ]}
                wrapperStyle={[
                    position === "top" && { top: offset },
                    position === "bottom" && { bottom: offset },
                    wrapperStyle
                ]}
            >
                {children}
            </Snackbar>
        )
    }

    return (
        usePortal ? (
            <Portal>
                <Component />
            </Portal>
        ) : (<Component />)
    )
}
