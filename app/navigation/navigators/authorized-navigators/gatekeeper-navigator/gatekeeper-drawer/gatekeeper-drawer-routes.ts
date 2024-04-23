import { GlobalRoutes, SignedInNavigatorNames } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { Privacy, Settings } from 'app/screens';

import { GatekeeperStackNavigator } from '../gatekeeper-stack/gatekeeper-stack';

export const gatekeeperDrawerRoutes: TScreenRoutes = [
  {
    translatedTitle: 'menuItem1',
    routeName: SignedInNavigatorNames.GATEKEEPER_STACK_NAVIGATOR,
    icon: ['fad', 'triangle-person-digging'],
    component: GatekeeperStackNavigator,
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
