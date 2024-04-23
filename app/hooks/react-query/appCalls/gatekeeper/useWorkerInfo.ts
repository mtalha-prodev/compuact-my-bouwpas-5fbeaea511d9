import { env } from 'app/config/env';
import { useApiCall } from 'app/hooks';
import { TWorkerInfo } from 'app/layouts/gatekeeper/qr-worker-info/qr-worker-info.types';
import * as Localization from 'expo-localization';

export const useWorkerInfo = (workerId: string | undefined, projectId?: number | null) => {
  const projectQuery = typeof projectId === 'number' ? `&projectId=${projectId}` : '';

  let locale = Localization.locale.slice(0, 2);
  //we send a locale so that portal can send the translated html.
  if (locale === 'nl') {
    locale = 'nl_nl';
  } else {
    locale = 'en_gb';
  }

  const url = `${env.UUIDS}/by-worker-and-project/${workerId}/${projectId}`;

  return useApiCall<TWorkerInfo>({
    link: url,
    queryParams: {},
  });
};
