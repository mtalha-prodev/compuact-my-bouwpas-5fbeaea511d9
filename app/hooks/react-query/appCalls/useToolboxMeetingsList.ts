import { env } from 'app/config/env';
import { TToolboxMeetingsList } from 'app/layouts/worker/worker-toolboxes-list/worker-toolboxes.types';

import { useApiCall } from '../useApiCall';

type TUseToolboxMeetingList = {
  // Type 1 === Worker
  // Type 2 === Gatekeeper
  type: 1 | 2;
};

export const useToolboxMeetingsList = ({ type = 1 }: TUseToolboxMeetingList) => {
  return useApiCall<TToolboxMeetingsList>({
    link: env.MY_TOOLBOX_MEETINGS,
    uniqueDecriber: type,
    queryParams: {
      select: data => {
        // Sort toolboxes lis by date when data is ready
        return data.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
      },
    },
  });
};
