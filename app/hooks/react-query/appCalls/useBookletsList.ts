import { env } from 'app/config/env';
import { useWorkerProjectsList } from 'app/hooks';
import { TBookletsList } from 'app/models';

import { useApiCall } from '../useApiCall';

export const useBookletsList = (id: number, projectId?: number) => {
  // Get worker project contactractors to filter booklets
  let link = `${env.BOOKLETS_ALL_URL}` + id + `?`;
  if (projectId === undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: projectsList } = useWorkerProjectsList();

    projectsList?.forEach(item => {
      item.contractors.forEach(contractor => {
        const prop = `c[]=${contractor.contractorId}&`;
        link += prop;
      });
    });
  } else {
    link += 'p=' + projectId;
  }
  return useApiCall<TBookletsList>({
    link,
  });
};
