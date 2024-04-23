import { FontAwesomeIcon, InfoBlock } from 'app/components';
import Box from 'app/components/app-box/app-box';
import HStack from 'app/components/hstack/hstack';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import VStack from 'app/components/vstack/vstack';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import {
  useApiCallStatus,
  useApiMutation,
  useGatekeeperAttendersList,
  useGatekeeperWorkerByName,
} from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from 'react-native';

export const FindWorkerByName: FC<{
  projectId: number;
  meetingId: number;
}> = ({ projectId, meetingId }) => {
  const { t } = React.useContext(LocalizationContext);

  const [workerName, setWorkerName] = React.useState('');
  const [shouldGetWorker, setShouldGetWorker] = React.useState(false);
  const refWorkerName = React.useRef('');

  const { isOpen: showHiddenInput, onToggle } = useDisclose();

  const {
    data: workers,
    status,
    isRefetching,
    error: workersError,
  } = useGatekeeperWorkerByName({
    workerName: refWorkerName.current,
    projectId,
    enabled: shouldGetWorker,
  });

  const { data: attenders } = useGatekeeperAttendersList(meetingId);

  const { showData, showLoading } = useApiCallStatus(status, isRefetching);

  const {
    mutateAsync: mutateWorkerAttendance,
    isLoading: isMutationLoading,
    error: mutateWorkerAttendanceError,
  } = useApiMutation();

  const searchWorker = async () => {
    const encodedLastname = encodeURIComponent(workerName.trim().toLowerCase());
    refWorkerName.current = encodedLastname;
    setShouldGetWorker(true);
    await delay(200);
    setShouldGetWorker(false);
  };

  const attendWorker = (workerId: number) => {
    return async () => {
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

      await mutateWorkerAttendance({
        key: `${env.TOOLBOX_MEETINGS_ATTENDEES}/${meetingId}/0`,
        apiLink: env.TOOLBOX_MEETING_ATTENDANCE,
        method: 'post',
        apiData,
      });
    };
  };

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        onPress={onToggle}
        style={[AppStyles.button, { justifyContent: 'flex-start' }]}
      >
        <>
          <FontAwesomeIcon
            icon={['fas', 'search']}
            size={25}
            colors={['bp-white', 'bp-white']}
            colorsLevel={['500', '500']}
          />
          <Text style={AppStyles.buttonText}>{t('findWorkerByNameToolbox')}</Text>
        </>
      </TouchableOpacity>

      {showHiddenInput && (
        <Box width="auto">
          <Text style={{ fontSize: 18, marginTop: 12 }}>{t('findWorkerInputToptext')}</Text>

          <HStack>
            <TextInput
              placeholder="Naam..."
              style={{
                backgroundColor: pickColor({ name: 'bp-primary', shade: 300 }),
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderRadius: 10,
                flex: 1,
                color: pickColor({ name: 'bp-primary', shade: 500 }),
              }}
              onChangeText={setWorkerName}
              editable={!showLoading && !isMutationLoading}
              placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
            />
            <TouchableOpacity
              disabled={showLoading || isMutationLoading}
              onPress={searchWorker}
              style={[AppStyles.button, { padding: 20, marginBottom: 12, marginLeft: 8 }]}
            >
              <>
                {showLoading || isMutationLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={pickColorSingleShade({ name: 'bp-white' })}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={['fas', 'search']}
                    size={20}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                )}
              </>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={showLoading || isMutationLoading}
              style={[AppStyles.button, { padding: 20, marginBottom: 12, marginLeft: 8 }]}
            >
              <>
                {showLoading || isMutationLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={pickColorSingleShade({ name: 'bp-white' })}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    size={20}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                )}
              </>
            </TouchableOpacity>
          </HStack>
        </Box>
      )}
      {showData && workers && (
        <VStack style={{ marginTop: 4 }}>
          {workers.map(({ firstname, lastname, preposition, workerId }, index) => (
            <Pressable
              key={workerId}
              onPress={attendWorker(workerId)}
              disabled={isMutationLoading}
              style={{ marginTop: 12 }}
            >
              <HStack>
                <Text
                  style={{ fontSize: 16, color: pickColor({ name: 'bp-primary', shade: 500 }) }}
                >{`${firstname} ${preposition} ${lastname}`}</Text>

                <Box flex={1} alignItems="flex-end" width="auto">
                  {!isMutationLoading && (
                    <FontAwesomeIcon
                      icon={['fas', 'user-plus']}
                      size={25}
                      colors={['bp-primary', 'bp-primary']}
                      colorsLevel={['500', '500']}
                    />
                  )}
                  {isMutationLoading && (
                    <ActivityIndicator
                      size="small"
                      color={pickColor({ name: 'bp-primary', shade: 500 })}
                    />
                  )}
                </Box>
              </HStack>
              {index !== workers.length - 1 && <View style={AppStyles.divider} />}
            </Pressable>
          ))}
        </VStack>
      )}
      {(workersError ?? (showData && workers && !workers.length)) && (
        <InfoBlock
          title={t('noWorkersInToolboxMeeting')}
          type="error"
          icon={['fad', 'exclamation-square']}
          apiError={workersError as any}
        />
      )}

      {mutateWorkerAttendanceError && (
        <Box my="4" width="auto">
          <InfoBlock
            title={t('noWorkersInToolboxMeeting')}
            icon={['fad', 'exclamation-square']}
            type="error"
            apiError={mutateWorkerAttendanceError}
          />
        </Box>
      )}
    </View>
  );
};
