import { mainStore } from 'app/store/main-store/main-store';
import React from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from 'react-query';

interface IUseAppState {
  onChange?: (state: any) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

export const useAppState = (settings: IUseAppState) => {
  const { onChange, onForeground, onBackground } = settings || {};

  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState<AppStateStatus>(appState.current);

  const appStateHandler = React.useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && appState.current !== 'active') {
      if (onForeground) {
        onForeground();
      }
    } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      if (onBackground) {
        onBackground();
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    if (onChange) {
      onChange(nextAppState);
    }
  }, []);

  React.useEffect(() => {
    if (!__DEV__) {
      const subscription = AppState.addEventListener('change', appStateHandler);
      // This subscribtion causes remove() is undefined error, commet for later fixes
      return () => {
        subscription.remove();
      };
    }
  }, []);
  return { appStateVisible };
};

export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    // Each time the app goes to background/inactive state
    // Let's save a timestamp for future to compare with curent timestamp
    if (status === 'background' || status === 'inactive') {
      mainStore.setState({ lastAppBgTimestamp: `${new Date()}` });
    }

    // If app came back to active state and difference between timestamps
    // is more then 1 minute, refetch queries
    if (status === 'active') {
      const lastAppBgTimestamp = mainStore.getState().lastAppBgTimestamp;
      const t1 = new Date(lastAppBgTimestamp);
      const t2 = new Date();
      const dif = Math.round((t2.getTime() - t1.getTime()) / 1000);

      if (dif > 60) {
        focusManager.setFocused(true);
      }
    }
  }
}
