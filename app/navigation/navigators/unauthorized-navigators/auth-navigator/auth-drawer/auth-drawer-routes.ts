import { AuthNavigatorName, GlobalRoutes } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { Privacy, Settings } from 'app/screens';

import { AuthStackNavigator } from '../auth-stack/auth-stack';

export const authDrawerRoutes: TScreenRoutes = [
  {
    translatedTitle: 'menuItem1',
    routeName: AuthNavigatorName.AUTH_DRAWER_NAVIGATOR,
    icon: ['fad', 'home'],
    component: AuthStackNavigator,
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
    icon: ['fad', 'cog'],
    component: Settings,
  },
];
