import { mainStore } from 'app/store/main-store/main-store';
import { AxiosRequestConfig } from 'axios';

export const interceptorRequest = async (inputConfig: AxiosRequestConfig) => {
  const config = inputConfig;
  // Check for and add the stored Auth Token to the header request
  try {
    /// Retrieve last token
    const token = mainStore.getState().token;
    const userType = mainStore.getState().currentUserType;
    const worker = userType === 'worker';
    const gatekeeper = userType === 'gatekeeper';
    const companyuser = userType === 'companyuser';

    if (token) {
      if (worker) config.headers['X-JWT-TOKEN'] = token.access_token;
      if (gatekeeper) config.headers['X-JWT-ACCOUNT-TOKEN'] = token.access_token;
      if (companyuser) config.headers['X-JWT-ACCOUNT-TOKEN'] = token.access_token;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /* Nothing */
  }

  return config;
};
