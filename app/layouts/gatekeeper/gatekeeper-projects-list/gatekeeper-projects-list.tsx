import { useNavigation } from '@react-navigation/core';
import { HeaderNav, InfoBlock, PressableListItem } from 'app/components';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useGatekeeperProjectsList } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

export const GatekeeperProjectsList: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const navigation = useNavigation();
  const {
    data: projectsData,
    status: projectsStatus,
    error: projectsListError,
    refetch,
  } = useGatekeeperProjectsList();
  const { showLoading } = useApiCallStatus(projectsStatus);
  const [refreshing, setRefreshing] = React.useState(false);

  const projectBackdrop = React.useMemo(
    // Function to get image of the project based on project id
    () => (projectId: number) => `${env.IMG_URL}projects/${projectId}.png`,
    //() => (projectId: number) => `https://picsum.photos/200`,
    [],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await delay(100);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('menuItem1')} leftElement="drawer" />

      {showLoading && (
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
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {projectsListError && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <InfoBlock
              title={t('errorProjectsList')}
              icon={['fad', 'exclamation-square']}
              type="error"
              apiError={projectsListError}
            />
          </View>
        )}
        {projectsData?.map((project, index) => (
          <Animated.View
            style={{ marginVertical: 4, marginHorizontal: 0 }}
            key={project.projectId}
            entering={SlideInLeft.duration(25).delay(index * 25)}
            exiting={SlideOutRight.duration(25).delay(index * 25)}
          >
            <PressableListItem
              title={project.shortdescription}
              subtitle={project.contractors[0].contractorname}
              image={projectBackdrop(project.projectId)}
              onPress={() => {
                navigation.navigate(SignedInUser.GATEKEEPER_PROJECT_ITEM, {
                  projectId: project.projectId,
                });
              }}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};
