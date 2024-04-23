import {
  OnsiteCreateWarning,
  OnsiteWarningsItem,
  OnsiteWarningsList,
  WorkerInfo,
} from 'app/layouts';
import { GatekeeperProjectItem } from 'app/layouts/gatekeeper/gatekeeper-projects-list/gatekeeper-project-item';
import { GatekeeperToolboxMeetingItem } from 'app/layouts/gatekeeper/gatekeeper-toolboxes-list/gatekeeper-toolbox-meeting-item';
import { OnsiteWorkersList } from 'app/layouts/gatekeeper/onsite/workers/onsite-workers-list';
import { QrWorkerInfo } from 'app/layouts/gatekeeper/qr-worker-info/qr-worker-info';
import { ToolboxMeetingHost } from 'app/layouts/toolbox/toolbox-meeting-host';
import { WorkerNotesContent } from 'app/layouts/worker/worker-info/notes';
import { navigatorOptions } from 'app/navigation/navigation-options';
import { SignedInNavigatorNames, SignedInUser } from 'app/navigation/route-names';
import { TScreenRoutes } from 'app/navigation/types/navigation-types';

import { GatekeeperTabs } from '../gatekeeper-tabs/gatekeeper-tabs';
import { MakeTeamsInfo } from 'app/layouts/gatekeeper/make-teams-info/make-teams-info';

export const gatekeeperStackRoutes: TScreenRoutes = [
  {
    routeName: SignedInNavigatorNames.GATEKEEPER_TABS_NAVIGATOR,
    component: GatekeeperTabs,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_PROJECT_ITEM,
    component: GatekeeperProjectItem,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_QR_WORKER_INFO,
    component: QrWorkerInfo,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_ONSITE_READ_NOTES,
    component: WorkerNotesContent,
    options: {
      headerShown: false,
      presentation: 'modal',
      animation: 'slide_from_bottom',
    },
  },
  {
    routeName: SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM,
    component: GatekeeperToolboxMeetingItem,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_HOST_TOOLBOX_MEETING,
    component: ToolboxMeetingHost,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_ONSITE_WARNINGS_LIST,
    component: OnsiteWarningsList,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_ONSITE_WARNING_ITEM,
    component: OnsiteWarningsItem,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_ONSITE_CREATE_WARNING,
    component: OnsiteCreateWarning,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_ONSITE_WORKERS,
    component: OnsiteWorkersList,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.WORKER_INFO,
    component: WorkerInfo,
    options: navigatorOptions,
  },
  {
    routeName: SignedInUser.GATEKEEPER_MAKE_TEAMS_INFO,
    component: MakeTeamsInfo,
    options: navigatorOptions,
  },
];
