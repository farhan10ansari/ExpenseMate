import { CurrencyCode, CurrencyData, getCurrencyData, getCurrencyLocale, LocaleValue } from '@/lib/currencies';
import usePersistentAppStore from '@/stores/usePersistentAppStore';
import React, { createContext, useContext, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { getLocales } from 'expo-localization';
type CurrencyContextType = {
    currencyCode: CurrencyCode;
    currencyLocale: LocaleValue;
    currencyData: CurrencyData;
    updateCurrency: (newCurrency: CurrencyCode) => void;
    updateCurrencyLocale: (newLocale: LocaleValue) => void;
    formatCurrency: (amount: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// CurrencyProvider component to wrap the app and provide currency context
export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const currencyCode = usePersistentAppStore(state => state.settings.currencyCode);
    const currencyLocale = usePersistentAppStore(state => state.settings.currencyLocale);
    const updateSettings = usePersistentAppStore(state => state.updateSettings);

    const updateCurrency = useCallback((newCurrency: CurrencyCode) => {
        const newCurrencyLocale = getCurrencyLocale(newCurrency);
        updateSettings('currencyCode', newCurrency);
        updateSettings('currencyLocale', newCurrencyLocale);
    }, [updateSettings]);


    const updateCurrencyLocale = useCallback((newLocale: LocaleValue) => {
        updateSettings('currencyLocale', newLocale);
    }, [updateSettings]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat(currencyLocale, { style: 'currency', currency: currencyCode }).format(amount);
    }, [currencyLocale, currencyCode]);

    const currencyData = useMemo(() => (getCurrencyData(currencyCode)), [currencyCode])
    // const currencyInfo = useMemo(() => (getCurrencyInfo(currency)), [currency])

    useEffect(() => {
        // Ensure that currencyCode and currencyLocale are always set
        // This should not be needed as we set defaults in the store, but just in case
        if (!currencyCode || !currencyLocale) {
            const locale = getLocales()[0]
            if (!currencyCode) {
                updateSettings('currencyCode', locale?.currencyCode as CurrencyCode ?? "INR");
            }
            if (!currencyLocale) {
                updateSettings('currencyLocale', locale?.languageTag as LocaleValue ?? "en-IN");
            }
        }
    }, [currencyCode, currencyLocale, updateSettings])

    const contextValue = useMemo(() => ({
        currencyCode,
        currencyLocale,
        currencyData,
        updateCurrency,
        updateCurrencyLocale,
        formatCurrency
    }), [currencyCode, currencyLocale, currencyData, updateCurrency, updateCurrencyLocale, formatCurrency]);

    return (
        <CurrencyContext.Provider value={contextValue}>
            {children}
        </CurrencyContext.Provider>
    );
};


export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};