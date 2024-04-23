import { env } from 'app/config/env';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { delay, tcatch } from 'app/utils';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../../lib/api';

// @params formDataCode
// Is an optional parametr to be able to use this function somewhere else
// For example QR registration

export async function authAsync(formDataCode?: string): Promise<void> {
  // Set loading state
  useStore.setState(prev => ({ bootstrapState: { ...prev.bootstrapState, isLoading: true } }));

  // Create a redirect url
  let redirectUrl = Linking.createURL('/');
  let redirectLink;

  if (redirectUrl.includes('bouwpas:///')) redirectUrl = 'bouwpas://--/';

  // If we already have CODE for formData let's skip openAuthSessionAsync()
  if (!formDataCode) {
    // Open browser auth session with ID provider
    const authSessionPromise = WebBrowser.openAuthSessionAsync(
      `${env.AUTHORIZE_KEY_URL}${redirectUrl}`,
      redirectUrl,
    );

    await delay(500);

    const [authSessionData] =
      await tcatch<WebBrowser.WebBrowserAuthSessionResult>(authSessionPromise);

    await delay(500);

    // If browser response is success
    // Parse url from ID provider
    if (authSessionData && authSessionData.type === 'success') {
      redirectLink = Linking.parse(authSessionData.url);
    } else {
      useStore.setState(prev => ({ bootstrapState: { ...prev.bootstrapState, isLoading: false } }));
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

  // Make a call to the /roken endpoint
  // to ask a new jwt
  const tokenPromise = api.post(env.TOKEN_URL, formdata);

  const [tokenData, tokenError] = await tcatch<UserStateSlaceTypes['token'], any>(tokenPromise);

  // If response is ok, and jwt exist save to the store
  if (tokenData) {
    useStore.setState(() => ({
      token: tokenData,
    }));
  }

  // If response from /token is not ok, save error and stop function and throw error
  if (tokenError) {
    useStore.setState(prev => ({
      bootstrapState: {
        ...prev.bootstrapState,
        isLoading: false,
        isError: tokenError,
      },
    }));
  }
}
