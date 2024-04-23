import { TQrContent } from 'app/Types';
import { env } from 'app/config/env';
import { TxKeyPath } from 'app/i18n';
import { mainStore } from 'app/store/main-store/main-store';
import { delay, tcatch } from 'app/utils';
import { createURL, parse } from 'expo-linking';
import {
  openAuthSessionAsync,
  openBrowserAsync,
  WebBrowserAuthSessionResult,
} from 'expo-web-browser';
import jwt_decode from 'jwt-decode';
import { Alert } from 'react-native';

export interface IQrRegisterProps {
  qrContent: TQrContent;
  authAsync: (formDataCode: string) => Promise<void>;
}

// We need a delay betwen openAuthSessionAsync()
// Otherwise we can get error like
// you can't open 2 browsers at the same time
// So wee need to open one then wait until it closes and then open new one
const DELAY_BETWEEN_BROWSERS = 600;

export async function qrRegister({ qrContent, authAsync }: IQrRegisterProps): Promise<void> {
  mainStore.setState(prev => ({ bootstrapState: { ...prev, isLoading: true } }));

  delay(DELAY_BETWEEN_BROWSERS);

  // Let's create a redirect url
  let redirectUrl = createURL('/');
  if (redirectUrl.includes('bouwpas:///')) redirectUrl = 'bouwpas://--/';

  // Lets check which registration type we have after having QR data
  // It can be uuid activation
  // Or JWT activation
  let registrationLink: any;

  // If actiovation type is JWT
  if (qrContent.queryParams.jwt) {
    registrationLink = `${env.QR_JWT_REGISTRATION}?jwt=${qrContent.queryParams.jwt}&redirect_uri=${env.AUTHORIZE_KEY_URL}${redirectUrl}`;
  }
  // If actiovation type is UUID
  if (!qrContent.queryParams.jwt) {
    registrationLink = `${env.QR_UUID_REGISTRATION}?uuid=${qrContent.hostname}&redirect_uri=${env.AUTHORIZE_KEY_URL}${redirectUrl}`;
  }

  await delay(DELAY_BETWEEN_BROWSERS);

  // Let's open first browser session to get type === 'success'
  const [registerData] = await tcatch<WebBrowserAuthSessionResult>(
    openAuthSessionAsync(registrationLink, redirectUrl),
  );

  // Browser was closed or something else
  if (registerData?.type !== 'success') {
    mainStore.setState(prev => ({ bootstrapState: { ...prev, isLoading: false } }));
    return;
  }

  // Let's wait a bit to be sure first browser session was closed
  await delay(DELAY_BETWEEN_BROWSERS);

  // Let's open second browser session to get code for formd data to get token further
  const [authorizeData] = await tcatch<WebBrowserAuthSessionResult>(
    openAuthSessionAsync(`${env.AUTHORIZE_KEY_URL}${redirectUrl}`, redirectUrl),
  );

  // Let's wait a bit to be sure second browser session was closed
  await delay(DELAY_BETWEEN_BROWSERS);

  // If we have type === 'success' from ID provider
  // Let's parse response from it and then extract the 'code' value
  // And then pass it to another service function to get token and authorize user
  if (authorizeData?.type === 'success') {
    const parsedAuthorizeData = parse(authorizeData.url);
    const code = parsedAuthorizeData.queryParams.code;

    const [, authError] = await tcatch(authAsync(code));

    if (!authError) {
      // If this function will be called from wizard screen
      // After succesable getting the token, make wizard complete
      // Otherwise don't do anything
      const wizardState = mainStore.getState().wizard;
      if (!wizardState) mainStore.setState(() => ({ wizard: true }));
    }
  } else {
    mainStore.setState(prev => ({ bootstrapState: { ...prev, isLoading: false } }));
  }
}

export const onQrRegister = async (
  qrData: TQrContent,
  openQrScreen: () => void,
  t: (key: TxKeyPath, options?: I18n.TranslateOptions | undefined) => string,
  authAsync: (formDataCode?: string | undefined) => Promise<void>,
) => {
  const openCreateAccountHelper = async () => {
    await tcatch(openBrowserAsync(env.MBA_CREATE_ACCOUNT));
  };

  if (qrData) {
    if (!qrData.queryParams) {
      // if it's a check-in/out qr code, tell the user that
      if ('project' in qrData && 'type' in qrData) {
        Alert.alert(
          t('wrongQrCode'),
          t('activateAppFirst'),
          [{ text: 'OK', onPress: () => openCreateAccountHelper() }],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          t('wrongQrCode'),
          t('tryAgain'),
          [{ text: 'OK', onPress: () => openQrScreen() }],
          { cancelable: false },
        );
      }
      return;
    }

    // Let's check UUID because probably JWT is not existing
    if (!qrData.queryParams.jwt) {
      await delay(200);
      const isQrUuidValid = qrData.scheme === 'bouwpas' && qrData.hostname.length === 36;
      if (!isQrUuidValid) {
        Alert.alert(
          t('wrongQrCode'),
          t('tryAgain'),
          [{ text: 'OK', onPress: () => openQrScreen() }],
          { cancelable: false },
        );
        return;
      }
    }

    // Let's check if JWT is existing one
    if (qrData.queryParams.jwt) {
      await delay(200);
      const decoded = jwt_decode<{ exp: string; i: number; jti: string }>(qrData.queryParams.jwt);
      // JWT is not correct
      if (decoded.i <= 0) {
        // JWT registration QR is wrong ask to scan QR again
        Alert.alert(
          t('wrongQrCode'),
          t('tryAgain'),
          [{ text: 'OK', onPress: () => openQrScreen() }],
          { cancelable: false },
        );
        return;
      }
    }
    qrRegister({ qrContent: qrData, authAsync });
  }
};
