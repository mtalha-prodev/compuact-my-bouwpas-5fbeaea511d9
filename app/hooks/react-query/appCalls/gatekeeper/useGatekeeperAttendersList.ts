import { env } from 'app/config/env';

import { useApiCall } from '../../useApiCall';

type TMeetingAtendee = {
  id: number;
  toolboxMeetingId: number;
  workerId: number;
  worker: {
    projectId: number;
    companyname: string;
    lastname: string;
    preposition: string;
    firstname: string;
    dateofbirth: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    telephone: string;
    nationality: string;
    timestampsigned: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
  };
};

type TMeetingAtendeeList = {
  toolboxMeetingWorker: TMeetingAtendee;
}[];

export const useGatekeeperAttendersList = (meetingId: number) => {
  return useApiCall<TMeetingAtendeeList>({
    link: `${env.TOOLBOX_MEETINGS_ATTENDEES}/${meetingId}/0`,
  });
};
