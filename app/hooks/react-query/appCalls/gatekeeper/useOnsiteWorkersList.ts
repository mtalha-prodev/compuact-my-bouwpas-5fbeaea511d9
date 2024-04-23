import { env } from 'app/config/env';
import { TOnsiteWorkersList } from 'app/models';

import { useApiCall } from '../../useApiCall';

export const useOnsiteWorkersList = (projectId: string | number) => {
  return useApiCall<TOnsiteWorkersList>({
    link: `${env.ONSITE_WORKERS}/${projectId}`,
    queryParams: {
      enabled: !!projectId,
      select: data => {
        return data;
      },
    },
  });
};

export const groupWorkersByZone = (data: TOnsiteWorkersList) => {
  const groupedData: { filterName: string; workers: TOnsiteWorkersList }[] = [];

  data.forEach(worker => {
    if (worker.gate?.zone.name) {
      const zoneName = worker.gate?.zone.name || 'Unknown';
      const existingGroup = groupedData.find(group => group.filterName === zoneName);

      if (existingGroup) {
        existingGroup.workers.push(worker);
      } else {
        groupedData.push({ filterName: zoneName, workers: [worker] });
      }
    }
  });

  // Sort the groupedData alphabetically by zoneName
  groupedData.sort((a, b) => {
    // Use localeCompare for case-insensitive sorting
    return a.filterName.localeCompare(b.filterName, undefined, { sensitivity: 'base' });
  });

  return groupedData;
};

export const groupWorkersByCoaname = (data: TOnsiteWorkersList) => {
  const groupedData: { filterName: string; workers: TOnsiteWorkersList }[] = [];

  data.forEach(worker => {
    const coanameName = worker.coaname || 'Unknown';
    const existingGroup = groupedData.find(group => group.filterName === coanameName);

    if (existingGroup) {
      existingGroup.workers.push(worker);
    } else {
      groupedData.push({ filterName: coanameName, workers: [worker] });
    }
  });

  return groupedData;
};

export const showGroupByZone = (data: TOnsiteWorkersList) => {
  let showGroup = false;
  for (const worker of data) {
    if (worker.gate?.zone.name) {
      showGroup = true;
      break;
    }
  }
  return showGroup;
};
