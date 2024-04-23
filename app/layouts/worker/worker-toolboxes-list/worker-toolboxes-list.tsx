import { useNavigation } from '@react-navigation/core';
import { HeaderNav, InfoBlock, ToolboxMeetingListItem } from 'app/components';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useToolboxMeetingsList } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { ActivityIndicator, RefreshControl, View, ScrollView } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { WorkerToolboxQrAttendance } from './worker-toolbox-qr-attendance';

export const WorkerToolboxesList: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const responsiveWidth = getResponsiveWidth();
  const navigation = useNavigation();

  const {
    data: toolboxMeetings,
    status: toolboxMeetingStatus,
    error: toolboxMeetingsError,
    refetch: toolboxesListRefetch,
  } = useToolboxMeetingsList({ type: 1 });

  const { showLoading: showToolboxListLoading } = useApiCallStatus(toolboxMeetingStatus);

  const onRefresh = async () => {
    setRefreshing(true);
    await toolboxesListRefetch();
    setRefreshing(false);
  };

  const openToolboxItemScreen = (toolboxItemId: number) => () => {
    navigation.navigate(SignedInUser.WORKER_TOOLBOX_ITEM, { toolboxItemId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav
        title={t('projectsPageTabNav3')}
        leftElement="drawer"
        rightElement={toolboxMeetings && <WorkerToolboxQrAttendance />}
      />

      {showToolboxListLoading && (
        <Animated.View
          entering={SlideInLeft.duration(25)}
          exiting={SlideOutRight.duration(25)}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator={false}
        style={[AppStyles.scrollView, { backgroundColor: 'white', paddingTop: 16 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {toolboxMeetingsError && (
          <View
            style={{
              marginHorizontal: 8,
              marginVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InfoBlock
              title={t('errorToolboxMeetingsList')}
              icon={['fad', 'exclamation-square']}
              type="error"
              apiError={toolboxMeetingsError}
            />
          </View>
        )}
        {!toolboxMeetingsError &&
          toolboxMeetings &&
          (toolboxMeetings.length > 0 ? (
            toolboxMeetings.map((meeting, index) => (
              <View
                style={[
                  AppStyles.responsiveWidthBox,
                  { width: responsiveWidth, paddingHorizontal: 16 },
                ]}
                key={Math.random()}
              >
                <React.Fragment key={meeting.id}>
                  <ToolboxMeetingListItem
                    toolboxItem={meeting}
                    index={index}
                    onItemPress={openToolboxItemScreen(meeting.id)}
                  />
                  {index !== toolboxMeetings.length - 1 && <View style={AppStyles.divider} />}
                </React.Fragment>
              </View>
            ))
          ) : (
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <InfoBlock title={t('toolboxListEmpty')} icon={['fas', 'info-circle']} type="error" />
            </View>
          ))}
      </ScrollView>
    </View>
  );
};
