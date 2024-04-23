import { env } from 'app/config/env';
import { TWarningsList } from 'app/models';

import { useApiCall } from '../../useApiCall';

export const useOnsiteProjectWarnings = (projectId: string | number) => {
  return useApiCall<TWarningsList>({
    link: `${env.ONSITE_WARNINGS}/${projectId}/0`,
    queryParams: {
      enabled: !!projectId,
      select: data => {
        const newData = data.map(obj => ({ ...obj, date: new Date(obj.warningDate) }));
        const sortedDesc = newData.sort((objA, objB) => objB.date.getTime() - objA.date.getTime());
        return sortedDesc;
      },
    },
  });
};

export const useOnsiteProjectWarningItem = ({
  projectId,
  warningId,
}: {
  projectId: number;
  warningId: number;
}) => {
  return useApiCall<TWarningsList>({
    link: `${env.ONSITE_WARNINGS}/${projectId}/0`,
    queryParams: {
      select: data => {
        const filtered = data.filter(warning => warning.warningId === warningId);
        return filtered;
      },
    },
  });
};
