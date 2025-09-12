import usePersistentAppStore from '@/stores/usePersistentAppStore';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getEnrolledLevelAsync, SecurityLevel, authenticateAsync } from 'expo-local-authentication';
import { AppState, BackHandler, ToastAndroid } from 'react-native';
import AuthOverlay from '@/components/main/AuthOverlay';
import { useSnackbar } from './GlobalSnackbarProvider';

interface LocalAuthContextType {
  biometricLogin: boolean;
  isAuthenticated: boolean;
  isAuthenticationSupported: boolean;
  handleBiometricLoginToggle: (enabled: boolean) => Promise<void>;
  refresh: () => void;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

const isSupportedAuthType = (level: SecurityLevel | undefined) => {
  if (!level) return false;
  return [SecurityLevel.BIOMETRIC_STRONG, SecurityLevel.BIOMETRIC_WEAK, SecurityLevel.SECRET].includes(level);
}

const lockAfterMs = 5 * 60 * 1000; // 5 minutes

export const LocalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const biometricLogin = usePersistentAppStore(state => state.settings.biometricLogin);
  const updateSettings = usePersistentAppStore(state => state.updateSettings);
  const [isAuthenticated, setIsAuthenticated] = useState(biometricLogin ? false : true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { showSnackbar } = useSnackbar()

  const appState = useRef(AppState.currentState);
  const lastBackgroundAtRef = useRef<number | null>(null);
  const tempAuthRef = useRef(false);

  const {
    data: securityLevel,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['security', 'supportedAuthTypes'],
    queryFn: async () => {
      const types = await getEnrolledLevelAsync();
      return types;
    },
    retry: 2,
  });

  const handleShowSnackbar = useCallback((message: string, type: 'error' | 'success' | 'info') => {
    showSnackbar({
      message,
      duration: 2000,
      type: type,
      position: 'bottom',
    });
  }, [showSnackbar]);


  const handleAuthentication = useCallback(async () => {
    try {
      tempAuthRef.current = true;
      setIsAuthenticating(true);
      const authResult = await authenticateAsync({
        promptMessage: 'Authenticate to access your expense manager',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });
      if (authResult.success) {
        setIsAuthenticated(true);
      } else {
        // Handle authentication failure
        if (authResult.error === 'user_cancel' || authResult.error === 'app_cancel') {
          // BackHandler.exitApp();
          // User cancelled, try again
          // setTimeout(() => handleAuthentication(), 500);
        } else if (authResult.error === 'lockout') {
          ToastAndroid.show(
            'Too Many Attempts: Biometric authentication locked. Try again later.',
            ToastAndroid.LONG
          );
          BackHandler.exitApp();
        } else {
          // Other errors, show message and retry
          ToastAndroid.show(
            'Authentication Failed: Please try again',
            ToastAndroid.SHORT
          );
          BackHandler.exitApp();
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      ToastAndroid.show(
        'Authentication Error: Unable to authenticate. Closing app.',
        ToastAndroid.SHORT
      );
      BackHandler.exitApp();
    } finally {
      setIsAuthenticating(false);
      // Give AppState a moment to settle after biometric overlay closes
      setTimeout(() => { tempAuthRef.current = false; }, 1000);
    }
  }, []);

  const handleBiometricLoginToggle = useCallback(async (enabled: boolean) => {
    if (enabled) {
      try {
        const authResult = await authenticateAsync({
          promptMessage: 'Authenticate to enable Secure login',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Passcode',
          disableDeviceFallback: false,
        });

        if (authResult.success) {
          updateSettings('biometricLogin', true);
          handleShowSnackbar('Secure login enabled', 'success');
        } else {
          refetch()
          handleShowSnackbar('Failed to enable secure login. Try again.', 'error');
        }
      } catch (error) {
        refetch()
        console.error('Error enabling secure login:', error);
        handleShowSnackbar('Failed to enable secure login. Try again.', 'error');
      }
    } else {
      // Disable secure login
      updateSettings('biometricLogin', false);
      handleShowSnackbar('Secure login disabled', 'info');
    }
  }, [updateSettings, refetch, handleShowSnackbar]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appState.current;
      appState.current = next;

      // When moving to background, record time unless we are showing biometric sheet
      if (next === 'background' && !tempAuthRef.current) {
        lastBackgroundAtRef.current = Date.now();
      }

      // When coming back to active from background, decide re-lock
      if (next === 'active' && prev === 'background') {
        // Refetch security level on app focus to ensure up-to-date status
        refetch();

        const last = lastBackgroundAtRef.current ?? 0;
        const elapsed = Date.now() - last;
        const shouldLockApp = elapsed >= lockAfterMs;
        if (biometricLogin && shouldLockApp) {
          // Time exceeded, re-lock
          setIsAuthenticated(false);
        }
      }
    });

    return () => sub.remove();
  }, [biometricLogin, refetch]);



  useEffect(() => {
    if (isAuthenticated) return;
    if (!biometricLogin) {
      setIsAuthenticated(true);
      return;
    }
    if (isLoading) return;
    if (isError) return;
    if (securityLevel === undefined) return;
    if (securityLevel === SecurityLevel.NONE) {
      setIsAuthenticated(true)
      ToastAndroid.show(
        'Device security removed. Disabling biometric login.',
        ToastAndroid.LONG
      );
      updateSettings('biometricLogin', false);
    } else if (isSupportedAuthType(securityLevel)) {
      handleAuthentication();
    }
  }, [isAuthenticated, securityLevel, isLoading, isError, error, biometricLogin, handleAuthentication, updateSettings]);

  const authContextValue: LocalAuthContextType = useMemo(() => ({
    biometricLogin,
    isAuthenticated,
    isAuthenticationSupported: isSupportedAuthType(securityLevel),
    handleBiometricLoginToggle,
    refresh: refetch,
  }), [biometricLogin, isAuthenticated, securityLevel, handleBiometricLoginToggle, refetch]);

  return (
    <LocalAuthContext.Provider value={authContextValue}>
      {children}
      {!isAuthenticated && (
        <AuthOverlay
          isAuthenticating={isAuthenticating}
          onAuthenticate={handleAuthentication}
        />
      )}
    </LocalAuthContext.Provider>
  );
};



// useAuth hook
export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
