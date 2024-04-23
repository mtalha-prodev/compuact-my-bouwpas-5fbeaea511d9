import { WorkerEmployers } from 'app/layouts';
import { GlobalRoutes, SignedInNavigatorNames, SignedInUser } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { Privacy, Settings } from 'app/screens';

import { WorkerStackNavigator } from '../worker-stack/worker-stack';

export const workerDrawerRoutes: TScreenRoutes = [
  {
    translatedTitle: 'menuItem1',
    routeName: SignedInNavigatorNames.WORKER_STACK_NAVIGATOR,
    icon: ['fad', 'triangle-person-digging'],
    component: WorkerStackNavigator,
  },
  // {
  //   translatedTitle: 'menuItem2',
  //   routeName: SignedInUser.WORKER_INFO,
  //   icon: ['fad', 'hard-hat'],
  //   component: WorkerInfo,
  // },
  {
    translatedTitle: 'menuItem3',
    routeName: SignedInUser.WORKER_EMPLOYERS,
    icon: ['fad', 'users'],
    component: WorkerEmployers,
  },
  {
    translatedTitle: 'menuItem5',
    routeName: GlobalRoutes.APP_PRIVACY,
    icon: ['fad', 'lock'],
    component: Privacy,
  },
  {
    translatedTitle: 'menuItem6',
    routeName: GlobalRoutes.APP_SETTINGS,
    icon: ['fas', 'cog'],
    component: Settings,
  },
];
