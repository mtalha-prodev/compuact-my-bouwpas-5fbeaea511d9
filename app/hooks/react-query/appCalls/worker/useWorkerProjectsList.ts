import { TProjectsList } from 'app/Types/projects.types';
import { env } from 'app/config/env';
import { useStore } from 'app/store/main-store/main-store';
import { orderByDistance } from 'geolib';

import { useApiCall } from '../../useApiCall';

export const useWorkerProjectsList = (loadOtherProjects = false) => {
  const projectsListSortType = useStore.useProjectsListSortType();
  const deviceLocation = useStore.useDeviceLocation();
  const baseProjectsUrl = new URL(
    loadOtherProjects ? env.WORKER_COMPANY_PROJECTS_URL : env.WORKER_PROJECTS_URL,
  );
  baseProjectsUrl.searchParams.append('projectstatusId[]', '1'); // active projects
  baseProjectsUrl.searchParams.append('projectstatusId[]', '6'); // administrative projects

  return useApiCall<TProjectsList>({
    link: baseProjectsUrl.toString(),
    queryParams: {
      // Select is the function to change/filter/sort/whatever data after it was fetched and ready to use
      select: projects => {
        const data = projects.filter(project => project !== undefined);
        if (projectsListSortType === 'abc') {
          return data.sort((a, b) => a.shortdescription.localeCompare(b.shortdescription));
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
            ) as TProjectsList;
            const sortedEntities = [...ordered, ...projectsWithoutLocation];
            return sortedEntities;
          }

          return data;
        }
        if (projectsListSortType === 'newest') {
          data.sort((a, b) => b.projectId - a.projectId);
        }
        return data;
      },
    },
  });
};
