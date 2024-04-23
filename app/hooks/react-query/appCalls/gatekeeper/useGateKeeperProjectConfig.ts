import { env } from 'app/config/env';

import { useApiCall } from '../../useApiCall';
import { TProject } from 'app/Types/projects.types';

export const useGatekeeperProjectConfig = (projectId: string | number) => {
    return useApiCall<TProject>({
        link: `${env.ONSITE_PROJECT_CONFIG}/${projectId}`,
        queryParams: {
            enabled: !!projectId,
        },
    });
};