import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { RouteProp } from '@react-navigation/core';
import { TLiteProject } from 'app/Types/liteprojects.types';
import { RoutesTypes } from 'app/Types/nav';
import { TProject } from 'app/Types/projects.types';
import { TApiError } from 'app/lib/api';
import { SignedInUser } from 'app/navigation/route-names';

export type TWorkerBadge = {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:member': {
    '@id': string;
    '@type': string;
    active: boolean;
    chipId: string;
  };
};

export type TAttendance = {
  chipId: string;
  foreignId: string | null;
  foreignObjectName: string | null;
  foreignbadgeId: number;
  // Gate field can be absent if worker checked out with the btn from project info screen
  // logtypeId === 4
  gate?: {
    __cloner__: string | null;
    __initializer__: string | null;
    __isInitialized__: boolean;
    description: string | null;
    enteringZoneId: string | number;
    gateId: number;
    latitude: string | null;
    leavingZoneId: number;
    longitude: string | null;
    name: string;
    projectId: number;
  };
  gateId: number;
  logId: number;
  loghappenedwhen: string;
  // IMPORTANT please read
  // logtypeId === 2 -> Worker is attended to the procect so, CHECKED-IN
  // logtypeId === 3 -> Worker is unnatended by scanning Check-out Qr so, CHECKED-OUT - by QR
  // logtypeId === 4 -> Worker is unnatended by pressing Check-out btn from project info so, CHECKED-OUT - by btn
  logtypeId: 2 | 3 | 4;
  project: string;
  projectId: number;
  providerId: number;
  timeCategory: null | string;
  userId: null | number;
};

export type TDecodedQRAttendance = {
  exp: number;
  gid: number;
  iat: number;
  jti: number;
  name: string;
  project: number;
  type: number;
  zid: number;
  zone: string;
};

export type TTWorkerBadgesList = TWorkerBadge[];
export type TLastAttendanceList = (TAttendance | null)[];
export type RouteProps = RouteProp<RoutesTypes, SignedInUser.WORKER_PROJECTS>;

export interface IWorkerProjectListHeaderProps {
  badges: TTWorkerBadgesList | undefined;
  badgesError: TApiError;
}

export interface IWorkerProjectListItemProps {
  otherProject?: boolean;
  project: TProject;
  subtitle?: string;
  index: number;
  isSuccess?: boolean | null;
  successRightBottomIcon?: IconProp;
  successRightBottomText?: string;
  onPress: () => void;
}

export interface ILiteProjectListItemProps {
  project: TLiteProject;
  subtitle?: string;
  index: number;
  onPress: () => void;
}

export interface WorkerProjectListQrAttendanceProps {
  isOpen: boolean;
  onToggle: () => void;
  qrData: TDecodedQRAttendance;
}
