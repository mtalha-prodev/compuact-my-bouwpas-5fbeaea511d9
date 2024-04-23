import { useNavigation } from '@react-navigation/core';
import { HeaderNav, ToolboxMeetingListItem } from 'app/components';
import { FloatingActionButton } from 'app/components/button-group/floating-action-button';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useToolboxMeetingsList } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

export const GatekeeperToolboxMeetingsList: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const responsiveWidth = getResponsiveWidth();
  const navigation = useNavigation();
  const {
    status: toolboxesListStatus,
    data: toolboxesListData,
    refetch: toolboxesListRefetch,
  } = useToolboxMeetingsList({ type: 2 });

  const {
    showData: showToolboxesList,
    showLoading: showToolboxListLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showError: showToolboxListError,
  } = useApiCallStatus(toolboxesListStatus);

  const onRefresh = async () => {
    setRefreshing(true);
    await toolboxesListRefetch();
    setRefreshing(false);
  };

  const openToolboxItemScreen = (toolboxItemId: number) => () => {
    navigation.navigate(SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM, { toolboxItemId });
  };

  const openHostMeetingScreen = () =>
    navigation.navigate(SignedInUser.GATEKEEPER_HOST_TOOLBOX_MEETING);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
        <HeaderNav title={t('gatekeeperToolboxMettingsTitle')} leftElement="drawer" />

        {showToolboxListLoading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        )}

        {showToolboxesList && toolboxesListData && (
          <ScrollView
            showsVerticalScrollIndicator
            showsHorizontalScrollIndicator={false}
            style={[
              AppStyles.scrollView,
              AppStyles.responsiveWidthBox,
              { width: responsiveWidth, backgroundColor: 'white' },
            ]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {toolboxesListData.map((toolboxItem, index) => (
              <View style={{ paddingTop: 10, paddingHorizontal: 16 }} key={Math.random()}>
                <React.Fragment key={toolboxItem.id}>
                  <ToolboxMeetingListItem
                    toolboxItem={toolboxItem}
                    index={index}
                    onItemPress={openToolboxItemScreen(toolboxItem.id)}
                  />
                  {index !== toolboxesListData.length - 1 && <View style={AppStyles.divider} />}
                </React.Fragment>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {toolboxesListData && (
        <FloatingActionButton onPress={openHostMeetingScreen} iconName="plus" />
      )}
    </>
  );
};
