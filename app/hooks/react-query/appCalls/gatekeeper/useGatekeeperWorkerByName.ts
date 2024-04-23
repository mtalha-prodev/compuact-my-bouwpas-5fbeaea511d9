import { env } from 'app/config/env';
import { TWorkersList } from 'app/models';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperWorkerByName = ({
  workerName,
  projectId,
  enabled,
}: {
  workerName: string;
  projectId: number;
  enabled?: boolean;
}) => {
  return useApiCall<TWorkersList>({
    link: `${env.REGISTRATIONS}?lastname=${workerName}&projectId[]=${projectId}`,
    uniqueDecriber: projectId,
    queryParams: {
      enabled,
    },
  });
};
