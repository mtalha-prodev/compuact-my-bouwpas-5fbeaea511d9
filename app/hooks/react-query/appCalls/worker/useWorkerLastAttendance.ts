import { env } from 'app/config/env';
import { TLastAttendanceList } from 'app/layouts/worker/worker-projects-list/worker-projects-list.types';
import { useStore } from 'app/store/main-store/main-store';

import { useApiCall } from '../../useApiCall';

export const useWorkerLastAttendance = () => {
  return useApiCall<TLastAttendanceList>({
    link: env.LAST_ATTENDANCE_LOG_URL,
    queryParams: {
      onSuccess: data => {
        // Data can be Array with null inside, if no attendance logs, example -> [null]
        // So lets check if first element of Array is true and not null
        if (data[0]) {
          const logtypeId = data[0].logtypeId === 4 ? 3 : data[0].logtypeId;
          // logtypeId can bee === 4, that means that worker checked out with btn inside
          // of project item screen, in this case just set "currentAttendanceType" to 3
          // because it's easy to handle in attendance modal
          useStore.setState({ currentAttendanceType: logtypeId });
        } else {
          // If data is === [null] set currentAttendanceType global state variable to 3
          // So worker can make Check In
          useStore.setState({ currentAttendanceType: 3 });
        }

        return data;
      },
    },
  });
};
