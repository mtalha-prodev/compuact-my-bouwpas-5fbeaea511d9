import NetInfo from '@react-native-community/netinfo';
import { env } from 'app/config/env';
import { api } from 'app/lib/api';
import { TSafesightContractors } from 'app/models';
import { useStore } from 'app/store/main-store/main-store';
import { delay, tcatch } from 'app/utils';
import { compareVersion } from 'app/utils/compareVersion';
import Constants from 'expo-constants';
import React from 'react';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';

type TAppStatus = 'highest' | 'moderate' | 'updated' | 'unknown' | null;
type TDataVersion = {
  safesightContractors: TSafesightContractors;
  current: string;
  minimum: string;
};

function localVersionNumber(): string {
  switch (Platform.OS) {
    case 'ios':
      return Constants.expoConfig?.version as string;
    case 'android':
      return Constants.expoConfig?.version as string;

    default:
      return Constants.expoConfig?.version as string;
  }
}

export const useAppVersionStatus = () => {
  const [appVersionStatus, setAppVersionStatus] = React.useState<TAppStatus>(null);

  React.useEffect(() => {
    async function checkAppVersion() {
      await NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          return {
            status: false,
          };
        }
      });
      await delay(1000);

      const timestamp = Math.round(new Date().getTime() / 1000);
      const versionCheckUri = env.APP_VERSION_CHECK + '?' + timestamp;
      const [data, error] = await tcatch(api.get(versionCheckUri));

      if (error) {
        setAppVersionStatus('unknown');
        useStore.setState({ safesightContractors: null });
        Sentry.Native.captureMessage('version check error');
        Sentry.Native.captureException(error);
        return;
      }

      const version = data as TDataVersion;
      // We get SafeSight project id's from the response for now
      // And then we save them to the Global Store so we can consume them later
      useStore.setState({ safesightContractors: version.safesightContractors });

      // dummy data
      /* const version = {
        minimum: '1.3.0',
        current: '2.2.0',
      }; */

      const localAppVersion = localVersionNumber();
      const apiMinAppVersion = version.minimum;
      const apiCurrentAppVersion = version.current;

      const highestUpdate = compareVersion(localAppVersion, apiMinAppVersion) === -1;
      const moderateUpdate = compareVersion(localAppVersion, apiCurrentAppVersion) === -1;

      const updated =
        compareVersion(localAppVersion, apiCurrentAppVersion) === 0 ||
        compareVersion(localAppVersion, apiCurrentAppVersion) === 1;

      // If current version of the app is too low and needs to be updated
      // Otherwise do not let user use the app
      if (highestUpdate) {
        setAppVersionStatus('highest');
        return;
      }

      // If there is a new version of the app in store
      // Popup a modal with ask to update
      if (moderateUpdate) {
        setAppVersionStatus('moderate');
        return;
      }

      // If current version of the app is up to date
      if (updated) {
        setAppVersionStatus('updated');
      }
    }

    checkAppVersion();
  }, []);

  return { appVersionStatus };
};
