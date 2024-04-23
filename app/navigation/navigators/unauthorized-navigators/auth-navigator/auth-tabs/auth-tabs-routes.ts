import { SignIn } from 'app/layouts';
import { BookletsList } from 'app/layouts/booklets/booklets-list';
import { AuthScreens } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';

export const authTabRoutes: TScreenRoutes = [
  {
    routeName: AuthScreens.SIGN_IN,
    component: SignIn,
    icon: ['fad', 'construction'],
    translatedTitle: 'projectsPageTabNav1',
  },
  {
    routeName: AuthScreens.PUBLIC_BOOKLETS,
    component: BookletsList,
    translatedTitle: 'projectsPageTabNav2',
    icon: ['fad', 'books'],
  },
];
