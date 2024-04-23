import { env } from 'app/config/env';
import {
  TToolBoxContentsItem,
  TToolboxMediaItem,
} from 'app/layouts/worker/worker-toolboxes-list/worker-toolboxes.types';

import { useApiCall } from '../../useApiCall';

type TToolbox = {
  toolboxId: number;
  name: string;
  description: string;
  modified: string;
  status: boolean;
  toolboxContents: TToolBoxContentsItem[];
  toolboxMedia: TToolboxMediaItem[];
  tags: [];
};

type TToolboxList = TToolbox[];

export const useGatekeeperToolboxesList = () => {
  return useApiCall<TToolboxList>({
    link: env.GATEKEEPER_TOOLBOXES,
    queryParams: {
      select: data => {
        const filterData = data.filter(toolbox => toolbox.status);
        return filterData;
      },
    },
  });
};
