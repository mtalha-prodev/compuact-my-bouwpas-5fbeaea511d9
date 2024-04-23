import { TApiError } from 'app/lib/api';

import { SliceStateCreator } from '../../helpers/slice-creator';

export type AuthSlaceTypes = {
  bootstrapState: Partial<{
    isLoading: boolean;
    isError: null | TApiError;
    isSignedIn: boolean;
  }>;
};

export const createAuthSlice: SliceStateCreator<
  AuthSlaceTypes
> = (/* set, get */): AuthSlaceTypes => ({
  bootstrapState: {
    isLoading: false,
    isError: null,
    isSignedIn: false,
  },
});
