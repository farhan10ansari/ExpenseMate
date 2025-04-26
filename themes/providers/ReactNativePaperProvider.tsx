import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { colors } from '@/themes';


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
    },
};

export default function ReactNativePaperProvider({ children }: { children: React.ReactNode }) {
    return (
        <PaperProvider theme={theme}>
            {children}
        </PaperProvider>
    );
}