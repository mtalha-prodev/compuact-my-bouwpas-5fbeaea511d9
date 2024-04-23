import { TLiteProjectsList } from 'app/Types/liteprojects.types';
import { env } from 'app/config/env';
import { useStore } from 'app/store/main-store/main-store';
import { orderByDistance } from 'geolib';

import { useApiCall } from '../../useApiCall';

export const useLiteProjectsList = () => {
  const projectsListSortType = useStore.useProjectsListSortType();
  const deviceLocation = useStore.useDeviceLocation();
  const baseProjectsUrl = new URL(env.LITE_PROJECTS_URL);

  baseProjectsUrl.searchParams.append('projectStatusId[]', '1'); // active projects
  baseProjectsUrl.searchParams.append('itemsPerPage', '10000');

  return useApiCall<TLiteProjectsList>({
    link: baseProjectsUrl.toString(),
    queryParams: {
      // Select is the function to change/filter/sort/whatever data after it was fetched and ready to use
      select: projects => {
        const data = projects.filter(project => project !== undefined);
        if (projectsListSortType === 'abc') {
          return data.sort((a, b) => a.projectName.localeCompare(b.projectName));
        }
        if (projectsListSortType === 'closest') {
          const projectsWithLocation = data.filter(
            (project: any) => project.latitude && project.longitude,
          );
          const projectsWithoutLocation = data.filter(
            (project: any) => !project.latitude && !project.longitude,
          );
          if (deviceLocation) {
            const latitude = deviceLocation.coords.latitude;
            const longitude = deviceLocation.coords.longitude;
            const ordered = orderByDistance(
              { latitude, longitude },
              projectsWithLocation,
            ) as TLiteProjectsList;
            const sortedEntities = [...ordered, ...projectsWithoutLocation];
            return sortedEntities;
          }

          return data;
        }
        if (projectsListSortType === 'newest') {
          data.sort((a, b) => b.liteProjectId - a.liteProjectId);
        }
        return data;
      },
    },
  });
};
