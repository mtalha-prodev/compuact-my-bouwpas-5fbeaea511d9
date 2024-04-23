import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { FontAwesomeIcon, InfoBlock } from 'app/components';
import Box from 'app/components/app-box/app-box';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useApiMutation, useGatekeeperAttendersList } from 'app/hooks';
import { useGatekeeperWorkerInfo } from 'app/hooks/react-query/appCalls/gatekeeper/useGatekeeperWorkerInfo';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { tcatch } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, Alert, View, TouchableOpacity } from 'react-native';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM>;

export const FindWorkerByQrUuid: FC<{
  meetingId: number;
  projectId: number;
}> = ({ meetingId, projectId }) => {
  const { t } = React.useContext(LocalizationContext);
  const navigation = useNavigation();

  const route = useRoute<RouteProps>();
  const uuid = route.params.qrData?.content.hostname;
  const isUuid = !!uuid;

  const {
    data: workerUuidInfo,
    status,
    error: workerUuidInfoError,
  } = useGatekeeperWorkerInfo(uuid, projectId, isUuid);
  const { data: attenders } = useGatekeeperAttendersList(meetingId);

  const { showLoading, showData } = useApiCallStatus(status);

  const {
    mutateAsync: mutateWorkerAttendance,
    isLoading: isMutationLoading,
    error: mutateWorkerAttendanceError,
  } = useApiMutation();

  // Function to open QR code scanner
  const openQrScreen = () => {
    navigation.navigate(GlobalRoutes.QR_SCANNER, {
      screenName: SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM,
      screenId: meetingId,
      screenIdPropName: 'toolboxItemId',
    });
  };

  const attendWorker = async (workerId: number) => {
    const apiData = {
      toolboxMeetingId: meetingId,
      workerId,
    };
    /// Chech if youser exists in attenders list
    const checkWorker = attenders?.find(
      attender => attender.toolboxMeetingWorker.workerId === workerId,
    );

    if (checkWorker) {
      Alert.alert(t('exitingToolboxAttendeeTitle'), t('exitingToolboxAttendeeSubtitle'), [
        { text: 'OK' },
      ]);
      return;
    }

    await tcatch(
      mutateWorkerAttendance({
        key: `${env.TOOLBOX_MEETINGS_ATTENDEES}/${meetingId}/0`,
        apiLink: env.TOOLBOX_MEETING_ATTENDANCE,
        method: 'post',
        apiData,
      }),
    );
  };

  React.useEffect(() => {
    if (uuid && showData && workerUuidInfo) {
      attendWorker(workerUuidInfo.worker.workerId);
    }
  }, [route.params, workerUuidInfo]);

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity onPress={openQrScreen} style={AppStyles.button}>
        {showLoading || isMutationLoading ? (
          <ActivityIndicator size="small" color={pickColorSingleShade({ name: 'bp-white' })} />
        ) : (
          <>
            <FontAwesomeIcon
              icon={['fas', 'qrcode']}
              size={25}
              colors={['bp-white', 'bp-white']}
              colorsLevel={['500', '500']}
            />
            <Text style={AppStyles.buttonText}>{t('scanBadgeButton')}</Text>
          </>
        )}
      </TouchableOpacity>

      {mutateWorkerAttendanceError && (
        <Box my="4" width="auto">
          <InfoBlock
            title={
              mutateWorkerAttendanceError.errorData?.public_error?.nl
                ? mutateWorkerAttendanceError.errorData.public_error.nl
                : t('noWorkersInToolboxMeeting')
            }
            icon={['fad', 'exclamation-square']}
            type="error"
            apiError={mutateWorkerAttendanceError}
          />
        </Box>
      )}

      {workerUuidInfoError && (
        <Box my="4" width="auto">
          <InfoBlock
            title={t('noWorkersInToolboxMeeting')}
            type="error"
            icon={['fad', 'exclamation-square']}
            apiError={workerUuidInfoError}
          />
        </Box>
      )}
    </View>
  );
};
