import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav } from 'app/components';
import CustomModal from 'app/components/app-modal/app-modal';
import { CategoryList } from 'app/components/booklets-list/booklets-category-list';
import { FavoriteToggle } from 'app/components/favorite-toggle/favorite-toggle';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import {
  useWorkerProjectsList,
  useWorkerLastAttendance,
  useApiCallStatus,
  useBookletsList,
} from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { SignedInUser, GlobalRoutes } from 'app/navigation/route-names';
import { workerAttendance } from 'app/services';
import {
  getFavoritesFromLocalStorage,
  updateFavoritesInLocalStorage,
} from 'app/services/favorite-projects';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay, tcatch } from 'app/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { FC } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { SafesightControlls } from '../../safesight/safesight-controlls';

dayjs.extend(utc);

type RouteProps = RouteProp<RoutesTypes, SignedInUser.WORKER_PROJECT_ITEM>;

export const WorkerProjectItem: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const route = useRoute<RouteProps>();
  const projectIdProp = route.params.projectId;
  const otherProjectProp = route.params.otherProject;

  const navigation = useNavigation();
  const responsiveWidth = getResponsiveWidth();

  const [contractorLogo, setContractorLogo] = React.useState('');
  const [mapView, setMapView] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: 52.1917388,
    longitude: 3.0371264,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isAttendanceLoading, setIsAttendanceLoading] = React.useState(false);
  const [projectIsLoaded, setProjectIsLoaded] = React.useState(false);

  // this key determines which favorites list is used in AsyncStorage
  const favoritesKey = 'favoriteProjects';

  const [favoriteProjects, setFavoriteProjects] = React.useState<number[]>([]);
  const [currentProjectIsFavorite, setCurrentProjectIsFavorite] = React.useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclose();
  // Fetch worker projects list
  const { data: projectsList, status: projectItemStatus } = useWorkerProjectsList(otherProjectProp);

  const { data: lastAttendance } = useWorkerLastAttendance();

  const { showData: showProjectItem } = useApiCallStatus(projectItemStatus);

  const projectItem = projectsList?.find(project => project.projectId === Number(projectIdProp));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status: bookletStatus, data: bookletData } = useBookletsList(
    env.PROJECTEN,
    projectItem?.projectId,
  );

  React.useEffect(() => {
    if (projectItem) {
      setProjectIsLoaded(true);
      // make sure the maps loads
      onMapLoading();
      // set contractor logo
      if (projectItem.contractors[0]) {
        setContractorLogo(projectItem.contractors[0].contractorimgfolder);
      }
      // Fetch your list of projects and setProjects accordingly
      //setProjects(projectsList);
      // Retrieve favorites from local storage
      getFavoritesFromLocalStorage('favoriteProjects').then(setFavoriteProjects);
      setCurrentProjectIsFavorite(favoriteProjects.includes(projectItem.projectId));
    }
  }, [projectsList, projectItem]);

  React.useEffect(() => {
    if (projectItem) {
      setCurrentProjectIsFavorite(favoriteProjects.includes(projectItem.projectId));
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
  const [navigate, shoudNavigate] = React.useState(false);

  const logOutWithQrScanner = async () => {
    onClose();
    if (Platform.OS === 'ios') {
      await delay(500);
    }
    shoudNavigate(true);
  };

  React.useEffect(() => {
    if (navigate && !isOpen) {
      shoudNavigate(false);
      navigation.navigate(GlobalRoutes.QR_SCANNER, {
        screenName: SignedInUser.WORKER_PROJECTS,
      });
    }
  }, [navigate]);

  const logOutWithBtn = async () => {
    setIsAttendanceLoading(true);
    const workerAttendancePromise = workerAttendance({
      type: 4,
      dataProps: {
        project: projectIdProp,
      },
    });
    const [data] = await tcatch(workerAttendancePromise);
    if (data) {
      setIsAttendanceLoading(false);
      onClose();
      return;
    }
    setIsAttendanceLoading(false);
  };

  const wasAttended =
    lastAttendance?.[0] && projectItem && projectItem.projectId === lastAttendance[0].projectId;

  const shouldShowAttendanceModal = lastAttendance?.[0] && lastAttendance[0].logtypeId === 2;

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
        title={projectItem ? projectItem.shortdescription : 'Project'}
        leftElement="back"
        rightElement={
          <FavoriteToggle
            id={projectItem?.projectId ?? 0}
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
        style={AppStyles.scrollView}
      >
        {projectIsLoaded && showProjectItem && projectItem ? (
          <>
            <Image
              source={{
                uri: `${'https://portal.bouwpas.nl/_img/'}${contractorLogo}${'/logo.png'}`,
              }}
              style={{
                borderRadius: 16,
                width: '100%',
                height: 30,
                maxWidth: '60%',
                maxHeight: '50%',
                alignSelf: 'center',
                marginTop: 15,
              }}
              resizeMode="contain"
              alt="Logo"
            />
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <View style={[AppStyles.box, { padding: 0 }]}>
                <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                  {projectItem.latitude && projectItem.longitude ? (
                    <View
                      style={{
                        backgroundColor: pickColor({ name: 'bp-primary', shade: 500 }),
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
                  <View style={{ padding: 16 }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'interstate',
                        color: pickColor({ name: 'bp-primary', shade: 500 }),
                        marginVertical: 10,
                      }}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {projectItem.shortdescription}
                    </Text>
                    <Text numberOfLines={1}>
                      {projectItem.contractors?.[0]?.contractorname ?? ''}
                    </Text>
                    <Text>
                      {projectItem.visitingstreetname} {projectItem.visitinghousenumber}{' '}
                      {projectItem.visitinghousenumberextension}
                    </Text>
                    <Text>
                      {projectItem.visitingpostalareacode} {projectItem.visitingpostalcharactercode}{' '}
                      {projectItem.visitingcity}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={AppStyles.invisibleBox}>
                <SafesightControlls
                  projectItem={projectItem}
                  projectType="project"
                  projectId={projectItem.projectId}
                  contractorId={projectItem.contractors[0]['contractorId']}
                />
              </View>
            </View>

            {wasAttended ? (
              <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
                <View>
                  <Text style={AppStyles.headingTitle}>{t('projectDescriptionTableTitle')}</Text>
                </View>

                <View style={AppStyles.box}>
                  {lastAttendance[0] && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={['fad', 'calendar-alt']}
                        size={35}
                        color={pickColor({ name: 'bp-primary', shade: 500 })}
                      />
                      <View
                        style={{
                          marginLeft: 8,
                        }}
                      >
                        <Text>{t('lastAttendance')}:</Text>
                        <Text>
                          {dayjs(lastAttendance[0].loghappenedwhen).format('DD-MM-YYYY')}
                          {` ${t('at')} `}
                          {dayjs(lastAttendance[0].loghappenedwhen).format('HH:mm')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {shouldShowAttendanceModal && (
                    <>
                      <View
                        style={{
                          marginBottom: 16,
                        }}
                      >
                        <TouchableOpacity
                          onPress={onOpen}
                          style={[
                            AppStyles.button,
                            {
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              backgroundColor: pickColor({
                                name: 'bp-support',
                                shade: 500,
                              }),
                              marginTop: 10,
                            },
                          ]}
                        >
                          <>
                            {isAttendanceLoading ? (
                              <ActivityIndicator
                                size="small"
                                color={pickColorSingleShade({ name: 'bp-white' })}
                              />
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={['fas', 'sign-out']}
                                  size={25}
                                  color={pickColorSingleShade({ name: 'bp-white' })}
                                />
                                <Text style={AppStyles.buttonText}>
                                  {t('qrAttendanceSignOutLabel')}
                                </Text>
                              </>
                            )}
                          </>
                        </TouchableOpacity>
                      </View>
                      <CustomModal
                        isOpen={isOpen}
                        onClose={onClose}
                        modalContent={
                          <>
                            <View
                              style={{
                                height: 75,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 30,
                                  fontFamily: 'bilo',
                                }}
                              >
                                {t('qrAttendanceSignOutLabel')}
                              </Text>
                              <Pressable onPress={onClose}>
                                <FontAwesomeIcon
                                  icon={['fas', 'times']}
                                  size={25}
                                  color={pickColor({ name: 'bp-primary', shade: 500 })} // Assuming bp-primary is your color
                                />
                              </Pressable>
                            </View>
                            <View
                              style={{
                                width: '100%',
                              }}
                            >
                              <TouchableOpacity
                                onPress={logOutWithQrScanner}
                                style={[
                                  AppStyles.button,
                                  {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    backgroundColor: pickColor({
                                      name: 'bp-support',
                                      shade: 500,
                                    }),
                                    marginTop: 10,
                                  },
                                ]}
                              >
                                <>
                                  {isAttendanceLoading ? (
                                    <ActivityIndicator
                                      size="small"
                                      color={pickColorSingleShade({ name: 'bp-white' })}
                                    />
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={['fas', 'qrcode']}
                                        size={25}
                                        color={pickColorSingleShade({ name: 'bp-white' })}
                                      />
                                      <Text style={AppStyles.buttonText}>{t('qrScanTitle')}</Text>
                                    </>
                                  )}
                                </>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={logOutWithBtn}
                                style={[
                                  AppStyles.button,
                                  {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    backgroundColor: pickColor({
                                      name: 'bp-support',
                                      shade: 500,
                                    }),
                                    marginTop: 10,
                                  },
                                ]}
                              >
                                <>
                                  {isAttendanceLoading ? (
                                    <ActivityIndicator
                                      size="small"
                                      color={pickColorSingleShade({ name: 'bp-white' })}
                                    />
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={['fas', 'sign-out']}
                                        size={25}
                                        color={pickColorSingleShade({ name: 'bp-white' })}
                                      />
                                      <Text style={AppStyles.buttonText}>
                                        {t('qrAttendanceSignOutLabel')}
                                      </Text>
                                    </>
                                  )}
                                </>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={onClose}
                                style={[
                                  AppStyles.button,
                                  {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    backgroundColor: pickColor({
                                      name: 'bp-support',
                                      shade: 500,
                                    }),
                                    marginTop: 10,
                                  },
                                ]}
                              >
                                <>
                                  {isAttendanceLoading ? (
                                    <ActivityIndicator
                                      size="small"
                                      color={pickColorSingleShade({ name: 'bp-white' })}
                                    />
                                  ) : (
                                    <>
                                      <FontAwesomeIcon
                                        icon={['fas', 'times']}
                                        size={25}
                                        color={pickColorSingleShade({ name: 'bp-white' })}
                                      />
                                      <Text style={AppStyles.buttonText}>
                                        {t('closeButtonLabel')}
                                      </Text>
                                    </>
                                  )}
                                </>
                              </TouchableOpacity>
                            </View>
                          </>
                        }
                      />
                    </>
                  )}
                </View>
              </View>
            ) : null}
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              {bookletData !== undefined && (
                <View>
                  <View>
                    <Text style={AppStyles.headingTitle}>{t('projectsPageTabNav2')}</Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <CategoryList data={bookletData} isProject />
                  </View>
                </View>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};
