import { RouteProp, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav } from 'app/components';
import { FavoriteToggle } from 'app/components/favorite-toggle/favorite-toggle';
import { Text } from 'app/components/text/text';
import { useApiCallStatus, useLiteProjectsList } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import {
  getFavoritesFromLocalStorage,
  updateFavoritesInLocalStorage,
} from 'app/services/favorite-projects';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay } from 'app/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { FC } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { SafesightControlls } from '../../safesight/safesight-controlls';

dayjs.extend(utc);

type RouteProps = RouteProp<RoutesTypes, SignedInUser.LITE_PROJECT_ITEM>;

export const LiteProjectItem: FC = () => {
  const route = useRoute<RouteProps>();
  const projectIdProp = route.params.projectId;

  const responsiveWidth = getResponsiveWidth();

  const [mapView, setMapView] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: 52.1917388,
    longitude: 3.0371264,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [projectIsLoaded, setProjectIsLoaded] = React.useState(false);

  // this key determines which favorites list is used in AsyncStorage
  const favoritesKey = 'favoriteLiteProjects';

  const [favoriteProjects, setFavoriteProjects] = React.useState<number[]>([]);
  const [currentProjectIsFavorite, setCurrentProjectIsFavorite] = React.useState<boolean>(false);

  // Fetch worker projects list
  const { data: projectsList, status: projectItemStatus } = useLiteProjectsList();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showData: showProjectItem, showLoading: showProjectItemLoading } =
    useApiCallStatus(projectItemStatus);

  const projectItem = projectsList?.find(
    project => project.liteProjectId === Number(projectIdProp),
  );

  React.useEffect(() => {
    if (projectItem) {
      setProjectIsLoaded(true);

      // make sure the maps loads
      onMapLoading();

      // Retrieve favorites from local storage
      getFavoritesFromLocalStorage('favoriteLiteProjects').then(setFavoriteProjects);
      setCurrentProjectIsFavorite(favoriteProjects.includes(projectItem.liteProjectId));
    }
  }, [projectsList, projectItem]);

  React.useEffect(() => {
    if (projectItem) {
      setCurrentProjectIsFavorite(favoriteProjects.includes(projectItem.liteProjectId));
    }
  }, [favoriteProjects]);

  const onMapLoading = async () => {
    if (projectItem) {
      if (
        projectItem.latitude !== null &&
        projectItem.latitude !== 0 &&
        projectItem.longitude !== null &&
        projectItem.longitude !== 0
      ) {
        setRegion(prev => ({
          ...prev,
          latitude: projectItem.latitude,
          longitude: projectItem.longitude,
        }));
      }
      await delay(350);
      setMapView(true);
    }
  };

  // handle favorites
  const handleFavoriteChange = (projectId: number, isFavorite: boolean) => {
    // Update the favorites state when a project's favorite status changes
    setFavoriteProjects(favoriteProjects =>
      isFavorite && !favoriteProjects.includes(projectId)
        ? [...favoriteProjects, projectId]
        : favoriteProjects.filter(id => id !== projectId),
    );
    updateFavoritesInLocalStorage(
      favoritesKey,
      projectId,
      isFavorite && !favoriteProjects.includes(projectId),
    );
    setCurrentProjectIsFavorite(isFavorite);
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav
        title={projectItem ? projectItem.projectName : 'Project'}
        leftElement="back"
        rightElement={
          <FavoriteToggle
            id={projectItem?.liteProjectId ?? 0}
            currentIsFavorite={currentProjectIsFavorite}
            favoritesKey={favoritesKey}
            favoritesList={favoriteProjects}
            handler={handleFavoriteChange}
          />
        }
      />
      {!projectIsLoaded ? (
        <Animated.View
          entering={SlideInLeft.duration(25)}
          exiting={SlideOutRight.duration(25)}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        </Animated.View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={(AppStyles.scrollView, { paddingTop: 5 })}
      >
        {projectIsLoaded && showProjectItem && projectItem ? (
          <>
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <View
                style={{
                  backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                  borderRadius: 16,
                  padding: 0,
                  margin: 2,
                  marginBottom: 4,
                  shadowColor: pickColorSingleShade({ name: 'bp-black' }),
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                  marginHorizontal: 11,
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  {projectItem.latitude && projectItem.longitude ? (
                    <View
                      style={{
                        backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                        width: '100%',
                        minHeight: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <>
                        {mapView ? (
                          <MapView
                            region={region}
                            onRegionChangeComplete={(newRegion: any) => setRegion(newRegion)}
                            style={{ flex: 1, width: '100%' }}
                            showsScale
                            showsPointsOfInterest
                            showsBuildings
                            showsMyLocationButton={false}
                            showsUserLocation={false}
                            zoomEnabled
                            zoomControlEnabled={false}
                          >
                            <Marker
                              coordinate={{
                                latitude: projectItem.latitude,
                                longitude: projectItem.longitude,
                              }}
                            />
                          </MapView>
                        ) : null}
                      </>
                    </View>
                  ) : null}
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingTop: 8,
                      paddingBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'interstate',
                        color: pickColor({ name: 'bp-primary', shade: 500 }),
                        marginVertical: 10,
                        flexShrink: 1,
                      }}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {projectItem.projectName}
                    </Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>
                      {projectItem.projectNumber}
                    </Text>
                    <Text numberOfLines={1}>{projectItem.contractorName}</Text>
                    {projectItem.visitingStreetName ? (
                      <Text>
                        {projectItem.visitingStreetName} {projectItem.visitingHouseNumber}{' '}
                        {projectItem.visitingHouseNumberExtension}
                      </Text>
                    ) : null}
                    {projectItem.visitingCity ? (
                      <Text>
                        {projectItem.visitingPostalAreaCode}{' '}
                        {projectItem.visitingPostalCharacterCode} {projectItem.visitingCity}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <View
                style={{
                  margin: 8,
                }}
              >
                <SafesightControlls
                  projectItem={projectItem}
                  projectType="liteProject"
                  projectId={projectItem.liteProjectId}
                  contractorId={Number(projectItem.contractorId)}
                />
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};
