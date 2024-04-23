import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { api, TApiError } from 'app/lib/api';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';
import { tcatch } from 'app/utils';
import * as Linking from 'expo-linking';
import React from 'react';
import { Alert, Platform } from 'react-native';
import base64 from 'react-native-base64';

export type TSafesightUrlConfig = {
  projectType: 'project' | 'liteProject';
  type: 'task' | 'log' | 'taskId' | 'logId' | 'allLogs' | 'forms' | 'toolbox';
  id?: string | number;
};

type TEncToken = { encrypted: string; key: string; iv: string };
type TSafesightRedirectStatus = {
  state: 'success' | 'loading' | 'error' | 'initial';
  error: TApiError | null;
};

export const deeplinks = {
  task: 'safesight://safesight.com/task',
  log: 'safesight://safesight.com/log',
  allLogs: 'safesight://safesight.com/allLogs',
  forms: 'safesight://safesight.com/forms',
  toolbox: 'safesight://safesight.com/toolbox',
};

// We need to get encrypted token to safesight
const getEncToken = async () => {
  // Take current access_token
  const token = useStore.getState().token;

  if (!token) {
    return null;
  }
  // Make a new FormData to send to the ID provider
  const formdata = new FormData();
  formdata.append('client_id', env.CLIENT_ID);
  formdata.append('client_secret', env.CLIENT_SECRET);
  formdata.append('grant_type', 'refresh_token');
  formdata.append('refresh_token', token.refresh_token);

  // Call to the api
  const [data, error] = await tcatch<any, TApiError>(api.post(env.TOKEN_URL_ENC, formdata));

  // Encrypted token is coming is base64 format, we need to decode it
  const newToken = JSON.parse(base64.decode(data.jwt)) as UserStateSlaceTypes['token'];
  // and save it by replacing with current access_token
  useStore.setState({ token: newToken });

  // If encrypted token exists and response is 200 return data
  if (data) return data;
  // Otherwise throw error
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  if (error) throw error;
};

export const useSafesight = () => {
  const [status, setStatus] = React.useState<TSafesightRedirectStatus>({
    state: 'initial',
    error: null,
  });

  const { t } = React.useContext(LocalizationContext);

  const openSafesight = async (config: TSafesightUrlConfig) => {
    setStatus({ state: 'loading', error: null });

    const { type, id } = config;
    let url;

    const [tcEncData, tcEncError] = await tcatch<TEncToken, TApiError>(getEncToken());

    if (tcEncData) {
      const encValues = tcEncData;
      const { task, log, allLogs, forms, toolbox } = deeplinks;
      const { encrypted, key, iv } = encValues;

      switch (type) {
        case 'task':
          url = `${task}/${encrypted}/${key}/${iv}/${config.projectType}`;
          break;
        case 'log':
          url = `${log}/${encrypted}/${key}/${iv}/${config.projectType}`;
          break;
        case 'taskId':
          url = `${task}/${encrypted}/${key}/${iv}/${id}/${config.projectType}`;
          break;
        case 'logId':
          url = `${log}/${encrypted}/${key}/${iv}/${id}/${config.projectType}`;
          break;
        case 'allLogs':
          url = `${allLogs}/${encrypted}/${key}/${iv}/${id}/${config.projectType}`;
          break;
        case 'forms':
          url = `${forms}/${encrypted}/${key}/${iv}/${id}/${config.projectType}`;
          break;
        case 'toolbox':
          url = `${toolbox}/${encrypted}/${key}/${iv}/${id}/${config.projectType}`;
          break;
        default:
          url = task;
          break;
      }

      const [, tcOpenUrlError] = await tcatch(Linking.openURL(url));

      // If safesight does not exist on the device
      // Redirect user to the store
      // To download the safesight app
      if (tcOpenUrlError) {
        setStatus({
          state: 'error',
          error: {
            errorData: 'No safesight app',
            errorStatus: 1,
            errorUrl: '',
          },
        });

        const marketUrl =
          Platform.OS === 'ios' ? env.SAFESIGHT_IOS_MARKET_LINK : env.SAFESIGHT_PLAY_MARKET_LINK;

        Linking.openURL(marketUrl).catch(_err => {
          Alert.alert(t('noSafesightApp'), t('safesightDownloadInstruction'));
        });
      }
    }

    if (tcEncError) {
      setStatus({ state: 'error', error: tcEncError });
      return;
    }

    setStatus({ state: 'success', error: null });
  };

  const showSafesightButtons = (contractorId: number) => {
    const safesightContractors = useStore.useSafesightContractors();
    const result = safesightContractors?.includes(contractorId);

    return result;
  };

  return {
    status,
    openSafesight,
    showSafesightButtons,
  };
};
