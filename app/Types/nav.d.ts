import {
  AuthNavigatorName,
  AuthScreens,
  GlobalRoutes,
  MissingScreens,
  SignedInNavigatorNames,
  SignedInUser,
} from 'app/navigation/route-names';
import { TQrData } from '../Types';
import { TChildrenRendererProps } from 'react-native-render-html';

export type RoutesTypes = {
  [AuthNavigatorName.MAIN_STACK_GROUP]: undefined;
  [AuthNavigatorName.AUTH_NAVIGATOR]: undefined;
  [AuthNavigatorName.AUTH_DRAWER_NAVIGATOR]: undefined;
  [AuthNavigatorName.AUTH_TABS_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.SIGNED_IN_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.WORKER_STACK_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.WORKER_TABS_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.WORKER_DRAWER_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.GATEKEEPER_STACK_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.GATEKEEPER_TABS_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.GATEKEEPER_DRAWER_NAVIGATOR]: undefined;
  [SignedInNavigatorNames.COMPANYUSER_DRAWER_NAVIGATOR]: undefined;
  [MissingScreens.GLOBAL]: undefined;
  [AuthScreens.SIGN_IN]: TQrData;

  [GlobalRoutes.QR_SCANNER]: {
    screenName: keyof RoutesTypes;
    screenId?: number;
    screenIdPropName?: string;
    screenBottomBtn?:
      | 'wizard'
      | 'qr_register'
      | 'project_attendance'
      | 'toolbox_attendance'
      | 'gatekeeper_uuid_scanner';
  };
  [GlobalRoutes.APP_WIZARD]: TQrData;
  [GlobalRoutes.APP_UPDATE]: undefined;
  [GlobalRoutes.APP_VERSION_LOADING]: undefined;
  [GlobalRoutes.BOOKLET_ITEM]: {
    bookletId: number;
    bookletCrc: number;
    bookletTitle: string;
  };
  [SignedInUser.WORKER_PROJECTS]: TQrData;
  [SignedInUser.WORKER_OTHER_PROJECTS]: TQrData;
  [SignedInUser.WORKER_LITE_PROJECTS]: TQrData;
  [SignedInUser.WORKER_PROJECT_ITEM]: {
    projectId: number;
    otherProject?: boolean;
  };
  [SignedInUser.LITE_PROJECT_ITEM]: {
    projectId: number;
  };
  [SignedInUser.WORKER_QR_UUID]: { uuid: string };
  [SignedInUser.WORKER_TOOLBOXES]: TQrData;
  [SignedInUser.WORKER_TOOLBOX_ITEM]: {
    toolboxItemId: number;
  };
  [SignedInUser.WORKER_INFO]: {
    workerId: string;
    projectId?: number;
  };
  [SignedInUser.GATEKEEPER_PROJECT_ITEM]: {
    projectId: number;
    qrData?: any;
  };
  [SignedInUser.GATEKEEPER_QR_WORKER_INFO]: {
    workerUuid: string;
    projectId?: number;
  };
  [SignedInUser.GATEKEEPER_ONSITE_READ_NOTES]: {
    noteContent?: TChildrenRendererProps;
  };
  [SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM]: {
    toolboxItemId: number;
    qrData?: any;
  };
  [SignedInUser.GATEKEEPER_HOST_TOOLBOX_MEETING]: undefined;
  [SignedInUser.GATEKEEPER_ONSITE_WARNINGS_LIST]: {
    projectId: number;
  };
  [SignedInUser.GATEKEEPER_ONSITE_WARNING_ITEM]: {
    warningId: number;
    projectId: number;
  };
  [SignedInUser.GATEKEEPER_ONSITE_CREATE_WARNING]: {
    projectId: number;
  };
  [SignedInUser.GATEKEEPER_ONSITE_WORKERS]: {
    projectId: number;
    showCheckOut: boolean;
  };
  [SignedInUser.GATEKEEPER_MAKE_TEAMS_INFO]: {
    makeTeamsInfo: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RoutesTypes {}
  }
}
