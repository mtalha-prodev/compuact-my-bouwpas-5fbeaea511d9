import { env } from 'app/config/env';
import { TTWorkerBadgesList } from 'app/layouts/worker/worker-projects-list/lite-projects-list.types';

import { useApiCall } from '../../useApiCall';

export const useWorkerBadges = () => {
  return useApiCall<TTWorkerBadgesList>({
    link: `${env.VIRTUAL_BADGES_URL}`,
  });
};
