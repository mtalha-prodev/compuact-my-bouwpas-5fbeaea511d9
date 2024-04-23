import { env } from 'app/config/env';
import { useStore } from 'app/store/main-store/main-store';
import { UserStateSlaceTypes } from 'app/store/main-store/slices/user-slice';

import { useApiCall } from '../useApiCall';

export const useCredentialsBootstrap = () => {
  const token = useStore.useToken();

  return useApiCall<UserStateSlaceTypes['userTypes']>({
    link: env.ACCOUNT_TYPES,
    queryParams: {
      enabled: !!token,
      onSuccess: () => {
        useStore.setState(prev => ({
          bootstrapState: {
            ...prev.bootstrapState,
            isLoading: false,
            isSignedIn: true,
          },
        }));
      },
    },
  });
};
