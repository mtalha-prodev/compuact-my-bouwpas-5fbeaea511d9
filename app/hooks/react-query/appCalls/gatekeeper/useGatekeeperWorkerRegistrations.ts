import { env } from 'app/config/env';
import {
  TWorkerInfo,
  TWorkerRegistrations,
} from 'app/layouts/gatekeeper/qr-worker-info/qr-worker-info.types';
import { useStore } from 'app/store/main-store/main-store';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperWorkerRegistrations = (
  workerInfo: TWorkerInfo | undefined,
  workerInfoStatus: string,
) => {
  const onsiteLastProject = useStore.useOnsiteLastProject();

  return useApiCall<TWorkerRegistrations>({
    link: `${env.REGISTRATIONS}?projectId=${onsiteLastProject?.projectId}&workerId=${workerInfo?.worker.workerId}`,
    queryParams: {
      enabled: workerInfoStatus === 'success',
    },
  });
};
