import useAppStore from "@/stores/useAppStore";
import CustomSnackbar from "../ui/CustomSnackbar";

export default function GlobalLevelComponents() {
    const globalSnackbar = useAppStore((state) => state.globalSnackbar);
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const onDismiss = () => {
        setGlobalSnackbar(null);
    }

    return (
        <>
            <CustomSnackbar
                visible={globalSnackbar !== null}
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