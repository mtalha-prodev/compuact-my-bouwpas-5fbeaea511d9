import { useRoute, useNavigation } from '@react-navigation/core';
import { HeaderNav, InfoBlock, FontAwesomeIcon } from 'app/components';
import { WorkerHtmlRender } from 'app/components/html-renderer/worker-html-render';
import { LocalizationContext } from 'app/contexts';
import { useWorkerInfo } from 'app/hooks/react-query/appCalls/gatekeeper/useWorkerInfo';
import { useApiCallStatus } from 'app/hooks/react-query/useApiCallStatus';
import {
  TWorkerInfoProps,
  TWorkerInfo,
} from 'app/layouts/gatekeeper/qr-worker-info/qr-worker-info.types';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const WorkerInfo: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const route = useRoute<TWorkerInfoProps>();

  const responsiveWidth = getResponsiveWidth();
  const navigation = useNavigation();
  const workerid: string = route.params?.workerId;
  const project = route.params?.projectId;
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data: workerInfo,
    status: workerInfoStatus,
    error: workerInfoError,
    refetch,
  } = useWorkerInfo(workerid, project);

  const {
    showData: showWorkerInfo,
    showLoading: showWorkerInfoLoading,
    showError: showWorkerInfoError,
  } = useApiCallStatus(workerInfoStatus);
  const openMakeTeams = ({ workerInfo }: { workerInfo: TWorkerInfo }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return () => {
      navigation.navigate(SignedInUser.GATEKEEPER_MAKE_TEAMS_INFO, {
        makeTeamsInfo: workerInfo.makeTeamsInfo,
      });
    };
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: mainColors({ type: 'bg' }) }}>
      <HeaderNav title={t('workerInfoTitle')} leftElement="back" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={AppStyles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          {/* Worker Info part after scanned UUID */}
          {showWorkerInfoLoading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

          {showWorkerInfoError && workerInfoError && (
            <View>
              {workerInfoError.errorStatus === 403 ? (
                <InfoBlock
                  title={t('uuidAccessDenied')}
                  type="error"
                  icon={['fad', 'exclamation-square']}
                />
              ) : (
                <InfoBlock
                  title={t('errorCode')}
                  type="error"
                  icon={['fad', 'exclamation-square']}
                  apiError={workerInfoError}
                />
              )}
            </View>
          )}

          {showWorkerInfo && workerInfo && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={AppStyles.scrollView}
              >
                {workerInfo.extraInfo && <WorkerHtmlRender html={workerInfo.extraInfo} />}
              </ScrollView>
            </>
          )}
        </View>
        {showWorkerInfo && workerInfo?.makeTeamsInfo && (
          <View style={{ flexDirection: 'column', paddingBottom: 50 }}>
            <TouchableOpacity
              onPress={openMakeTeams({ workerInfo })}
              style={[
                AppStyles.button,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginHorizontal: 10,
                  marginTop: -5,
                  marginBottom: 10,
                },
              ]}
            >
              <FontAwesomeIcon
                icon={['fas', 'file-certificate']}
                size={25}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
              <Text style={AppStyles.buttonText}>{t('certificateBtn')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
