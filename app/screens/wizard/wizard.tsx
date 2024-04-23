import { RouteProp, useRoute } from '@react-navigation/native';
import { TQrContent } from 'app/Types';
import { RoutesTypes } from 'app/Types/nav';
import { AppLanguagePicker, FontAwesomeIcon, HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import { useQrRegistration } from 'app/hooks';
import { useAuth } from 'app/hooks/react-query/appCalls/useAuth';
import { GlobalRoutes } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React from 'react';
import { ScrollView, View, ActivityIndicator, TouchableOpacity } from 'react-native';

type RouteProps = RouteProp<RoutesTypes, GlobalRoutes.APP_WIZARD>;

export const Wizard = () => {
  const route = useRoute<RouteProps>();

  const bootstrapState = useStore.useBootstrapState();
  const responsiveWidth = getResponsiveWidth();
  const bgColors = pickColor({ name: 'bp-support', shade: 100 });

  const qrData: TQrContent = route.params?.qrData.content;
  const { authAsync } = useAuth();

  const { openQrScreen, t } = useQrRegistration({
    routeName: route.name,
    qrData,
    authAsync,
  });

  const onCompleteWizard = () => useStore.setState({ wizard: true });

  return (
    <View style={{ flex: 1, backgroundColor: bgColors }}>
      <HeaderNav title={t('wizardTitle')} />

      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View style={AppStyles.invisibleBox}>
            <Text style={AppStyles.headingTitle} numberOfLines={1}>
              {t('switchLanguage')}
            </Text>
          </View>
          <View style={AppStyles.box}>
            <AppLanguagePicker />
          </View>

          <View style={AppStyles.invisibleBox}>
            <Text style={AppStyles.headingTitle}>{t('forWorkersHeading')}</Text>
          </View>

          <View style={AppStyles.box}>
            <TouchableOpacity
              onPress={openQrScreen}
              disabled={bootstrapState.isLoading}
              style={[
                AppStyles.button,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
              ]}
            >
              {bootstrapState.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'qrcode']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={AppStyles.buttonText}>{t('activateOnsiteLabel')}</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={{ fontSize: 18, marginVertical: 2, marginTop: 10 }}>
              {t('qrRegisterSubtitle')}
            </Text>
            <Text style={[AppStyles.fontSizeMd, AppStyles.marginTop2, { fontSize: 18 }]}>
              {t('qrRegisterSubtitle2')}
            </Text>
          </View>

          <View style={AppStyles.invisibleBox}>
            <Text style={AppStyles.headingTitle} numberOfLines={1}>
              {t('forGatekeepersHeading')}
            </Text>
          </View>

          <View style={AppStyles.box}>
            <TouchableOpacity
              onPress={onCompleteWizard}
              disabled={bootstrapState.isLoading}
              style={[
                AppStyles.button,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
              ]}
            >
              {bootstrapState.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'chevron-right']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={AppStyles.buttonText}>{t('next')}</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={[AppStyles.fontSizeMd, AppStyles.marginTop2, { fontSize: 18 }]}>
              {t('continueSubtitle')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
