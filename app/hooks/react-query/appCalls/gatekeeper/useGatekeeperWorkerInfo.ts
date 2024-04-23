import { env } from 'app/config/env';
import { useApiCall } from 'app/hooks';
import { TWorkerInfo } from 'app/layouts/gatekeeper/qr-worker-info/qr-worker-info.types';
import * as Localization from 'expo-localization';

export const useGatekeeperWorkerInfo = (
  uuid: string | undefined,
  projectId?: number,
  enabled?: boolean,
) => {
  const conditional = enabled ? enabled : typeof uuid === 'string' && uuid.length > 0;

  let locale = Localization.locale.slice(0, 2);
  //we send a locale so that portal can send the translated html.
  if (locale === 'nl') {
    locale = 'nl_nl';
  } else {
    locale = 'en_gb';
  }

  let url = `${env.UUIDS}/${uuid}?provideHtml=1&locale=${locale}`;
  if (projectId) {
    url = url + `&projectId=${projectId}`;
  }

  return useApiCall<TWorkerInfo>({
    link: url,
    queryParams: {
      enabled: conditional,
    },
  });
};
