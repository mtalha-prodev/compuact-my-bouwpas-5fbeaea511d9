import { GatekeeperProjectsList, GatekeeperToolboxMeetingsList } from 'app/layouts';
import { SignedInUser } from 'app/navigation/route-names';

import { TScreenRoutes } from '../../../../types/navigation-types';

export const gatekeeperTabRoutes: TScreenRoutes = [
  {
    routeName: SignedInUser.GATEKEEPER_PROJECTS,
    component: GatekeeperProjectsList,
    icon: ['fad', 'list'],
    translatedTitle: 'projectsPageTabNav1',
  },
  {
    routeName: SignedInUser.GATEKEEPER_TOOLBOXES,
    component: GatekeeperToolboxMeetingsList,
    icon: ['fad', 'toolbox'],
    translatedTitle: 'projectsPageTabNav3',
  },
];
