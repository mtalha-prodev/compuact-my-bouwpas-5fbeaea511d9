import { SliceStateCreator } from '../../helpers/slice-creator';

export type OnsiteWorkerTypes = {
  onSiteWorkersListSortType: 'doNotGroup' | 'groupByZone' | 'groupByCoaname';
  currentActiveType: 2 | 3 | 4;
};

export const createOnSiteWorkerSlice: SliceStateCreator<
  OnsiteWorkerTypes
> = (): OnsiteWorkerTypes => ({
  onSiteWorkersListSortType: 'doNotGroup',
  currentActiveType: 2,
});
