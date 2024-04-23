import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { TQrContent } from 'app/Types';
import { RoutesTypes } from 'app/Types/nav';
import { TProjectsList } from 'app/Types/projects.types';
import { ButtonTile, HeaderNav } from 'app/components';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import {
  useApiCallStatus,
  useGatekeeperOnsiteAttendance,
  useGatekeeperProjectConfig,
} from 'app/hooks';
import { SafesightControlls } from 'app/layouts/safesight/safesight-controlls';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay, getRoles } from 'app/utils';
import React, { FC } from 'react';
import { Alert, ActivityIndicator, ScrollView, View, Image, RefreshControl } from 'react-native';
import { useQueryClient } from 'react-query';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_PROJECT_ITEM>;

export const GatekeeperProjectItem: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const route = useRoute<RouteProps>();
  const projectId = route.params.projectId;

  const responsiveWidth = getResponsiveWidth();

  const cache = useQueryClient();
  const projectItem = cache
    .getQueryData<TProjectsList>(env.GATEKEEPER_PROJECTS)
    ?.find(d => d.projectId === projectId);

  const { data: onsiteAttendance, status, refetch } = useGatekeeperOnsiteAttendance(projectId);
  const userTypes = useStore.useUserTypes();
  const roles = getRoles(userTypes);
  const hasRoleBouwplaats = roles.includes(env.ROLE_BOUWPLAATS);
  const hasRoleOpdrachtGever = roles.includes(env.ROLE_OPDRACHT_GEVER);

  const { showLoading, showData } = useApiCallStatus(status);
  const {
    data: projectConfig,
    status: configStatus,
    refetch: configRefetch,
  } = useGatekeeperProjectConfig(projectId);
  const { showLoading: showConfigLoading, showData: showConfigData } =
    useApiCallStatus(configStatus);

  const [contractorLogo, setContractorLogo] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [showCheckOut, setShowCheckOut] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    if (!projectConfig) {
      await configRefetch();
    }
    setRefreshing(false);
  };

  // QR code value prop passed to the screen after QR was scanned
  const qrData: TQrContent = route.params?.qrData?.content;

  React.useEffect(() => {
    if (projectItem) {
      if (projectItem.contractors?.[0]) {
        setContractorLogo(projectItem.contractors[0].contractorimgfolder);
      }
    }
  }, [projectItem]);

  React.useEffect(() => {
    if (showConfigData && projectConfig?.legacyConfig) {
      if (projectConfig.legacyConfig.onsiteSecurityAanbiederid === env.BOUWPAS_MANUAL) {
        setShowCheckOut(true);
      }
    }
  }, [showConfigData]);

  const navigation = useNavigation();

  // Function to open QR code scanner
  const openQrScreen = () => {
    navigation.navigate(GlobalRoutes.QR_SCANNER, {
      screenName: SignedInUser.GATEKEEPER_PROJECT_ITEM,
      screenBottomBtn: 'gatekeeper_uuid_scanner',
      screenIdPropName: 'projectId',
      screenId: projectId,
    });
  };
  // Function to check QR code for uuid and navigate to worker-info page if everything ok
  const onQrData = async () => {
    if (qrData) {
      // Schema should be bouwpas and length 36
      // Otherwise ask user to scan QR again
      if (qrData.scheme === 'bouwpas' && qrData.hostname.length === 36) {
        await delay(600);
        navigation.navigate(SignedInUser.GATEKEEPER_QR_WORKER_INFO, {
          workerUuid: qrData.hostname,
          projectId: projectItem?.projectId,
        });
      } else {
        Alert.alert(t('wrongQrCode'), t('tryAgain'), [
          {
            text: 'Nee',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => openQrScreen(),
          },
        ]);
      }
    }
  };

  // Function to Go to list of workers page for currently on site
  const openWorkersScreen = () => {
    navigation.navigate(SignedInUser.GATEKEEPER_ONSITE_WORKERS, { projectId, showCheckOut });
  };

  React.useEffect(() => {
    onQrData();
  }, [qrData]);
  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav
        title={projectItem ? projectItem.shortdescription : t('project')}
        leftElement="back"
      />

      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {showData && projectItem ? (
          <>
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <Image
                source={{
                  uri: `${'https://portal.bouwpas.nl/_img/'}${contractorLogo}${'/logo.png'}`,
                }}
                resizeMode="contain"
                alt="Logo"
                style={{
                  borderRadius: 16,
                  width: '100%',
                  height: 30,
                  maxWidth: '60%',
                  maxHeight: '50%',
                  alignSelf: 'center',
                  marginVertical: 15,
                }}
              />
            </View>
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <View style={AppStyles.invisibleBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {(hasRoleBouwplaats || hasRoleOpdrachtGever) && (
                    <ButtonTile
                      label={t('onsiteNowLabel')}
                      topRightText={showData ? onsiteAttendance?.toString() : undefined}
                      topRightNode={
                        showLoading ? (
                          <ActivityIndicator
                            size="small"
                            color={pickColor({ name: 'bp-primary', shade: 500 })}
                          />
                        ) : undefined
                      }
                      onPress={openWorkersScreen}
                    />
                  )}
                  {hasRoleBouwplaats && (
                    <ButtonTile
                      label={t('badgeScanLabel')}
                      topRightIcon={['fad', 'id-card']}
                      onPress={openQrScreen}
                    />
                  )}
                </View>
              </View>

              <View style={{ margin: 20, marginLeft: 10, marginTop: 10 }}>
                <SafesightControlls
                  projectItem={projectItem}
                  projectType="project"
                  projectId={projectItem.projectId}
                  contractorId={projectItem.contractors[0]['contractorId']}
                />
              </View>
            </View>
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}
          >
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
