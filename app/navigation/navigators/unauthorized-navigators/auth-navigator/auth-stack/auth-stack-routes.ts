import { navigatorOptions } from 'app/navigation/navigation-options';
import { AuthNavigatorName, GlobalRoutes } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { Settings } from 'app/screens';

import { AuthTabs } from '../auth-tabs/auth-tabs';

export const authStackRoutes: TScreenRoutes = [
  {
    routeName: AuthNavigatorName.AUTH_TABS_NAVIGATOR,
    component: AuthTabs,
    options: navigatorOptions,
  },
  {
    routeName: GlobalRoutes.APP_SETTINGS,
    component: Settings,
    options: navigatorOptions,
  },
];
