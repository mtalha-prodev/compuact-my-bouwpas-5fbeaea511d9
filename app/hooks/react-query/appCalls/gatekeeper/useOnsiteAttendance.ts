import { env } from 'app/config/env';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperOnsiteAttendance = (projectId: string | number) => {
  return useApiCall<number>({
    link: `${env.ONSITE_ATTENDANCE}/${projectId}`,
    queryParams: {
      enabled: !!projectId,
    },
  });
};
