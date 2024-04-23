import { useNavigation, useRoute } from '@react-navigation/core';
import { AttendanceAction, FontAwesomeIcon, TAction } from 'app/components';
import { GenericAlert } from 'app/components/alert';
import CustomModal from 'app/components/app-modal/app-modal';
import { Pressable } from 'app/components/pressable/pressable';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useToolboxMeetingsList } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { api, TApiError } from 'app/lib/api';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { isSafesightQr } from 'app/services/qr-register/is-safesight-qr';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { delay, tcatch } from 'app/utils';
import * as Haptics from 'expo-haptics';
import React, { FC } from 'react';
import { View } from 'react-native';

import { TToolboxMeetingQR, TWorkerTooxesListProps } from './worker-toolboxes.types';

export const WorkerToolboxQrAttendance: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const navigation = useNavigation();
  const route = useRoute<TWorkerTooxesListProps>();
  const { isOpen, onToggle } = useDisclose();
  const [actionType, setActionType] = React.useState<TAction>({
    status: 'checkIn',
  });
  const { refetch: toolboxesListRefetch } = useToolboxMeetingsList({ type: 1 });

  const qrData: string = route.params?.qrData.rawScannedData;

  const mutateActionType = (newValue: TAction) => {
    setActionType(prevVal => ({
      ...prevVal,
      ...newValue,
    }));
  };

  const openQrScreen = () => {
    navigation.navigate(GlobalRoutes.QR_SCANNER, {
      screenName: SignedInUser.WORKER_TOOLBOXES,
      screenBottomBtn: 'toolbox_attendance',
    });
  };

  const onQrDataReceived = async () => {
    if (qrData) {
      await delay(500);
      onToggle();
    }
  };

  const safesightQrAlert = () => {
    GenericAlert({
      title: t('safesightQrAlertTitle'),
      message: t('safesightQrAlertBody'),
    });
  };

  const onMeetingAttend = async () => {
    try {
      mutateActionType({ status: 'loading' });
      const qr: TToolboxMeetingQR = JSON.parse(qrData);

      const [data, error] = await tcatch<any, TApiError>(
        api.post(env.TOOLBOX_MEETING_ATTENDANCE, {
          toolboxMeetingId: qr.id,
        }),
      );
      if (data) {
        await toolboxesListRefetch();
        mutateActionType({ status: 'checkIn' });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onToggle();
      }
      if (error) {
        mutateActionType({ status: 'error', error });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // an error occurred but we don't know what to tell the user
      // console logs get logged to Sentry if a real error happens later on
      mutateActionType({ status: 'error', error: undefined });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const onClear = () => {
    onToggle();
    mutateActionType({ status: 'checkIn', error: undefined });
  };

  React.useEffect(() => {
    // first, check if the structure of the data is a safesight qr code, then divert
    if (isSafesightQr(qrData)) {
      safesightQrAlert();
      return;
    }
    // otherwise, handle incoming qrData
    onQrDataReceived();
  }, [qrData, route]);

  return (
    <View>
      <Pressable onPress={openQrScreen}>
        <FontAwesomeIcon
          icon={['fas', 'qrcode']}
          size={40}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
      </Pressable>
      <CustomModal
        isOpen={isOpen}
        onClose={onToggle}
        modalContent={
          <View
            style={{
              backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 48,
              marginHorizontal: 8,
              minWidth: '90%',
            }}
          >
            {actionType.status === 'checkIn' && (
              <AttendanceAction
                title={t('qrAttendanceTap')}
                icon={['fas', 'sign-in']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort={false}
                actionType={actionType}
                onClose={onToggle}
                onAction={onMeetingAttend}
              />
            )}
            {actionType.status === 'loading' && (
              <AttendanceAction
                title={t('qrAttendanceTapOut')}
                icon={['fas', 'sign-out']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort={false}
                actionType={actionType}
                onClose={onToggle}
              />
            )}
            {actionType.status === 'error' && (
              <AttendanceAction
                title=""
                icon={['fas', 'times']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort={false}
                actionType={actionType}
                onAction={onClear}
                onClose={onClear}
                error={actionType.error}
              />
            )}
          </View>
        }
      />
    </View>
  );
};
