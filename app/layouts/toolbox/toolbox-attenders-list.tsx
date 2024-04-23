import { FontAwesomeIcon } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useGatekeeperAttendersList } from 'app/hooks';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';

interface IToolboxAttendersListProps {
  meetingId: number;
  hideRefreshBtn?: boolean;
}

export const ToolboxAttendersList: FC<IToolboxAttendersListProps> = ({
  meetingId,
  hideRefreshBtn = false,
}) => {
  const { t } = React.useContext(LocalizationContext);

  const {
    data: attendersList,
    status,
    refetch,
    isRefetching,
  } = useGatekeeperAttendersList(meetingId);

  const { showLoading } = useApiCallStatus(status, isRefetching);

  const returnTitle = () => {
    if (attendersList && attendersList.length === 1) {
      return `${attendersList.length} ${t('toolboxAttendee')}`;
    }
    if (attendersList && attendersList.length > 1) {
      return `${attendersList.length} ${t('toolboxAttendees')}`;
    }
    return `0 ${t('toolboxAttendees')}`;
  };

  return (
    <>
      <View style={AppStyles.invisibleBox}>
        <Text style={AppStyles.headingTitle}>{t('attendersListHeader')}</Text>
      </View>
      <View style={AppStyles.box}>
        <View style={AppStyles.hStack}>
          <FontAwesomeIcon
            icon={['fas', 'list']}
            size={25}
            colors={['bp-primary', 'bp-primary']}
            colorsLevel={['500', '500']}
          />
          {showLoading && (
            <ActivityIndicator
              size="small"
              color={pickColor({ name: 'bp-primary', shade: 500 })}
              style={{ marginLeft: 20 }}
            />
          )}
          {!showLoading && (
            <Text
              style={{
                color: pickColor({ name: 'bp-primary', shade: 500 }),
                fontSize: 16,
                marginLeft: 20,
              }}
            >
              {returnTitle()}
            </Text>
          )}
          {hideRefreshBtn && (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Pressable onPress={() => refetch()} disabled={showLoading}>
                <FontAwesomeIcon
                  icon={['fas', 'sync-alt']}
                  size={25}
                  colors={['bp-primary', 'bp-primary']}
                  colorsLevel={['500', '500']}
                />
              </Pressable>
            </View>
          )}
        </View>

        {attendersList?.map(
          (
            {
              toolboxMeetingWorker: {
                worker: { firstname, preposition, lastname },
                id,
              },
            },
            index,
          ) => (
            <Animated.View key={index} entering={SlideInLeft.delay(25 + index * 25)}>
              {index !== attendersList.length && <View style={AppStyles.divider} />}
              <View style={[AppStyles.hStack, { marginTop: 20 }]}>
                <FontAwesomeIcon
                  icon={['fad', 'user-helmet-safety']}
                  size={25}
                  colors={['bp-primary', 'bp-primary']}
                  colorsLevel={['500', '500']}
                />
                <Text
                  numberOfLines={1}
                  style={{ marginLeft: 20 }}
                >{`${firstname} ${preposition} ${lastname}`}</Text>
              </View>
            </Animated.View>
          ),
        )}
      </View>
    </>
  );
};
