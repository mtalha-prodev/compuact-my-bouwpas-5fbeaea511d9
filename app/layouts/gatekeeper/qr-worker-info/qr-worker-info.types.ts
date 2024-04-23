import { RouteProp } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { SignedInUser } from 'app/navigation/route-names';

export type TWorkerInfo = {
  company: {
    companyname: string;
  };
  pasId: number | null;
  uuid: string;
  worker: {
    dateofbirth: string;
    firstname: string;
    lastname: string;
    preposition: string;
    safetyVCAType: string | null;
    safetybhv: string;
    safetybhvverloopdatum: string | null;
    safetybril: string;
    safetyehbo: string;
    safetyehboverloopdatum: string | null;
    safetygehoorbeschermers: string;
    safetyhelm: string;
    safetyschoenen: string;
    safetyvca: string;
    safetyvcacertificaatnummer: string;
    safetyvcaverloopdatum: string;
    workerId: number;
  };
  extraInfo: string;
  makeTeamsInfo: string;
};

export type TWorkerRegistration = {
  companyname: string;
  firstname: string;
  keesingstatus: string | null;
  lastname: string;
  preposition: string;
  projectId: number;
  timestampsigned: string;
  workerId: number;
};
export type TWorkerRegistrations = TWorkerRegistration[];
export type TQRWorkerInfoProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_QR_WORKER_INFO>;
export type TWorkerInfoProps = RouteProp<RoutesTypes, SignedInUser.WORKER_INFO>;
