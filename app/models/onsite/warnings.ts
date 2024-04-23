export type TWarning = {
  expirationDate: string;
  expirationReason: null | string;
  projectId: number;
  tsCreated: string;
  userCreated: number;
  warningDate: string;
  warningId: number;
  warningReason: string;
  warningTypeId: number;
  workerId: number;
};

export type TWarningsList = TWarning[];
