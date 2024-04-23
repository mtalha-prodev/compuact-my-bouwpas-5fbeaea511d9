import { env } from 'app/config/env';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { delay, tcatch } from 'app/utils';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync, WebBrowserAuthSessionResult } from 'expo-web-browser';
import React from 'react';
import * as Sentry from 'sentry-expo';

import { useApiCall } from '../useApiCall';
import { useApiMutation } from '../useApiMutation';

export const useAuth = () => {
  const [shouldGetAccountTypes, setShouldGetAccountTypes] = React.useState(false);
  const currentUserType = useStore.useCurrentUserType();
  const {
    mutateAsync: getTokenAsync,
    isLoading: isTokenLoading,
    isError: isTokenError,
    error: tokenError,
  } = useApiMutation();

  const { isLoading: isAccountTypesLoading, error: accountTypesError } = useApiCall<
    UserStateSlaceTypes['userTypes']
  >({
    link: env.ACCOUNT_TYPES,
    queryParams: {
      enabled: shouldGetAccountTypes,
      onSuccess: data => {
        if (data) {
          if (!('user' in data)) {
            Sentry.Native.captureMessage('user object from account types is not defined');
            Sentry.Native.captureMessage(JSON.stringify(data));

            return 'worker';
          }

          const types = data.user.map(user => user.type);

          const workerUser = types.includes('workeruser');
          const accountUser = types.includes('accountuser');
          const companyUser = types.includes('companyuser');

          const onlyWorker = workerUser && !accountUser && !companyUser;
          const onlyGatekeeper = !workerUser && accountUser && !companyUser;
          const onlyCompanyUser = !workerUser && !accountUser && companyUser;
          const workerAndGatekeeper = workerUser && accountUser && !companyUser;
          const gateKeeperAndCompanyUser = !workerUser && accountUser && companyUser;
          // User can be just worker or just gatekeeper
          // To prevent errors on first login define user type
          // And store it
          // eslint-disable-next-line no-inner-declarations
          function currentUser(): UserStateSlaceTypes['currentUserType'] {
            // set username for Sentry debugging
            const userTypes = data?.user.map(user => user.type);
            const userIds = data?.user.map(user => user.accountId);
            const filteredUserObject: {
              type: 'workeruser' | 'accountuser' | 'companyuser';
              id: number;
            }[] = [];
            data?.user.forEach(user => {
              const userToAdd = { type: user.type, id: user.accountId };
              filteredUserObject.push(userToAdd);
            });
            // filter username from this object to minimize personal information
            if (userIds && userTypes) {
              Sentry.Native.setUser({
                username: JSON.stringify(filteredUserObject) ?? undefined,
              });
            }
            let userType: UserStateSlaceTypes['currentUserType'];
            if (onlyWorker) return (userType = 'worker');
            if (onlyGatekeeper) return (userType = 'gatekeeper');
            if (onlyCompanyUser) return (userType = 'companyuser');
            if (gateKeeperAndCompanyUser) return (userType = 'gatekeeper');
            if (workerAndGatekeeper) {
              if (currentUserType === 'gatekeeper') return 'gatekeeper';
              if (currentUserType === 'worker') return 'worker';
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              return (userType = 'worker');
            }
            return 'worker';
          }
          // If everything was fetched and no errors
          // Save everything in store and let user use the app
          useStore.setState(prev => ({
            userTypes: data,
            currentUserType: currentUser(),
            bootstrapState: {
              ...prev.bootstrapState,
              isLoading: false,
              isSignedIn: true,
            },
          }));
        }
      },
      onError: error => {
        useStore.setState(prev => ({
          bootstrapState: {
            ...prev.bootstrapState,
            isLoading: false,
            isError: error,
          },
        }));
      },
    },
  });

  const authAsync = async (formDataCode?: string) => {
    useStore.setState(prev => ({ bootstrapState: { ...prev.bootstrapState, isLoading: true } }));

    // Create a redirect url
    let redirectUrl = Linking.createURL('/');
    let redirectLink;

    if (redirectUrl.includes('bouwpas:///')) redirectUrl = 'bouwpas://--/';

    // If we already have CODE for formData let's skip openAuthSessionAsync()
    if (!formDataCode) {
      // Open browser auth session with ID provider
      const authSessionPromise = openAuthSessionAsync(
        `${env.AUTHORIZE_KEY_URL}${redirectUrl}`,
        redirectUrl,
      );

      await delay(500);

      const [authSessionData] = await tcatch<WebBrowserAuthSessionResult>(authSessionPromise);

      await delay(500);

      // If browser response is success
      // Parse url from ID provider

      if (authSessionData && authSessionData.type === 'success') {
        redirectLink = Linking.parse(authSessionData.url);
      } else {
        useStore.setState(prev => ({
          bootstrapState: { ...prev.bootstrapState, isLoading: false },
        }));
        return;
      }
    }

    // Create form data for ID provider /token
    const formdata = new FormData();
    formdata.append('grant_type', 'authorization_code');
    formdata.append('client_id', env.CLIENT_ID);
    formdata.append('client_secret', env.CLIENT_SECRET);
    formdata.append('code', formDataCode ? formDataCode : redirectLink?.queryParams.code);
    formdata.append('redirect_uri', redirectUrl);

    // Make a call to the /token endpoint
    // to ask a new jwt
    await getTokenAsync(
      {
        key: env.TOKEN_URL,
        method: 'post',
        apiData: formdata,
      },
      {
        onSuccess: data => {
          const token = data as unknown as UserStateSlaceTypes['token'];
          useStore.setState({ token });
          setShouldGetAccountTypes(true);
        },
        onError: error => {
          useStore.setState(prev => ({
            bootstrapState: { ...prev.bootstrapState, isLoading: false, isError: error },
          }));
        },
      },
    );
  };

  return {
    authAsync,
    isTokenLoading,
    isTokenError,
    tokenError,
    accountTypesError,
    isAccountTypesLoading,
  };
};
