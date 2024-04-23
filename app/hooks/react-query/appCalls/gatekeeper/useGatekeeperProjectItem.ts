import { TProject, TProjectsList } from 'app/Types/projects.types';
import { env } from 'app/config/env';
import { useQueryClient } from 'react-query';

import { useApiCall } from '../../useApiCall';

export const useGatekeeperProjectItem = (id: number) => {
  const cache = useQueryClient();
  return useApiCall<TProject>({
    link: env.GATEKEEPER_PROJECTS,
    uniqueDecriber: id,
    queryParams: {
      initialData: () => {
        return cache
          .getQueryData<TProjectsList>(env.GATEKEEPER_PROJECTS)
          ?.find(d => d.projectId === id);
      },
    },
  });
};
