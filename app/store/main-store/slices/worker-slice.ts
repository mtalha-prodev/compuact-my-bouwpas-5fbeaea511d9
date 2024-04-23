import { LocationObject } from 'expo-location';

import { SliceStateCreator } from '../../helpers/slice-creator';

export type WorkerSlaceTypes = {
  projectsListSortType: 'abc' | 'newest' | 'closest';
  deviceLocation: LocationObject | null;
  // IMPORTANT please read
  // currentAttendanceType === 2 -> Worker is attended to the procect so, CHECKED-IN
  // currentAttendanceType === 3 -> Worker is unnatended by scanning Check-out Qr so, CHECKED-OUT - by QR
  // currentAttendanceType === 4 -> Worker is unnatended by pressing Check-out btn from project info so, CHECKED-OUT - by btn
  currentAttendanceType: 2 | 3 | 4;
};

export const createWorkerSlice: SliceStateCreator<WorkerSlaceTypes> = (): WorkerSlaceTypes => ({
  projectsListSortType: 'abc',
  deviceLocation: null,
  currentAttendanceType: 3,
});
