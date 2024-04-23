import { env } from 'app/config/env';
import { queryClient } from 'app/hooks';
import {
  TAttendance,
  TDecodedQRAttendance,
  TTWorkerBadgesList,
} from 'app/layouts/worker/worker-projects-list/worker-projects-list.types';
import { api } from 'app/lib/api';
import { tcatch } from 'app/utils';
import dayjs from 'dayjs';

interface IWorkerAttendance {
  type: 2 | 3 | 4;
  dataProps: Partial<TDecodedQRAttendance>;
}

export const workerAttendance = async ({ type, dataProps }: IWorkerAttendance) => {
  let data;

  const cachedBadgesList = queryClient.getQueryData<TTWorkerBadgesList>(env.VIRTUAL_BADGES_URL);

  const badges = cachedBadgesList?.map(badgeItem => parseInt(badgeItem['hydra:member'].chipId, 10));
  const badge = badges && Math.min(...badges);

  const d = new Date();
  const settime = d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

  const currentDate = dayjs(settime);
  if (dataProps.gid) {
    data = {
      chipId: `${badge}`,
      foreignbadgeId: badge,
      loghappenedwhen: currentDate,
      logtypeId: type,
      project: `/v2/projects/${dataProps.project}`,
      providerId: 2,
      gateId: dataProps.gid,
    };
  } else {
    data = {
      chipId: `${badge}`,
      foreignbadgeId: badge,
      loghappenedwhen: currentDate,
      logtypeId: type,
      project: `/v2/projects/${dataProps.project}`,
      providerId: 2,
      zone: dataProps.name,
      gate: dataProps.name,
    };
  }

  const promise = api.post(env.ATTENDANCE_LOG_URL, data);
  const [attendanceResponse, attendanceError] = await tcatch<TAttendance>(promise);

  if (attendanceResponse) {
    queryClient.setQueryData(env.LAST_ATTENDANCE_LOG_URL, [attendanceResponse]);
    return attendanceResponse;
  }
  if (attendanceError) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw attendanceError;
  }
};
