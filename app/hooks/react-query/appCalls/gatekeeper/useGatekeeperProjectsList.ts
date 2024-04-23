import { TProjectsList } from 'app/Types/projects.types';
import { env } from 'app/config/env';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperProjectsList = () => {
  return useApiCall<TProjectsList>({
    link: env.GATEKEEPER_PROJECTS,
    queryParams: {
      select: projects => {
        const data = projects.filter(
          project => project.projectstatusId === 1 && project !== undefined,
        );

        return data;
      },
    },
  });
};
