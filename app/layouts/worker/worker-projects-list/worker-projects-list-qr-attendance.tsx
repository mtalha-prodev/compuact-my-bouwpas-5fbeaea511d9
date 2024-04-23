import { useNavigation } from '@react-navigation/core';
import { AttendanceAction, TAction } from 'app/components';
import CustomModal from 'app/components/app-modal/app-modal';
import { LocalizationContext } from 'app/contexts';
import { TApiError } from 'app/lib/api';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { workerAttendance } from 'app/services';
import { useStore } from 'app/store/main-store/main-store';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { tcatch } from 'app/utils';
import * as Haptics from 'expo-haptics';
import React, { FC } from 'react';
import { Alert, View } from 'react-native';

import { TAttendance, WorkerProjectListQrAttendanceProps } from './worker-projects-list.types';

export const WorkerProjectListQrAttendance: FC<WorkerProjectListQrAttendanceProps> = React.memo(
  ({ isOpen, qrData, onToggle }) => {
    const { t } = React.useContext(LocalizationContext);

    const currentAttendanceType = useStore.useCurrentAttendanceType();

    const [actionType, setActionType] = React.useState<TAction>({
      status: null,
    });

    const navigation = useNavigation();

    const mutateActionType = (newValue: TAction) => {
      setActionType(prevVal => ({
        ...prevVal,
        ...newValue,
      }));
    };

    const onQrCode = () => {
      if (qrData?.project && qrData.project > 0) {
        //mutateActionType({status: 'loading'});
        onToggle();

        const qrType = qrData.type;

        const checkedIn = currentAttendanceType === 2 && qrType === 2;
        const checkedOut = currentAttendanceType === 3 && qrType === 3;

        const canCheckIn = currentAttendanceType === 3 && qrType === 2;
        const canCheckOut = currentAttendanceType === 2 && qrType === 3;

        if (canCheckIn || checkedIn) mutateActionType({ status: 'checkIn' });
        if (canCheckOut || checkedOut) mutateActionType({ status: 'checkOut' });
      } else {
        Alert.alert(t('wrongQrCode'), t('tryAgain'), [
          {
            text: 'Nee',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(GlobalRoutes.QR_SCANNER, {
                screenName: SignedInUser.WORKER_PROJECTS,
                screenBottomBtn: 'project_attendance',
              });
            },
          },
        ]);
      }
    };

    const onAttendance = (type: 2 | 3) => async () => {
      mutateActionType({ status: 'loading' });
      // Promise function to add worker attendance log IN/OUT
      const workerAttendancePromise = workerAttendance({ type, dataProps: qrData });
      const [attendanceResponse, error] = await tcatch<TAttendance, TApiError>(
        workerAttendancePromise,
      );
      if (attendanceResponse) {
        mutateActionType({ status: null });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onToggle();
      }
      if (error) {
        mutateActionType({ status: 'error', error });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    };

    React.useEffect(() => {
      onQrCode();
    }, [qrData]);

    return (
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
              minHeight: '50%',
              shadowColor: pickColorSingleShade({ name: 'bp-black' }),
              shadowOpacity: 0.5,
              shadowRadius: 10,
              overflow: 'hidden',
            }}
          >
            {actionType.status === 'checkIn' ? (
              <AttendanceAction
                title={t('qrAttendanceTap')}
                icon={['fas', 'sign-in']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort
                actionType={actionType}
                onClose={onToggle}
                onAction={onAttendance(2)}
              />
            ) : null}

            {actionType.status === 'checkOut' ? (
              <AttendanceAction
                title={t('qrAttendanceTapOut')}
                icon={['fas', 'sign-out']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort
                actionType={actionType}
                onClose={onToggle}
                onAction={onAttendance(3)}
              />
            ) : null}

            {actionType.status === 'loading' ? (
              <AttendanceAction
                title=""
                icon={['fas', 'spinner']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort={false}
                actionType={actionType}
                onClose={onToggle}
              />
            ) : null}

            {actionType.status === 'error' ? (
              <AttendanceAction
                title={t('closeButtonLabel')}
                icon={['fas', 'exclamation-triangle']}
                closeBtnText={t('closeButtonLabel')}
                closeBtnIsAbort={false}
                actionType={actionType}
                onClose={onToggle}
                error={actionType.error}
              />
            ) : null}
          </View>
        }
      />
    );
  },
);
