import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { delay, loadAsyncParsed, tcatch } from 'app/utils';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const storageV1migration = useStore.useStorageV1migration();

  async function storageMigrations() {
    // Migration from V1 of the app to V2
    if (!storageV1migration) {
      // Let's check our old current app language
      const [currentLang] = await tcatch<UserStateSlaceTypes['language'], null>(
        loadAsyncParsed('currentLang'),
      );
      // Let's check our old token, in V1 it has a key as lastAuth. So it's the same with V2 token
      const [lastAuth] = await tcatch<UserStateSlaceTypes['token'], null>(
        loadAsyncParsed('lastAuth'),
      );
      // Let's check our old wizard state value
      const [wizardKey] = await tcatch<boolean, null>(loadAsyncParsed('wizardKey'));

      // Let's move old values to the new storage

      if (currentLang) useStore.setState({ language: currentLang });
      if (lastAuth) useStore.setState({ token: lastAuth });
      if (wizardKey !== null) useStore.setState({ wizard: false });

      // Let's wait a little bit to let setState to finish
      await delay(500);

      // Let's remove old value and keys from the user's device
      await AsyncStorage.multiRemove(['currentLang', 'lastAuth', 'wizardKey']);

      // Make migration complete
      useStore.setState({ storageV1migration: true });
    }
  }

  async function loadResourcesAndDataAsync() {
    try {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();

      await Font.loadAsync({
        ...FontAwesome.font,
        bilo: require('../../assets/fonts/bp/Bilo.ttf'),
        interstate: require('../../assets/fonts/bp/Interstate.ttf'),
        'source-sans-pro-light': require('../../assets/fonts/bp/SourceSansPro-Light.ttf'),
        'source-sans-pro-light-italic': require('../../assets/fonts/bp/SourceSansPro-LightItalic.ttf'),
        'source-sans-pro-regular': require('../../assets/fonts/bp/SourceSansPro-Regular.ttf'),
        'source-sans-pro-semibold': require('../../assets/fonts/bp/SourceSansPro-Semibold.ttf'),
      });
      await storageMigrations();
    } catch (e) {
      // We might want to provide this error information to an error reporting service
      throw e;
    } finally {
      setLoadingComplete(true);
    }
  }

  function onFinishLoad() {
    setLoadingComplete(true);
  }

  function onError() {
    setLoadingComplete(true);
  }

  // eslint-disable-next-line no-unused-expressions
  React.useEffect(() => {
    loadResourcesAndDataAsync();
    // eslint-disable-next-line no-sequences
  }),
    [];

  return {
    isLoadingComplete,
    setLoadingComplete,
    loadResourcesAndDataAsync,
    onFinishLoad,
    onError,
  };
}
