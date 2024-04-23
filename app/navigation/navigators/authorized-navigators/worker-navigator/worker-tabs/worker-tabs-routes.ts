import { WorkerProjectsList, WorkerToolboxesList } from 'app/layouts';
import { BookletsList } from 'app/layouts/booklets/booklets-list';
import { SignedInUser } from 'app/navigation/route-names';

import { TScreenRoutes } from '../../../../types/navigation-types';

export const workerTabRoutes: TScreenRoutes = [
  {
    routeName: SignedInUser.WORKER_PROJECTS,
    component: WorkerProjectsList,
    icon: ['fad', 'construction'],
    translatedTitle: 'projectsPageTabNav1',
  },
  {
    routeName: SignedInUser.WORKER_BOOKLETS,
    component: BookletsList,
    translatedTitle: 'projectsPageTabNav2',
    icon: ['fad', 'books'],
  },
  {
    routeName: SignedInUser.WORKER_TOOLBOXES,
    component: WorkerToolboxesList,
    icon: ['fad', 'toolbox'],
    translatedTitle: 'projectsPageTabNav3',
  },
];
