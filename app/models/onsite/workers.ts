export type TOnsiteWorkers = {
  [x: string]: any;
  loghappenedwhen: string;
  foreignObjectName: null | string;
  coaname: string;
  companyname: string;
  lastname: string;
  firstname: string;
  preposition: string;
  workerid: number;
  gate: TGate | null;
  chipId: string | null;
  foreignBadgeId: number | null;
};

export type TGate = {
  id: number;
  name: string;
  zone: TZone;
};

export type TZone = {
  id: number;
  name: string;
};

export type TOnsiteWorkersList = TOnsiteWorkers[];
