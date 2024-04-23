import { SliceStateCreator } from '../../helpers/slice-creator';

export type GatekeeperSlaceTypes = {
  onsiteLastProject: {
    projectName: string;
    projectId: number;
  } | null;
};

export const createGatekeeperSlice: SliceStateCreator<
  GatekeeperSlaceTypes
> = (): GatekeeperSlaceTypes => ({
  onsiteLastProject: null,
});
