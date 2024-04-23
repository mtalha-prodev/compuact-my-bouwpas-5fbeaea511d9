import { env } from 'app/config/env';

import { useApiCall } from '../useApiCall';

type TToolboxProjectCompanieItem = {
  companyname: string;
};

type TWhoAmI = {
  companies: TToolboxProjectCompanieItem[];
  email: string;
  firstname: string;
  lastname: string;
  preposition: string;
  uuid?: string;
};

export const useWhoAmI = (enabled?: boolean) => {
  return useApiCall<TWhoAmI>({
    link: env.WHOAMI_URL,
    queryParams: {
      enabled,
    },
  });
};
