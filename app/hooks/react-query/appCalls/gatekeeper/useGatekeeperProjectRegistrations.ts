import { env } from 'app/config/env';
import { TWorkersList } from 'app/models';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperProjectRegistrations = (projectId: number) => {
  return useApiCall<TWorkersList>({
    link: `${env.REGISTRATIONS}?projectId=${projectId}`,
  });
};
