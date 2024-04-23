import { GlobalRoutes } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';
import { NoUserAccess, Privacy, Settings } from 'app/screens';

export const companyuserDrawerRoutes: TScreenRoutes = [
  {
    translatedTitle: 'menuItem1',
    routeName: GlobalRoutes.NO_USER_ACCESS,
    icon: ['fad', 'home'],
    component: NoUserAccess,
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
