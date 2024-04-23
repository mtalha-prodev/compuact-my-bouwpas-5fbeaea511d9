import { SliceStateCreator } from '../../helpers/slice-creator';

export type RoutesStateSlaceTypes = {
  currentRoute: string | null | undefined;
};

export const createRoutesSlice: SliceStateCreator<RoutesStateSlaceTypes> = (
  set,
  get,
): RoutesStateSlaceTypes => ({
  currentRoute: null,
});
