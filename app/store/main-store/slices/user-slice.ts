import { TUser } from 'app/Types';
import { TSafesightContractors } from 'app/models';

import { SliceStateCreator } from '../../helpers/slice-creator';

export type UserStateSlaceTypes = {
  currentUserType: 'worker' | 'gatekeeper' | 'companyuser';
  userTypes: TUser;
  language: 'nl' | 'en' | 'de' | 'pl' | 'ro' | 'tr' | undefined;
  isPinSaved: boolean;
  apiErrors:
    | {
        url: string;
        errorData: string;
        errorResponseHeaderData: string;
        status: string;
        localAppDate: string;
        manufacturer: string | null;
        modelName: string | null;
        deviceYearClass: number | null;
        osVersion: string | null;
        osBuildId: string | null;
        appVersion: string | undefined;
      }[]
    | null;
  token: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  } | null;
  lastAppBgTimestamp: string;
  currentTooloboxLang: 'EN' | 'NL' | 'RO' | 'DE' | 'PL' | 'TR';
  storageV1migration: boolean;
  safesightContractors: TSafesightContractors | null;
  showSwipeTour: boolean;
};

export const createUserSlice: SliceStateCreator<UserStateSlaceTypes> = (): UserStateSlaceTypes => ({
  currentUserType: 'worker',
  userTypes: null,
  language: undefined,
  isPinSaved: false,
  apiErrors: [],
  token: null,
  lastAppBgTimestamp: `${new Date()}`,
  currentTooloboxLang: 'NL',
  storageV1migration: false,
  safesightContractors: null,
  showSwipeTour: true,
});
