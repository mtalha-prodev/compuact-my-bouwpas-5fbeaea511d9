import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useNavigationScreen } from 'app/hooks';
import { useStore } from 'app/store/main-store/main-store';
import { delay } from 'app/utils';
import * as Linking from 'expo-linking';
import React from 'react';

import { linkingConfiguration } from './linking-configuration';
import { RouterNavigator } from './navigators';

const navigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // prevent layout blinking when performing navigation
    background: 'transparent',
  },
};

export function Router() {
  const { navigationRef, onReady, onStateChange } = useNavigationScreen();

  const isSignedIn = useStore.useBootstrapState().isSignedIn;

  const [deepLinkData, setDeeplinkData] = React.useState<Linking.ParsedURL | null>(null);

  const handleDeepLink = (event: any) => {
    const data = Linking.parse(event.url);
    setDeeplinkData(data);
  };

  React.useEffect(() => {
    const getInitialUrl = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL && isSignedIn) {
        const workerDeeplink = initialURL.match('worker');
        if (workerDeeplink) {
          setDeeplinkData(Linking.parse(initialURL));
          await delay(2000);
          await Linking.openURL(initialURL);
        }
      }
    };

    const deepLinkListener = Linking.addEventListener('url', handleDeepLink);
    if (!deepLinkData) {
      getInitialUrl();
    }
    return () => {
      deepLinkListener.remove();
    };
  }, [deepLinkData, isSignedIn]);

  return (
    <NavigationContainer
      theme={navigatorTheme}
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
      linking={linkingConfiguration}
    >
      <RouterNavigator />
    </NavigationContainer>
  );
}
