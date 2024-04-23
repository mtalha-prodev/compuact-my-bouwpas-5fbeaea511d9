import { library } from '@fortawesome/fontawesome-svg-core';
import { faAppStoreIos, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { LocalizationContext } from 'app/contexts';
import useCachedResources from 'app/hooks/useCachedResources/useCachedResources';
import { Router } from 'app/navigation/router';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { LogBox, View } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientProvider, setLogger } from 'react-query';
import * as Sentry from 'sentry-expo';
import registerNNPushToken from 'native-notify';

import Box from './components/app-box/app-box';
import {
  onAppStateChange,
  queryClient,
  useAppState,
  useLocalization,
  useOnlineManager,
} from './hooks';
import { ToastProvider } from './hooks/useToast/toastProvider';
import { useStore } from './store/main-store/main-store';

LogBox.ignoreLogs([
  'Setting a timer',
  'NativeBase',
  'zustand devtools',
  'Failed to load',
  'Unexpected HTTP code',
  'ViewPropTypes will be removed from React Native',
  'NativeBase: The contrast ratio',
  'NativeBase',
  'ViewPropTypes will be removed from React Native.',
]);

//@ts-ignore
library.add(fas, fal, fad, faAppStoreIos, faGooglePlay);

// Set React-Query loger for react native
setLogger({
  log: console.log,
  warn: console.log,
  error: console.log,
});

// Native base linear gradient config
const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

export default function App() {
  registerNNPushToken(20917, 'eTqhU69B2bNWs0ieehHGQM');
  // Global state
  const language = useStore.useLanguage();

  // Localization context to change language and use translation strings
  const localization = useLocalization();

  // Load cached resources on app starts (fonts, images etc.)
  const { isLoadingComplete } = useCachedResources();

  // Take last selected language value and use context function to change language
  const setDefaultLanguage = React.useCallback(() => {
    // Initially (first time app startup) language will be undefined
    // So if language is undefined, use the system language of the device
    // In case user decided to change language, then selected language will be persisted

    // Select for now only strict language so instead of en-GB just en
    if (!language) localization.setLocale(Localization.locale.slice(0, 2));
    else localization.setLocale(language);
  }, [language]);

  const onLayoutRootView = React.useCallback(async () => {
    if (isLoadingComplete) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  // This hook will refetch all queries when user came after background state
  useAppState({
    onChange: onAppStateChange,
  });

  // This hook will refetch queries after user reconnects to the internet
  useOnlineManager();

  // This is a hook for connection status and info
  const netInfo = useNetInfo();

  // Show a Flash Message for the connection status through the entire app
  React.useEffect(() => {
    // update connection status in sentry so we know the connection status at the time of an error/exception
    Sentry.Native.setExtras({ netInfo });
    if (netInfo.isConnected !== true && netInfo.isInternetReachable !== null) {
      showMessage({
        message: localization.t('noConnection'),
        type: 'warning',
        autoHide: true,
        floating: true,
        icon: { icon: 'auto', position: 'left', props: {} },
        position: { top: 0, left: 0, right: 0 },
        style: {
          backgroundColor: '#EC4E35',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: -1,
        },
      });
    }
  }, [netInfo]);

  React.useEffect(() => {
    setDefaultLanguage();
  }, [setDefaultLanguage]);

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <ToastProvider>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#475949' }}>
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Box width="auto" bg="white" flex={1} overflow="hidden">
                  <LocalizationContext.Provider value={localization}>
                    <FlashMessage />
                    <Router />
                  </LocalizationContext.Provider>
                </Box>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ToastProvider>
  );
}
