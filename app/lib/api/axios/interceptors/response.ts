import { env } from 'app/config/env';
import { TApiError } from 'app/lib/api/types/axios.types';
import { authAsync } from 'app/services/auth-async/auth-async';
import { mainStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { delay, tcatch } from 'app/utils';
import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export const interceptorResponse = (response: AxiosResponse<any>) => {
  // Status code isn't a success code - throw error
  if (!`${response.status}`.startsWith('2')) {
    throw response.data;
  }
  // Otherwise just return the data
  const dataToReturn = response.data['hydra:member']
    ? response.data['hydra:member']
    : response.data;
  return dataToReturn;
};

export const interceptorResponseError = async (error: any) => {
  // Pass the response from the API, rather than a status code
  const { response } = error;

  // Network error
  if (!response) {
    const networkError = {
      errorData: 'Network error',
      errorStatus: 11245,
      errorUrl: 'Network error',
    } as TApiError;
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw networkError;
  }

  const originalRequest = error.config;
  const errorStatusCondition = error.response.status === 403;
  const unauthorizedCondition = error.response.status === 401;
  const errorRetryCondition = !originalRequest._retry;
  const errorDescription = error.response.data['hydra:description'];

  const objectError = {
    errorData: error.response.data,
    errorStatus: error.response.status,
    errorUrl: error.response.config.url,
  } as TApiError;

  // Token and refresh token where expired
  if (unauthorizedCondition) {
    //We get a 401 for every rejected refresh token,
    //Compare the state token with the one in the request that gave us a 401
    let givenRefreshToken = mainStore.getState().token?.refresh_token;
    const requestRefreshToken = error.config.data?._parts?.refresh_token;

    //If the tokens do not match, we ignore this one, the state should now have a valid token already
    if (givenRefreshToken !== requestRefreshToken) {
      return;
    }
    //Else we wait for 10 seconds, keep checking if we have already received a valid token,
    //if not clear everything in the state and start over again.
    for (let i = 0; i < 10000; i += 500) {
      if (givenRefreshToken !== requestRefreshToken) {
        return;
      }
      await delay(500);
      givenRefreshToken = mainStore.getState().token?.refresh_token;
    }

    mainStore.setState(() => ({
      token: null,
      bootstrapState: {
        isError: null,
        isLoading: false,
        isSignedIn: false,
      },
    }));

    await authAsync();
    return;
  }

  // POST data errors after fail request
  // await axios.post(env.ERROR_LOGS, objectError);

  // Statement and function inside of it, is for check and refresh token if this was expired
  if (
    !unauthorizedCondition &&
    errorStatusCondition &&
    errorRetryCondition &&
    errorDescription === 'expired token'
  ) {
    const refresher = async () => {
      const formdata = new FormData();
      const requestRefreshToken = mainStore.getState().token?.refresh_token;
      formdata.append('client_id', env.CLIENT_ID);
      formdata.append('client_secret', env.CLIENT_SECRET);
      formdata.append('grant_type', 'refresh_token');
      formdata.append('refresh_token', requestRefreshToken);
      const tokenPromise = axios.post(env.TOKEN_URL, formdata);
      let foundToken = false;
      const [tokenData, tokenError] = await tcatch<UserStateSlaceTypes['token'], any>(tokenPromise);

      if (tokenError) {
        //When there is an error from Id provider, check for the next 12 seconds if a new token was received.
        for (let i = 0; i < 12000; i += 500) {
          await delay(500);
          if (mainStore.getState().token?.refresh_token !== requestRefreshToken) {
            await delay(100);
            foundToken = true;
            break;
          }
        }
        if (!foundToken) {
          throw tokenError;
        }
      } else if (tokenData) {
        mainStore.setState(() => ({ token: tokenData }));
      }
    };

    await refresher();

    //At this point, we have a token so try again.
    //Set access_token for the request
    originalRequest._retry = true;
    const userType = mainStore.getState().currentUserType;
    if (userType === 'worker') {
      originalRequest.headers['X-JWT-TOKEN'] = mainStore.getState().token?.access_token;
    }
    if (userType === 'gatekeeper') {
      originalRequest.headers['X-JWT-ACCOUNT-TOKEN'] = mainStore.getState().token?.access_token;
    }
    return axios(originalRequest);
  }
  if (error?.response?.data) {
    /// Save error calls in AsyncStorage for debuging
    const newApiError = {
      url: response.config.url,
      errorData: error.response.data,
      errorResponseHeaderData: response.request.responseHeaders.Date,
      status: response.request.status,
      localAppDate: dayjs().toString(),
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      deviceYearClass: Device.deviceYearClass,
      osVersion: Device.osVersion,
      osBuildId: Device.osBuildId,
      appVersion: Constants?.expoConfig?.version,
    };

    // Save api error logs to the storage
    const apiErrors = mainStore.getState().apiErrors;
    if (!apiErrors) mainStore.setState({ apiErrors: [newApiError] });
    else mainStore.setState({ apiErrors: [...apiErrors, newApiError] });
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw objectError;
  }
  throw error;
};
