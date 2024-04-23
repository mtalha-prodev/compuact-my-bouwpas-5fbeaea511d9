import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import { createNavigationContainerRef } from '@react-navigation/native';
import { mainStore } from 'app/store/main-store/main-store';
import { useCallback, useRef } from 'react';

const navigationRef = createNavigationContainerRef();

type Callback = (currentRouteName: string) => Promise<void> | undefined;

type IScreenProps = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  onReady: () => void;
  onStateChange: () => Promise<void>;
};

/* FIXME: currentScreenFoo causing slow navigation between screens, especialy tabs */
/* Fix later when we really need to track/handle current screens */
const currentScreenFoo: Callback = async currentRouteName => {
  // Save current screen to the global store
  //mainStore.setState(() => ({currentRoute: currentRouteName}));
};

export const useNavigationScreen = (callback = currentScreenFoo): IScreenProps => {
  const routeNameRef = useRef<string>();

  const onReady = useCallback(() => {
    routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
    mainStore.setState({ currentRoute: navigationRef?.getCurrentRoute()?.name });
  }, []);

  const onStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      if (currentRouteName) {
        await callback(currentRouteName);
      }
    }

    routeNameRef.current = currentRouteName;
  }, [callback]);

  return { navigationRef, onReady, onStateChange };
};
