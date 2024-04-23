import { RouteProp, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav, InfoBlock } from 'app/components';
import FloatingActionButton from 'app/components/button-group/floating-action-button';
import { FilterComponent } from 'app/components/onsite-filter/filter-component';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useOnsiteWorkersList, useApiCallStatus, showGroupByZone } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { SignedInUser } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { getRoles } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import { OnsiteWorkersListSortModal } from './onsite-workers-list-sort-modal';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_ONSITE_WORKERS>;

export const OnsiteWorkersList: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const route = useRoute<RouteProps>();
  const responsiveWidth = getResponsiveWidth();

  const {
    data: projectWorkers,
    status: projectsStatus,
    error: projectsListError,
    refetch,
  } = useOnsiteWorkersList(route.params.projectId);
  const showCheckOut: boolean = route.params.showCheckOut;
  const [refreshing, setRefreshing] = React.useState(false);
  const [showZoneFilter, setShowFilterZone] = React.useState<null | boolean>(null);
  const {
    showData: showOnsiteWorkerList,
    showLoading,
    showError: showOnsiteWorkerListError,
  } = useApiCallStatus(projectsStatus);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Action Sheet
  const { isOpen, onToggle } = useDisclose();

  const onSiteWorkersListSortType = useStore.useOnSiteWorkersListSortType();
  const userTypes = useStore.useUserTypes();
  const userIds = userTypes?.user.find(user => user.type === 'accountuser');  
  const roles = getRoles(userTypes);
  const hasRoleBouwplaats = roles.includes(env.ROLE_BOUWPLAATS);

  React.useEffect(() => {
    if (projectWorkers) {
      setShowFilterZone(showGroupByZone(projectWorkers));
    }
  }, [projectWorkers]);

  return (
    <View style={{ flex: 1, backgroundColor: mainColors({ type: 'bg' }) }}>
      <HeaderNav title={t('currentlyOnSiteLabel')} leftElement="back" />
      {showLoading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
        </View>
      )}
      {showOnsiteWorkerList && (
        <View
          style={[
            AppStyles.responsiveWidthBox,
            { width: responsiveWidth, backgroundColor: mainColors({ type: 'bg' }) },
          ]}
        >
          {projectWorkers && !projectWorkers.length && (
            <ScrollView
              style={AppStyles.scrollView}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              <View>
                <InfoBlock
                  title={t('currentlyOnSiteNoWorkers')}
                  type="error"
                  icon={['fad', 'users-slash']}
                />
              </View>
            </ScrollView>
          )}
          {projectWorkers && projectWorkers.length > 0 && (
            <FilterComponent
              data={projectWorkers}
              type={onSiteWorkersListSortType}
              projectId={route.params.projectId}
              accountId={userIds?.accountId}
              refreshing={refreshing}
              onRefresh={onRefresh}
              showCheckOut={showCheckOut}
              userCanSwipe={hasRoleBouwplaats}
            />
          )}
        </View>
      )}
      <FloatingActionButton onPress={onToggle} iconName="layer-group" />
      {showZoneFilter !== null && (
        <OnsiteWorkersListSortModal
          isOpen={isOpen}
          onToggle={onToggle}
          isShowBtnGroupByZone={showZoneFilter}
        />
      )}
    </View>
  );
};
