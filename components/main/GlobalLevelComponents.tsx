import useAppStore from "@/stores/useAppStore";
import CustomSnackbar from "../ui/CustomSnackbar";

export default function GlobalLevelComponents() {
    const globalSnackbar = useAppStore((state) => state.globalSnackbar);
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);
    const currentScreen = useAppStore((state) => state.currentScreen);

    const onDismiss = () => {
        setGlobalSnackbar(null);
    }
    if (!currentScreen) return null;

    const showSnackbar = (globalSnackbar !== null) && (globalSnackbar.screens ? globalSnackbar.screens.includes(currentScreen) : true);
    return (
        <>
            <CustomSnackbar
                visible={showSnackbar}
                onDismiss={onDismiss}
                duration={globalSnackbar?.duration}
                action={{
                    label: globalSnackbar?.actionLabel || "",
                    icon: globalSnackbar?.actionIcon,
                }}
                type={globalSnackbar?.type}
                position={globalSnackbar?.position}
                offset={globalSnackbar?.offset}
            >
                {globalSnackbar?.message}
            </CustomSnackbar>
        </>
    )
}