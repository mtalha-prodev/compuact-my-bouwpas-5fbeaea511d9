import { storage_keys } from 'app/services/storage-keys';
import create, { GetState, SetState } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createAuthSlice, AuthSlaceTypes } from './slices/auth-slice';
import { createGatekeeperSlice, GatekeeperSlaceTypes } from './slices/gatekeeper-slice';
import { OnsiteWorkerTypes, createOnSiteWorkerSlice } from './slices/onsite-workers-slice';
import { createRoutesSlice, RoutesStateSlaceTypes } from './slices/routes-slice';
import { createUserSlice, UserStateSlaceTypes } from './slices/user-slice';
import { createWizardSlice, WizardSlaceTypes } from './slices/wizard-slice';
import { createWorkerSlice, WorkerSlaceTypes } from './slices/worker-slice';
import { createSelectorHooks } from '../helpers/store-selector';
import { withImmer, withPersist } from '../middlewares';

export interface IStore
  extends AuthSlaceTypes,
    UserStateSlaceTypes,
    RoutesStateSlaceTypes,
    WorkerSlaceTypes,
    GatekeeperSlaceTypes,
    WizardSlaceTypes,
    OnsiteWorkerTypes {}

const { main_store_persistance } = storage_keys;

export const mainStore = create<IStore>(
  devtools(
    withPersist(
      { persist_key: main_store_persistance },
      withImmer((set, get) => ({
        ...createAuthSlice(set as SetState<AuthSlaceTypes>, get as GetState<AuthSlaceTypes>),
        ...createUserSlice(
          set as SetState<UserStateSlaceTypes>,
          get as GetState<UserStateSlaceTypes>,
        ),
        ...createRoutesSlice(
          set as SetState<RoutesStateSlaceTypes>,
          get as GetState<RoutesStateSlaceTypes>,
        ),
        ...createWizardSlice(set as SetState<WizardSlaceTypes>, get as GetState<WizardSlaceTypes>),
        ...createWorkerSlice(set as SetState<WorkerSlaceTypes>, get as GetState<WorkerSlaceTypes>),
        ...createOnSiteWorkerSlice(
          set as SetState<OnsiteWorkerTypes>,
          get as GetState<OnsiteWorkerTypes>,
        ),
        ...createGatekeeperSlice(
          set as SetState<GatekeeperSlaceTypes>,
          get as GetState<GatekeeperSlaceTypes>,
        ),
      })),
    ),
  ),
);

//export const useStore = createSelectorFunctions(mainStore);
export const useStore = createSelectorHooks(mainStore);
