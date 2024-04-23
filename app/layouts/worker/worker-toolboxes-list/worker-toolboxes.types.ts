import { RouteProp } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { SignedInUser } from 'app/navigation/route-names';

export type TToolBoxContentsItem = {
  content: string;
  toolboxContentId: number;
  language: {
    shortname: string;
    locale: string;
    languageId: number;
  };
};

export type TToolboxMediaItem = {
  toolboxMediaId: number;
  language: {
    shortname: string;
    locale: string;
    languageId: number;
  };
  mediaType: {
    name: string;
  };
  name: string;
  uploadedFileSalt: string;
  hash: string;
  publicUrl: string;
};

type TToolboxProjectCompanieItem = {
  companyname: string;
};

type TToolboxProjectContractorsItem = {
  contractorname: string;
  isbouwcombi: string;
  contractorimgfolder: string;
  companies: TToolboxProjectCompanieItem[];
};

type TToolboxAttender = {
  companies: TToolboxProjectCompanieItem[];
  dateofbirth: string;
  adres: string;
  postcode: string;
  woonplaats: string;
  telephone: string;
  email: string;
  workertype: string;
  socialsecuritynumber: number;
  iddateofexpiration: string;
  iddocumentnumber: string;
  idpassport: string;
  ididcard: string;
  iddrivinglicense: string;
  nationality: string;
  isEEA: null | string;
  safetysteiger: 'ja' | 'nee';
  safetysteigercertificaatnummer: string;
  safetysteigershowfirsttime: string;
  safetyehbo: 'ja' | 'nee';
  safetyehboverloopdatum: string;
  safetyhelm: 'ja' | 'nee';
  safetyschoenen: 'ja' | 'nee';
  safetybhv: 'nee' | 'ja';
  safetybhvverloopdatum: string;
  safetybril: 'nee' | 'ja';
  safetygehoorbeschermers: 'nee' | 'ja';
  safetyvca: 'ja' | 'nee';
  safetyVCAType: string;
  safetyvcaverloopdatum: string;
  safetyvcacertificaatnummer: string;
  safetyvcashowfirsttime: 'nee' | 'ja';
  a1: 'nee' | 'ja';
  a1uitgiftedatum: string;
  verblijfsdocnummer: string;
  verblijfsdocverloopdatum: string;
  socverz: string;
  deleted: boolean;
  workerId: number;
};

export type TToolbox = {
  name: string;
  status: boolean;
  description: string;
  toolboxId: number;
  toolboxContents: TToolBoxContentsItem[];
  tags: [];
  toolboxMedia: TToolboxMediaItem[];
};

export type TMeetingItem = {
  id: number;
  account: string | null;
  toolbox: TToolbox;
  project: {
    projectId: number;
    projectName: string;
    contractors: TToolboxProjectContractorsItem[];
    projectpenvoerderId: string | number | null;
    projectnumber: string;
    shortdescription: string;
    projectstatusId: number;
    datestart: string;
    dateend: null | string;
    visitingaddressdescription: string;
    visitingstreetname: string;
    visitinghousenumber: number;
    visitinghousenumberextension: string;
    visitingpostalareacode: string;
    visitingcity: string;
    contactemail: string;
    telephone: string;
    latitude: number;
    longitude: number;
  };
  remarks: null;
  attenders: TToolboxAttender[];
  date: string;
};

export type TToolboxMeetingQR = {
  date: string;
  id: string | number;
  name: string;
};

export type TToolboxMeetingsList = TMeetingItem[];
export type TWorkerTooxesListProps = RouteProp<RoutesTypes, SignedInUser.WORKER_TOOLBOXES>;
