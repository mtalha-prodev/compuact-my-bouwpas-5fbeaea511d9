import { env } from 'app/config/env';
import {
  TMeetingItem,
  TToolboxMeetingsList,
} from 'app/layouts/worker/worker-toolboxes-list/worker-toolboxes.types';
import { useStore } from 'app/store/main-store/main-store';
import { useQueryClient } from 'react-query';

import { useApiCall } from '../../useApiCall';

type TUseToolboxMeetingList = {
  toolboxMeetingId: number;
  // Type 1 === Worker
  // Type 2 === Gatekeeper
  type: 1 | 2;
};

export const useWorkerToolboxMeetingItem = ({
  toolboxMeetingId,
  type = 1,
}: TUseToolboxMeetingList) => {
  const cache = useQueryClient();

  const currentTooloboxLang = useStore.useCurrentTooloboxLang();

  return useApiCall<TMeetingItem>({
    link: env.MY_TOOLBOX_MEETINGS,
    uniqueDecriber: toolboxMeetingId,
    queryParams: {
      // This screen might be open from the deeplink
      // In this case we dont have our data yet in queryClient cache
      // So lets try to find item by ID, if it's not exist
      // React-Query will fetch data and then display this particular item
      initialData: () => {
        // Notice [env.MY_TOOLBOX_MEETINGS, type]
        // This hook can be used inside worker and gatekeeper user modes
        // They need to use different query keys thats why it's array and type number
        // where 1 is worker
        // and 2 is gatekeeper
        const cachedData = cache
          .getQueryData<TToolboxMeetingsList>([env.MY_TOOLBOX_MEETINGS, type])
          ?.find(d => d.id === toolboxMeetingId);

        return cachedData;
      },
      // Let's filter our toolbox contents and media by selected language
      // And then just return filtered data
      select: data => {
        const contentsLang = data.toolbox.toolboxContents.filter(
          toolbox => toolbox.language.locale.toUpperCase() === currentTooloboxLang,
        );
        const mediaLang = data.toolbox.toolboxMedia.filter(
          toolbox => toolbox.language.locale.toUpperCase() === currentTooloboxLang,
        );
        const newdata: TMeetingItem = {
          ...data,
          toolbox: {
            ...data.toolbox,
            toolboxContents: contentsLang,
            toolboxMedia: mediaLang,
          },
        };

        return newdata;
      },
    },
  });
};
