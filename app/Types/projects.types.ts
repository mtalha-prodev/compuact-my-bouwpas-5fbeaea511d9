import { TProjectConfig } from "app/utils";
import { TEntityConfigCollection } from "app/utils/entityConfig";

export type TProject = {
  '@type': string;
  contactemail: string;
  contractors: {
    contractorimgfolder: string;
    contractorname: string;
    isbouwcombi: string;
    contractorId: number;
  }[];
  dateend: string | null;
  datestart: string;
  latitude: number;
  longitude: number;
  projectId: number;
  projectnumber: string;
  projectpenvoerderId: {
    companyname: string;
  };
  projectstatusId: number;
  projectType: string | null;
  shortdescription: string;
  telephone: string;
  visitingaddressdescription: null | string;
  visitingcity: string;
  visitinghousenumber: number;
  visitinghousenumberextension: string;
  visitingpostalareacode: string;
  visitingpostalcharactercode: string;
  visitingstreetname: string;
  legacyConfig: TProjectConfig | undefined;
  entityConfig: TEntityConfigCollection | undefined;
};

export type TProjectsList = TProject[];

// this function is used to check if an object is of type TProject
export function isTProject(obj: any): TProject | false {
  return (obj as TProject).projectId && (obj as TProject).projectnumber ? (obj as TProject) : false;
}
