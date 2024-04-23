import { LiteProjectItem } from 'app/layouts/worker/worker-projects-list/lite-project-item';
import { LiteProjects } from 'app/layouts/worker/worker-projects-list/lite-projects';
import { WorkerOtherProjects } from 'app/layouts/worker/worker-projects-list/worker-other-projects';
import { WorkerProjectItem } from 'app/layouts/worker/worker-projects-list/worker-project-item';
import { WorkerToolboxItem } from 'app/layouts/worker/worker-toolboxes-list/worker-toolbox-item';
import { navigatorOptions } from 'app/navigation/navigation-options';
import { SignedInNavigatorNames, SignedInUser } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';

import { WorkerTabs } from '../worker-tabs/worker-tabs';

export const workerStackRoutes: TScreenRoutes = [
  {
    routeName: SignedInNavigatorNames.WORKER_TABS_NAVIGATOR,
    component: WorkerTabs,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.WORKER_OTHER_PROJECTS,
    component: WorkerOtherProjects,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.WORKER_LITE_PROJECTS,
    component: LiteProjects,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.WORKER_PROJECT_ITEM,
    component: WorkerProjectItem,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.LITE_PROJECT_ITEM,
    component: LiteProjectItem,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.WORKER_TOOLBOX_ITEM,
    component: WorkerToolboxItem,
    options: navigatorOptions,
  },
];
