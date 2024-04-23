export type TLiteProject = {
  '@type': string;
  liteProjectId: number;
  projectId: number | null;
  contractorId: string;
  contractorName: string;
  projectStatusId: number;
  projectNumber: string;
  projectName: string;
  visitingStreetName: string | null;
  visitingHouseNumber: number | null;
  visitingHouseNumberExtension: string | null;
  visitingPostalAreaCode: string | null;
  visitingPostalCharacterCode: string | null;
  visitingCity: string;
  latitude: number;
  longitude: number;
};

export function isTLiteProject(obj: any): TLiteProject | false {
  return (obj as TLiteProject).liteProjectId && (obj as TLiteProject).contractorId
    ? (obj as TLiteProject)
    : false;
}

export type TLiteProjectsList = TLiteProject[];
